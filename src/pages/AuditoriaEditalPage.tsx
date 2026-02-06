import { useState, useRef } from 'react';
import {
  ShieldCheck, Upload, AlertTriangle, CheckCircle2, XCircle,
  FileText, Scale, ShieldAlert, ClipboardCheck, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { callEdgeFunction } from '@/lib/edge-functions';
import { extractTextFromPdf } from '@/lib/pdf-utils';
import type { AuditoriaEdital, PontoCritico, PontoDefensavel, ChecklistItem, ScoreSection } from '@/types/auditoria-edital';

export function AuditoriaEditalPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tipoDocumento, setTipoDocumento] = useState<string>('edital');
  const [titulo, setTitulo] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [auditoria, setAuditoria] = useState<AuditoriaEdital | null>(null);

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({ title: 'Arquivo inválido', description: 'Selecione um arquivo PDF', variant: 'destructive' });
      return;
    }

    setIsExtractingPdf(true);
    try {
      const text = await extractTextFromPdf(file);
      setConteudo(text);
      if (!titulo) setTitulo(file.name.replace(/\.pdf$/i, ''));
      toast({ title: 'PDF carregado', description: `${text.length} caracteres extraídos` });
    } catch (err) {
      console.error('Erro ao extrair PDF:', err);
      toast({ title: 'Erro', description: 'Não foi possível extrair o texto do PDF', variant: 'destructive' });
    } finally {
      setIsExtractingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAuditar = async () => {
    if (!conteudo.trim() || !titulo.trim()) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha o título e o conteúdo do documento', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      const result = await callEdgeFunction<AuditoriaEdital & { modelo_utilizado?: string; tokens_usados?: number }>(
        'auditar-edital',
        {
          method: 'POST',
          body: JSON.stringify({ tipoDocumento, titulo, conteudo, modalidade: modalidade || undefined }),
        }
      );

      // Salvar no banco
      const { error } = await supabase
        .from('analises_documentos')
        .insert([{
          user_id: user?.id,
          user_name: user?.email || 'Usuário',
          tipo_documento: tipoDocumento,
          titulo,
          conteudo_original: conteudo,
          resumo: result.diagnostico_geral?.resumo_executivo || '',
          pontos_criticos: result.pontos_criticos,
          checklist: result.checklist,
          diagnostico_geral: result.diagnostico_geral,
          pontos_defensaveis: result.pontos_defensaveis,
          score_impugnacao: result.score_impugnacao,
          agent_type: 'edital_auditor',
          status: 'concluido',
        }]);

      if (error) {
        console.error('Erro ao salvar auditoria:', error);
      }

      setAuditoria(result);
      toast({ title: 'Auditoria concluída!', description: 'O documento foi auditado com sucesso' });
    } catch (error) {
      console.error('Erro na auditoria:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao auditar documento',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiscoColor = (risco: string) => {
    switch (risco) {
      case 'Alto': return 'bg-red-100 text-red-800 border-red-300';
      case 'Médio': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Baixo': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiscoBorderColor = (risco: string) => {
    switch (risco) {
      case 'Alto': return 'border-l-red-500';
      case 'Médio': return 'border-l-yellow-500';
      case 'Baixo': return 'border-l-green-500';
      default: return 'border-l-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conforme': return <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />;
      case 'atencao': return <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />;
      case 'nao_conforme': return <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
      default: return <FileText className="w-5 h-5 text-gray-600 shrink-0" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'conforme': return 'Conforme';
      case 'atencao': return 'Atenção';
      case 'nao_conforme': return 'Não Conforme';
      default: return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const checklistStats = auditoria?.checklist
    ? {
        conforme: auditoria.checklist.filter((i) => i.status === 'conforme').length,
        atencao: auditoria.checklist.filter((i) => i.status === 'atencao').length,
        nao_conforme: auditoria.checklist.filter((i) => i.status === 'nao_conforme').length,
        total: auditoria.checklist.length,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Auditor de Editais</h1>
              <p className="text-gray-600">Auditoria de licitações com base na Lei 14.133/2021 e jurisprudência TCU</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Documento para Auditoria</CardTitle>
              <CardDescription>Insira o edital, termo de referência ou estudo técnico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edital">Edital de Licitação</SelectItem>
                    <SelectItem value="termo_referencia">Termo de Referência</SelectItem>
                    <SelectItem value="estudo_tecnico">Estudo Técnico Preliminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Título do Documento</Label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Pregão Eletrônico nº 001/2025 - Serviços de TI"
                />
              </div>

              <div className="space-y-2">
                <Label>Modalidade de Licitação</Label>
                <Select value={modalidade} onValueChange={setModalidade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pregao_eletronico">Pregão Eletrônico</SelectItem>
                    <SelectItem value="pregao_presencial">Pregão Presencial</SelectItem>
                    <SelectItem value="concorrencia">Concorrência</SelectItem>
                    <SelectItem value="dialogo_competitivo">Diálogo Competitivo</SelectItem>
                    <SelectItem value="concurso">Concurso</SelectItem>
                    <SelectItem value="leilao">Leilão</SelectItem>
                    <SelectItem value="dispensa">Dispensa de Licitação</SelectItem>
                    <SelectItem value="inexigibilidade">Inexigibilidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Conteúdo do Documento</Label>
                <Textarea
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  placeholder="Cole o texto do edital, termo de referência ou estudo técnico aqui..."
                  className="min-h-[250px] font-mono text-sm"
                />
                {conteudo && (
                  <p className="text-xs text-gray-500">{conteudo.length.toLocaleString()} caracteres</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAuditar}
                  disabled={isLoading || !conteudo.trim() || !titulo.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Auditando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Auditar Documento
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleUploadPdf}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtractingPdf}
                >
                  {isExtractingPdf ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coluna Direita - Resultados */}
          <div>
            {!auditoria && !isLoading && (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aguardando documento
                  </h3>
                  <p className="text-sm text-gray-600">
                    Insira o conteúdo do edital e clique em "Auditar" para receber a análise jurídica completa
                  </p>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card>
                <CardContent className="p-8 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Auditando documento...</h3>
                    <p className="text-sm text-gray-600">Analisando conformidade com a Lei 14.133/2021 e jurisprudência</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-indigo-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: '75%' }} />
                    </div>
                    <p className="text-xs text-gray-500 text-center">Isso pode levar até 30 segundos...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {auditoria && !isLoading && (
              <Tabs defaultValue="diagnostico" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="diagnostico" className="text-xs px-1">
                    <Scale className="w-3 h-3 mr-1 hidden sm:inline" />
                    Diagnóstico
                  </TabsTrigger>
                  <TabsTrigger value="criticos" className="text-xs px-1">
                    <ShieldAlert className="w-3 h-3 mr-1 hidden sm:inline" />
                    Críticos
                  </TabsTrigger>
                  <TabsTrigger value="defensaveis" className="text-xs px-1">
                    <CheckCircle2 className="w-3 h-3 mr-1 hidden sm:inline" />
                    Defensáveis
                  </TabsTrigger>
                  <TabsTrigger value="checklist" className="text-xs px-1">
                    <ClipboardCheck className="w-3 h-3 mr-1 hidden sm:inline" />
                    Checklist
                  </TabsTrigger>
                  <TabsTrigger value="score" className="text-xs px-1">
                    <BarChart3 className="w-3 h-3 mr-1 hidden sm:inline" />
                    Score
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Diagnóstico Geral */}
                <TabsContent value="diagnostico">
                  <Card>
                    <CardHeader>
                      <CardTitle>Diagnóstico Geral</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Risco de Impugnação:</span>
                          <Badge className={getRiscoColor(auditoria.diagnostico_geral.risco_impugnacao)}>
                            {auditoria.diagnostico_geral.risco_impugnacao}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Risco de Nulidade:</span>
                          <Badge className={getRiscoColor(auditoria.diagnostico_geral.risco_nulidade)}>
                            {auditoria.diagnostico_geral.risco_nulidade}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-2">Resumo Executivo</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {auditoria.diagnostico_geral.resumo_executivo}
                        </p>
                      </div>

                      {auditoria.diagnostico_geral.principais_problemas?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Principais Problemas</h4>
                          <ul className="space-y-2">
                            {auditoria.diagnostico_geral.principais_problemas.map((p, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                                <span className="text-gray-700">{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab 2: Pontos Críticos */}
                <TabsContent value="criticos">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pontos Críticos</CardTitle>
                      <CardDescription>
                        {auditoria.pontos_criticos.length} ponto(s) identificado(s) que requerem atenção
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {auditoria.pontos_criticos.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Nenhum ponto crítico identificado</p>
                      ) : (
                        auditoria.pontos_criticos.map((ponto: PontoCritico, idx: number) => (
                          <div
                            key={idx}
                            className={`p-4 border border-l-4 rounded-lg bg-white ${getRiscoBorderColor(ponto.risco_juridico)}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{ponto.item}</h4>
                              <Badge className={getRiscoColor(ponto.risco_juridico)}>
                                {ponto.risco_juridico}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{ponto.problema}</p>
                            <div className="flex flex-col gap-1 text-xs">
                              <span className="text-indigo-700 font-medium">Base Legal: {ponto.base_legal}</span>
                              <span className="text-green-700">Sugestão: {ponto.sugestao_ajuste}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab 3: Pontos Defensáveis */}
                <TabsContent value="defensaveis">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pontos Defensáveis</CardTitle>
                      <CardDescription>
                        Cláusulas que parecem restritivas mas possuem suporte legal
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(!auditoria.pontos_defensaveis || auditoria.pontos_defensaveis.length === 0) ? (
                        <p className="text-sm text-gray-500 text-center py-4">Nenhum ponto defensável identificado</p>
                      ) : (
                        auditoria.pontos_defensaveis.map((ponto: PontoDefensavel, idx: number) => (
                          <div key={idx} className="p-4 border border-l-4 border-l-green-500 rounded-lg bg-white">
                            <h4 className="font-semibold text-gray-900 mb-1">{ponto.item}</h4>
                            <p className="text-sm text-gray-700 mb-2 italic">"{ponto.clausula}"</p>
                            <div className="flex flex-col gap-1 text-xs">
                              <span className="text-indigo-700 font-medium">Base Legal: {ponto.base_legal}</span>
                              <span className="text-blue-700">Jurisprudência: {ponto.jurisprudencia}</span>
                              <span className="text-gray-600 mt-1">{ponto.argumento_tecnico}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab 4: Checklist */}
                <TabsContent value="checklist">
                  <Card>
                    <CardHeader>
                      <CardTitle>Checklist de Conformidade</CardTitle>
                      {checklistStats && (
                        <CardDescription>
                          <div className="flex gap-4 mt-2">
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="w-3 h-3" /> {checklistStats.conforme} conforme
                            </span>
                            <span className="flex items-center gap-1 text-yellow-600">
                              <AlertTriangle className="w-3 h-3" /> {checklistStats.atencao} atenção
                            </span>
                            <span className="flex items-center gap-1 text-red-600">
                              <XCircle className="w-3 h-3" /> {checklistStats.nao_conforme} não conforme
                            </span>
                          </div>
                          {/* Barra de progresso */}
                          <div className="flex h-2 rounded-full overflow-hidden mt-2 bg-gray-200">
                            {checklistStats.conforme > 0 && (
                              <div
                                className="bg-green-500"
                                style={{ width: `${(checklistStats.conforme / checklistStats.total) * 100}%` }}
                              />
                            )}
                            {checklistStats.atencao > 0 && (
                              <div
                                className="bg-yellow-500"
                                style={{ width: `${(checklistStats.atencao / checklistStats.total) * 100}%` }}
                              />
                            )}
                            {checklistStats.nao_conforme > 0 && (
                              <div
                                className="bg-red-500"
                                style={{ width: `${(checklistStats.nao_conforme / checklistStats.total) * 100}%` }}
                              />
                            )}
                          </div>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {auditoria.checklist.map((item: ChecklistItem, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                          {getStatusIcon(item.status)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm">{item.item}</p>
                              <Badge variant="outline" className="text-xs shrink-0 ml-2">
                                {getStatusLabel(item.status)}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{item.observacao}</p>
                            {item.base_legal && (
                              <p className="text-xs text-indigo-600 mt-1">{item.base_legal}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab 5: Score de Impugnação */}
                <TabsContent value="score">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Score de Impugnação
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getScoreColor(auditoria.score_impugnacao.score_total)}`}>
                            {auditoria.score_impugnacao.score_total}/100
                          </div>
                          <p className="text-xs text-gray-500 font-normal">
                            {auditoria.score_impugnacao.risco_geral}
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {auditoria.score_impugnacao.sections?.map((section: ScoreSection, idx: number) => (
                        <div key={idx} className="p-3 border rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm text-gray-900">{section.secao}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getRiscoColor(section.risco)}>{section.risco}</Badge>
                              <span className={`text-sm font-bold ${getScoreColor(section.pontuacao)}`}>
                                {section.pontuacao}
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <div
                              className={`h-full rounded-full ${getScoreBarColor(section.pontuacao)}`}
                              style={{ width: `${section.pontuacao}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600">{section.justificativa}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
