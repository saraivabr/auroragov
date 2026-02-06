import { useState, useRef, useEffect, memo } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIModel, AI_MODELS, Message } from '@/types/ai-models';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInterfaceProps {
  selectedModel: AIModel;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  promptValue: string;
  onPromptChange: (value: string) => void;
}

const MessageItem = memo(({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  const modelInfo = AI_MODELS[message.model];

  return (
    <div className={cn(
      'p-4 rounded-lg animate-in slide-in-from-bottom-2',
      isUser ? 'bg-govbr-blue/5 border border-govbr-blue-light/20' : 'bg-gray-800/30'
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">
            {isUser ? 'Você' : modelInfo?.name || 'Assistente'}
          </span>
          {!isUser && modelInfo && (
            <Badge variant="outline" className="text-xs border-govbr-yellow/50 text-govbr-yellow">
              {modelInfo.specialty}
            </Badge>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      {isUser ? (
        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      ) : (
        <div className="text-sm text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-strong:text-white
          prose-code:text-govbr-yellow prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
          prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg
          prose-li:text-gray-300
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-table:border-collapse
          prose-th:border prose-th:border-gray-700 prose-th:bg-gray-800 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-white
          prose-td:border prose-td:border-gray-700 prose-td:px-3 prose-td:py-2
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

export const ChatInterface = memo(function ChatInterface({
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

  const modelInfo = AI_MODELS[selectedModel];

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="p-4 rounded-lg bg-gray-800/30 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-2">
                {modelInfo && (
                  <Badge variant="outline" className="text-xs border-govbr-yellow/50 text-govbr-yellow">
                    {modelInfo.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processando...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-govbr-blue-light/20 bg-[#0A1628]/80 backdrop-blur-md p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={promptValue}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua solicitação..."
              className="min-h-[100px] resize-none bg-gray-900/50 border-gray-700 focus:border-govbr-yellow text-white placeholder:text-gray-500"
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
              className="bg-govbr-blue hover:bg-govbr-blue-vivid text-white gap-2"
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
});
