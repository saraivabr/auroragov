import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIModel, AI_MODELS, Message } from '@/types/ai-models';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  selectedModel: AIModel;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  promptValue: string;
  onPromptChange: (value: string) => void;
}

export function ChatInterface({
  selectedModel,
  messages,
  onSendMessage,
  isLoading,
  promptValue,
  onPromptChange
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptValue.trim() && !isLoading) {
      onSendMessage(promptValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white rounded-full relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Bem-vindo ao Aurora Gov
                </h3>
                <p className="text-gray-400 text-sm">
                  Selecione um template ou digite sua solicitação para começar.
                  Todos os comandos são registrados e auditáveis.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  'animate-slide-up',
                  message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-4',
                    message.role === 'user'
                      ? 'bg-cyan-500/10 border border-cyan-500/30'
                      : 'glass-effect'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-400">
                        {AI_MODELS[message.model].name}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-gray-200 whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-slide-up">
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-400">
                      {AI_MODELS[selectedModel].name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Processando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-cyan-500/20 bg-[#0A1628]/80 backdrop-blur-md p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={promptValue}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua solicitação ou selecione um template..."
              className="min-h-[100px] resize-none bg-gray-900/50 border-gray-700 focus:border-cyan-500 text-white placeholder:text-gray-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">Enter</kbd> para enviar •{' '}
              <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">Shift + Enter</kbd> para nova linha
            </div>

            <Button
              type="submit"
              disabled={!promptValue.trim() || isLoading}
              className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
