import { useState, useEffect } from 'react';
import { FileText, Copy, Download, Save, FileCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface Template {
  id: string;
  tipo: string;
  titulo: string;
  conteudo: string;
}

export function GeradorDocumentosPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tipoDocumento, setTipoDocumento] = useState('oficio');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);

  const [titulo, setTitulo] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [assunto, setAssunto] = useState('');
  const [corpo, setCorpo] = useState('');
  const [documentoGerado, setDocumentoGerado] = useState('');
  const [isImprovingText, setIsImprovingText] = useState(false);

  useEffect(() => {
    fetchTemplates();
    fetchDocumentos();
  }, []);

  const fetchTemplates = async () => {
    const { data } = await supabase
      .from('documentos_oficiais')
      .select('*')
      .eq('is_template', true)
      .order('created_at', { ascending: false });

    if (data) setTemplates(data as Template[]);
  };

  const fetchDocumentos = async () => {
    const { data } = await supabase
      .from('documentos_oficiais')
      .select('*')
      .eq('is_template', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setDocumentos(data);
  };

  const handleMelhorarTexto = async () => {
    if (!corpo.trim()) {
      toast({
        title: 'Campo vazio',
        description: 'Digite algum texto no corpo do documento antes de melhorar',
        variant: 'destructive'
      });
      return;
    }

    setIsImprovingText(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/gerador-documentos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipoDocumento,
          conteudo: corpo,
          contexto: assunto || 'Documento oficial',
          userId: user?.id || 'anonymous'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao melhorar texto');
      }

      const result = await response.json();
      setCorpo(result.texto_melhorado);

      toast({
        title: 'Texto melhorado!',
        description: 'O texto foi reformulado seguindo padrões de redação oficial'
      });
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao melhorar texto',
        variant: 'destructive'
      });
    } finally {
      setIsImprovingText(false);
    }
  };

  const handleGerar = () => {
    if (!titulo || !destinatario || !assunto || !corpo) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos para gerar o documento',
        variant: 'destructive'
      });
      return;
    }

    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let documento = '';

    switch (tipoDocumento) {
      case 'oficio':
        documento = `OFÍCIO Nº ${numeroDocumento || '[NÚMERO]'}/2024

Brasília, ${dataAtual}

${destinatario}

Assunto: ${assunto}

Senhor(a) ${destinatario},

${corpo}

Atenciosamente,

_______________________________
${user?.email || 'Nome do Servidor'}
[Cargo/Função]
[Órgão/Setor]`;
        break;

      case 'memorando':
        documento = `MEMORANDO Nº ${numeroDocumento || '[NÚMERO]'}/2024

PARA: ${destinatario}
DE: ${user?.email || 'Nome do Servidor'}
ASSUNTO: ${assunto}

${corpo}

${dataAtual}

_______________________________
${user?.email || 'Nome do Servidor'}
[Cargo/Função]`;
        break;

      case 'parecer':
        documento = `PARECER Nº ${numeroDocumento || '[NÚMERO]'}/2024

I - DO ASSUNTO
${assunto}

II - ANÁLISE
${corpo}

III - CONCLUSÃO
[A completar conforme análise]

IV - PROPOSTA DE ENCAMINHAMENTO
[A completar]

Brasília, ${dataAtual}

_______________________________
${user?.email || 'Nome do Servidor'}
[Cargo/Função]`;
        break;

      case 'despacho':
        documento = `DESPACHO Nº ${numeroDocumento || '[NÚMERO]'}/2024

PROCESSO/DOCUMENTO: ${assunto}

${corpo}

Brasília, ${dataAtual}

_______________________________
${user?.email || 'Nome do Servidor'}
[Cargo/Função]`;
        break;

      default:
        documento = corpo;
    }

    setDocumentoGerado(documento);
  };

  const handleSalvar = async () => {
    if (!documentoGerado) return;

    const { error } = await supabase
      .from('documentos_oficiais')
      .insert([{
        user_id: user?.id,
        user_name: user?.email || 'Usuário',
        tipo: tipoDocumento,
        titulo,
        conteudo: documentoGerado,
        destinatario,
        numero_documento: numeroDocumento,
        is_template: false,
        status: 'rascunho'
      }]);

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o documento',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Documento salvo!',
      description: 'O documento foi salvo como rascunho'
    });

    fetchDocumentos();
  };

  const handleCopiar = () => {
    navigator.clipboard.writeText(documentoGerado);
    toast({
      title: 'Copiado!',
      description: 'Documento copiado para a área de transferência'
    });
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([documentoGerado], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${tipoDocumento}_${numeroDocumento || 'documento'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerador de Documentos Oficiais</h1>
              <p className="text-gray-600">Crie ofícios, memorandos, pareceres e despachos com padrão oficial</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="gerar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="gerar">Gerar Documento</TabsTrigger>
            <TabsTrigger value="recentes">Documentos Recentes</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="gerar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados do Documento</CardTitle>
                  <CardDescription>Preencha as informações necessárias</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Documento</Label>
                    <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oficio">Ofício</SelectItem>
                        <SelectItem value="memorando">Memorando</SelectItem>
                        <SelectItem value="parecer">Parecer</SelectItem>
                        <SelectItem value="despacho">Despacho</SelectItem>
                        <SelectItem value="portaria">Portaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Número</Label>
                      <Input
                        value={numeroDocumento}
                        onChange={(e) => setNumeroDocumento(e.target.value)}
                        placeholder="Ex: 001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Título interno"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Destinatário</Label>
                    <Input
                      value={destinatario}
                      onChange={(e) => setDestinatario(e.target.value)}
                      placeholder="Nome do destinatário ou órgão"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Assunto</Label>
                    <Input
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                      placeholder="Assunto do documento"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Corpo do Texto</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleMelhorarTexto}
                        disabled={isImprovingText || !corpo.trim()}
                        className="h-7"
                      >
                        {isImprovingText ? (
                          <>
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                            Melhorando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 mr-1" />
                            Melhorar com IA
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      value={corpo}
                      onChange={(e) => setCorpo(e.target.value)}
                      placeholder="Digite o conteúdo principal do documento..."
                      className="min-h-[200px]"
                    />
                  </div>

                  <Button
                    onClick={handleGerar}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    Gerar Documento
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Documento Gerado
                    <div className="flex gap-2">
                      {documentoGerado && (
                        <>
                          <Button size="sm" variant="outline" onClick={handleCopiar}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleDownload}>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleSalvar}>
                            <Save className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {documentoGerado ? (
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 min-h-[500px]">
                      <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-800">
                        {documentoGerado}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">
                          Preencha os dados e clique em "Gerar Documento"
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recentes">
            <Card>
              <CardHeader>
                <CardTitle>Documentos Recentes</CardTitle>
                <CardDescription>Seus últimos documentos gerados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentos.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-600">Nenhum documento gerado ainda</p>
                    </div>
                  ) : (
                    documentos.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.titulo}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{doc.tipo}</Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Templates Disponíveis</CardTitle>
                <CardDescription>Modelos pré-configurados para agilizar seu trabalho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Ofício Padrão', 'Memorando Interno', 'Parecer Técnico', 'Despacho Administrativo'].map((nome, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:border-purple-400 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{nome}</p>
                          <p className="text-xs text-gray-500">Template oficial</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Usar Template
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
