import { useState } from 'react';
import { ModelSelector } from '@/components/dashboard/ModelSelector';
import { useModels } from '@/hooks/useModels';
import { useModelPreferences } from '@/hooks/useModelPreferences';
import { useUsageStats } from '@/hooks/useUsageStats';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, BarChart3 } from 'lucide-react';

export default function OpenRouterTestPage() {
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState<string>('openai/gpt-4o-mini');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastCost, setLastCost] = useState<number | null>(null);
  const [lastTokens, setLastTokens] = useState<{ input: number; output: number } | null>(null);

  const { models, loading: modelsLoading } = useModels();
  const { stats, loading: statsLoading } = useUsageStats(user?.id, 'month');

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    setLoading(true);
    setResponse('');
    setLastCost(null);
    setLastTokens(null);

    try {
      const conversationId = crypto.randomUUID();

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-agent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message,
          userId: user.id,
          modelId: selectedModel,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao enviar mensagem');
      }

      const data = await res.json();
      setResponse(data.response);
      setLastCost(data.cost_usd);
      setLastTokens({
        input: data.tokens_input,
        output: data.tokens_output,
      });
    } catch (error) {
      console.error('Erro:', error);
      setResponse(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedModelInfo = models.find(m => m.model_id === selectedModel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">OpenRouter Integration Test</h1>
          <p className="text-slate-300">Teste de integração com múltiplos modelos de IA</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Chat de Teste</CardTitle>
              <CardDescription>
                Envie mensagens e teste diferentes modelos de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Selecione o Modelo de IA
                </label>
                <ModelSelector
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                  showPrice={true}
                  showDescription={true}
                />
              </div>

              {selectedModelInfo && (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedModelInfo.provider}</Badge>
                    {selectedModelInfo.is_recommended && (
                      <Badge variant="default">Recomendado</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedModelInfo.description}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>
                      Contexto: {selectedModelInfo.context_length?.toLocaleString()} tokens
                    </span>
                    <span>
                      Entrada: ${selectedModelInfo.pricing_input}/1M
                    </span>
                    <span>
                      Saída: ${selectedModelInfo.pricing_output}/1M
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sua Mensagem
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
                  rows={4}
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={loading || !message.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensagem
                  </>
                )}
              </Button>

              {response && (
                <div className="space-y-2">
                  <label className="text-sm font-medium block">
                    Resposta da IA
                  </label>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{response}</p>
                  </div>

                  {lastCost && lastTokens && (
                    <div className="flex gap-4 text-sm">
                      <Badge variant="outline">
                        Tokens: {lastTokens.input + lastTokens.output}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({lastTokens.input}↑ / {lastTokens.output}↓)
                        </span>
                      </Badge>
                      <Badge variant="outline">
                        Custo: ${lastCost.toFixed(6)}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estatísticas do Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : stats ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">{stats.total_messages}</div>
                      <div className="text-sm text-muted-foreground">Mensagens</div>
                    </div>

                    <div>
                      <div className="text-2xl font-bold">
                        {(stats.total_tokens_input + stats.total_tokens_output).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Tokens</div>
                    </div>

                    <div>
                      <div className="text-2xl font-bold">
                        ${stats.total_cost_usd.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Custo Total</div>
                    </div>

                    {stats.by_model.length > 0 && (
                      <div className="pt-4 border-t">
                        <div className="text-sm font-medium mb-2">Modelos Mais Usados</div>
                        <div className="space-y-2">
                          {stats.by_model.slice(0, 5).map((model) => (
                            <div key={model.model_id} className="flex justify-between text-sm">
                              <span className="truncate">{model.display_name}</span>
                              <span className="text-muted-foreground">
                                {model.percentage.toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma estatística disponível ainda
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modelos Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                {modelsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Total: {models.length} modelos
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(models.map(m => m.provider))).map(provider => (
                        <Badge key={provider} variant="secondary">
                          {provider}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
