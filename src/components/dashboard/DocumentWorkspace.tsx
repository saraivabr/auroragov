import { useState } from 'react';
import { X, Save, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types/ai-models';
import { useToast } from '@/components/ui/use-toast';

interface DocumentWorkspaceProps {
  messages: Message[];
  onClose: () => void;
}

export function DocumentWorkspace({ messages, onClose }: DocumentWorkspaceProps) {
  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
  const [content, setContent] = useState(lastAssistantMessage?.content || '');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copiado!',
      description: 'Conteúdo copiado para a área de transferência',
    });
  };

  const handleSave = () => {
    toast({
      title: 'Salvo!',
      description: 'Documento salvo com sucesso',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-7xl h-[90vh] glass-effect rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <div>
            <h2 className="text-xl font-bold text-white">Área de Trabalho</h2>
            <p className="text-sm text-gray-400">Edite e refine o conteúdo gerado pela IA</p>
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

        {/* Content */}
        <div className="flex-1 grid grid-cols-2 gap-6 p-6 overflow-hidden">
          {/* AI Output (Read-only) */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Saída da IA
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-gray-700 hover:border-cyan-500/50"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <ScrollArea className="flex-1 rounded-lg border border-gray-700 bg-gray-900/50 p-4">
              <div className="text-sm text-gray-300 whitespace-pre-wrap">
                {lastAssistantMessage?.content || 'Nenhum conteúdo disponível'}
              </div>
            </ScrollArea>
          </div>

          {/* Editor */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Editor
              </h3>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Save className="w-3 h-3 mr-2" />
                Salvar
              </Button>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 resize-none rounded-lg border-gray-700 bg-gray-900/50 text-white font-mono text-sm"
              placeholder="Edite o conteúdo aqui..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
