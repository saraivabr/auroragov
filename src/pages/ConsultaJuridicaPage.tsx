import { useState, useRef, useEffect } from 'react';
import { Send, Scale, BookOpen, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface Consulta {
  id: string;
  pergunta: string;
  resposta: string;
  normas_relacionadas: any[];
  confiabilidade: string;
  feedback?: string;
  created_at: string;
}

export function ConsultaJuridicaPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pergunta, setPergunta] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConsultas();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consultas]);

  const fetchConsultas = async () => {
    const { data, error } = await supabase
      .from('consultas_juridicas')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Erro ao carregar consultas:', error);
      return;
    }

    setConsultas(data as Consulta[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pergunta.trim() || isLoading) return;

    const userPergunta = pergunta;
    setPergunta('');
    setIsLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/consulta-juridica`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pergunta: userPergunta,
          userId: user?.id || 'anonymous'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar consulta');
      }

      const result = await response.json();

      const { data, error } = await supabase
        .from('consultas_juridicas')
        .insert([{
          user_id: user?.id,
          user_name: user?.email || 'Usuário',
          pergunta: userPergunta,
          resposta: result.resposta,
          normas_relacionadas: result.normas_relacionadas,
          confiabilidade: result.confiabilidade
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar consulta:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível salvar a consulta',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      setConsultas(prev => [...prev, data as Consulta]);
    } catch (error) {
      console.error('Erro na consulta:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao processar consulta',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (consultaId: string, feedback: 'positivo' | 'negativo') => {
    const { error } = await supabase
      .from('consultas_juridicas')
      .update({ feedback })
      .eq('id', consultaId);

    if (error) {
      console.error('Erro ao enviar feedback:', error);
      return;
    }

    setConsultas(prev =>
      prev.map(c => c.id === consultaId ? { ...c, feedback } : c)
    );

    toast({
      title: 'Feedback registrado',
      description: 'Obrigado por sua avaliação!'
    });
  };

  const sugestoes = [
    'Como funciona o processo licitatório pela Lei 8.666/93?',
    'Quais são os prazos para resposta de pedidos de acesso à informação?',
    'Explique as regras da LGPD para órgãos públicos',
    'Quando é possível fazer contratação direta sem licitação?',
    'Quais são os princípios da administração pública?'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Consulta Jurídica</h1>
              <p className="text-gray-600">Consulte leis, decretos e portarias com explicações contextualizadas</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-250px)] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Consultas
                </CardTitle>
              </CardHeader>
              <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                {consultas.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4 max-w-md">
                      <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                        <Scale className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Nenhuma consulta ainda
                        </h3>
                        <p className="text-sm text-gray-600">
                          Faça sua primeira pergunta jurídica ou selecione uma das sugestões ao lado
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {consultas.map((consulta) => (
                      <div key={consulta.id} className="space-y-4">
                        <div className="flex justify-end">
                          <div className="max-w-[80%] bg-blue-500 text-white rounded-2xl px-4 py-3">
                            <p className="text-sm leading-relaxed">{consulta.pergunta}</p>
                          </div>
                        </div>

                        <div className="flex justify-start">
                          <div className="max-w-[85%] space-y-3">
                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {consulta.confiabilidade === 'alta' ? 'Alta confiabilidade' : 'Confiabilidade média'}
                                </Badge>
                              </div>
                              <div className="prose prose-sm max-w-none">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                  {consulta.resposta}
                                </p>
                              </div>
                            </div>

                            {consulta.normas_relacionadas && consulta.normas_relacionadas.length > 0 && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs font-semibold text-blue-900 mb-2">Normas Relacionadas:</p>
                                <div className="space-y-1">
                                  {consulta.normas_relacionadas.map((norma: any, idx: number) => (
                                    <p key={idx} className="text-xs text-blue-800">
                                      • {norma.tipo} {norma.numero}, Art. {norma.artigo} - {norma.ementa}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-500">Esta resposta foi útil?</p>
                              <Button
                                size="sm"
                                variant={consulta.feedback === 'positivo' ? 'default' : 'outline'}
                                className="h-7 px-2"
                                onClick={() => handleFeedback(consulta.id, 'positivo')}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant={consulta.feedback === 'negativo' ? 'default' : 'outline'}
                                className="h-7 px-2"
                                onClick={() => handleFeedback(consulta.id, 'negativo')}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <span className="text-sm text-gray-600 ml-2">Analisando legislação...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <div className="border-t p-4">
                <form onSubmit={handleSubmit}>
                  <div className="flex gap-2">
                    <Textarea
                      value={pergunta}
                      onChange={(e) => setPergunta(e.target.value)}
                      placeholder="Digite sua consulta jurídica..."
                      className="min-h-[60px] resize-none"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={!pergunta.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultas Frequentes</CardTitle>
                <CardDescription>Clique para fazer a pergunta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sugestoes.map((sugestao, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPergunta(sugestao)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors text-sm"
                  >
                    {sugestao}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                  <AlertCircle className="w-5 h-5" />
                  Aviso Legal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-amber-800 leading-relaxed">
                  As informações fornecidas têm caráter orientativo e não substituem
                  pareceres jurídicos oficiais. Sempre verifique a legislação atualizada
                  e consulte a assessoria jurídica do órgão quando necessário.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
