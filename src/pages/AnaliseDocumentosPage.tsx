import { useState } from 'react';
import { FileSearch, Upload, AlertTriangle, CheckCircle2, FileText, Download } from 'lucide-react';
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

interface Analise {
  id: string;
  titulo: string;
  tipo_documento: string;
  resumo: string;
  pontos_criticos: any[];
  checklist: any[];
  riscos_identificados: any[];
  status: string;
  created_at: string;
}

export function AnaliseDocumentosPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tipoDocumento, setTipoDocumento] = useState('edital');
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analiseAtual, setAnaliseAtual] = useState<Analise | null>(null);

  const handleAnalisar = async () => {
    if (!conteudo.trim() || !titulo.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o título e o conteúdo do documento',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await callEdgeFunction<{
        resumo: string;
        pontos_criticos: any[];
        checklist: any[];
        riscos_identificados: any[];
        tokens_usados?: number;
      }>('analise-documentos', {
        method: 'POST',
        body: JSON.stringify({ tipoDocumento, titulo, conteudo })
      });

      const { data, error } = await supabase
        .from('analises_documentos')
        .insert([{
          user_id: user?.id,
          user_name: user?.email || 'Usuário',
          tipo_documento: tipoDocumento,
          titulo,
          conteudo_original: conteudo,
          resumo: result.resumo,
          pontos_criticos: result.pontos_criticos,
          checklist: result.checklist,
          riscos_identificados: result.riscos_identificados,
          status: 'concluido'
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar análise:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível salvar a análise',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      setAnaliseAtual(data as Analise);
      toast({
        title: 'Análise concluída!',
        description: 'O documento foi analisado com sucesso'
      });
    } catch (error) {
      console.error('Erro na análise:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao analisar documento',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeveridadeColor = (sev: string) => {
    switch (sev) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-300';
      case 'média': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conforme': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'atencao': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Análise de Documentos</h1>
              <p className="text-gray-600">Analise editais, contratos e normativos com inteligência artificial</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Documento para Análise</CardTitle>
              <CardDescription>Insira ou cole o conteúdo do documento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edital">Edital</SelectItem>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="parecer">Parecer</SelectItem>
                    <SelectItem value="normativo">Normativo</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Título do Documento</Label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Edital Pregão 001/2024"
                />
              </div>

              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <Textarea
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  placeholder="Cole ou digite o texto do documento aqui..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAnalisar}
                  disabled={isLoading || !conteudo.trim() || !titulo.trim()}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-4 h-4 mr-2" />
                      Analisar Documento
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <div>
            {!analiseAtual && !isLoading && (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <FileSearch className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aguardando documento
                  </h3>
                  <p className="text-sm text-gray-600">
                    Insira o conteúdo do documento e clique em "Analisar" para ver os resultados
                  </p>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card>
                <CardContent className="p-8 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analisando documento...</h3>
                    <p className="text-sm text-gray-600">Processando conteúdo e identificando pontos críticos</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 rounded-full animate-pulse" style={{ width: '75%' }} />
                    </div>
                    <p className="text-xs text-gray-500 text-center">Isso pode levar alguns segundos...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {analiseAtual && !isLoading && (
              <Tabs defaultValue="resumo" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="resumo">Resumo</TabsTrigger>
                  <TabsTrigger value="criticos">Críticos</TabsTrigger>
                  <TabsTrigger value="checklist">Checklist</TabsTrigger>
                  <TabsTrigger value="riscos">Riscos</TabsTrigger>
                </TabsList>

                <TabsContent value="resumo">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Resumo da Análise
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Exportar
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {analiseAtual.resumo}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="criticos">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pontos Críticos</CardTitle>
                      <CardDescription>Itens que requerem atenção especial</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analiseAtual.pontos_criticos.map((ponto: any, idx: number) => (
                        <div key={idx} className="p-4 border rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{ponto.item}</h4>
                            <Badge className={getSeveridadeColor(ponto.severidade)}>
                              {ponto.severidade}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{ponto.descricao}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="checklist">
                  <Card>
                    <CardHeader>
                      <CardTitle>Checklist de Conformidade</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {analiseAtual.checklist.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                          {getStatusIcon(item.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm">{item.item}</p>
                              <Badge variant="outline" className="text-xs">
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{item.observacao}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="riscos">
                  <Card>
                    <CardHeader>
                      <CardTitle>Riscos Identificados</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analiseAtual.riscos_identificados.map((risco: any, idx: number) => (
                        <div key={idx} className="p-4 border rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{risco.tipo}</Badge>
                            <div className="flex gap-2">
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                P: {risco.probabilidade}
                              </Badge>
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                I: {risco.impacto}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{risco.descricao}</p>
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
