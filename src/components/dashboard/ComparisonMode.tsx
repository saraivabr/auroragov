import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIModel, AI_MODELS } from '@/types/ai-models';

interface ComparisonModeProps {
  onClose: () => void;
}

export function ComparisonMode({ onClose }: ComparisonModeProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<AIModel, string>>({} as Record<AIModel, string>);

  const handleCompare = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResults({} as Record<AIModel, string>);

    // Simulate API calls to different models
    const models: AIModel[] = ['chatgpt', 'claude', 'gemini', 'deepseek'];
    
    for (const model of models) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResults(prev => ({
        ...prev,
        [model]: `Resposta simulada do ${AI_MODELS[model].name}:\n\nEsta é uma demonstração de como diferentes modelos de IA podem fornecer perspectivas variadas sobre a mesma solicitação. Em produção, cada modelo processaria o prompt de forma independente, permitindo comparação direta de abordagens, estilos e profundidade de análise.\n\nEspecialidade: ${AI_MODELS[model].specialty}`
      }));
    }

    setIsLoading(false);
  };

  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-7xl h-[90vh] glass-effect rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <div>
            <h2 className="text-xl font-bold text-white">Comparação de Modelos</h2>
            <p className="text-sm text-gray-400">Execute o mesmo prompt em múltiplos modelos de IA</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Prompt Input */}
        <div className="p-6 border-b border-cyan-500/20">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Digite o prompt que deseja comparar entre os modelos..."
            className="min-h-[100px] resize-none bg-gray-900/50 border-gray-700 focus:border-cyan-500 text-white"
            disabled={isLoading}
          />
          <div className="flex justify-end mt-3">
            <Button
              onClick={handleCompare}
              disabled={!prompt.trim() || isLoading}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Comparando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Comparar Todos
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-hidden">
          {!hasResults && !isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p>Digite um prompt e clique em "Comparar Todos" para ver as respostas</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="chatgpt" className="h-full flex flex-col">
              <TabsList className="mx-6 mt-6 bg-gray-900/50 border border-gray-700">
                {(Object.keys(AI_MODELS) as AIModel[]).map((modelId) => (
                  <TabsTrigger
                    key={modelId}
                    value={modelId}
                    className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                  >
                    {AI_MODELS[modelId].name}
                    {results[modelId] && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        ✓
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex-1 overflow-hidden px-6 pb-6">
                {(Object.keys(AI_MODELS) as AIModel[]).map((modelId) => (
                  <TabsContent key={modelId} value={modelId} className="h-full mt-6">
                    <div className="h-full rounded-lg border border-gray-700 bg-gray-900/50 overflow-hidden">
                      <div className="p-4 border-b border-gray-700 bg-gray-900/80">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white">{AI_MODELS[modelId].name}</h3>
                            <p className="text-xs text-gray-400">{AI_MODELS[modelId].specialty}</p>
                          </div>
                          {isLoading && !results[modelId] && (
                            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                          )}
                        </div>
                      </div>
                      <ScrollArea className="h-[calc(100%-80px)]">
                        <div className="p-6">
                          {results[modelId] ? (
                            <div className="text-sm text-gray-300 whitespace-pre-wrap">
                              {results[modelId]}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 italic">
                              Aguardando resposta...
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
