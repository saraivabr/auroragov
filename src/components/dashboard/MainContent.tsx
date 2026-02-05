import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatInterface } from './ChatInterface';
import { MessageSquare, Languages, FileText, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { AI_MODELS } from '@/types/ai-models';

interface SuggestionCard {
  id: string;
  icon: React.ReactNode;
  text: string;
  prompt: string;
}

export function MainContent() {
  const {
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
  } = useChat();

  const [promptValue, setPromptValue] = useState('');

  const suggestions: SuggestionCard[] = [
    {
      id: '1',
      icon: <MessageSquare className="w-5 h-5" />,
      text: 'Resuma esse texto',
      prompt: 'Atue como um especialista em resumos. Por favor, resuma o seguinte texto de forma clara e concisa, mantendo os pontos principais:',
    },
    {
      id: '2',
      icon: <Languages className="w-5 h-5" />,
      text: 'Traduza para o Português',
      prompt: 'Atue como um tradutor profissional. Por favor, traduza o seguinte texto para o Português brasileiro, mantendo o contexto e o tom original:',
    },
    {
      id: '3',
      icon: <FileText className="w-5 h-5" />,
      text: 'Analise um documento',
      prompt: 'Atue como um analista de documentos. Por favor, analise o seguinte documento em detalhes, identificando pontos principais, possíveis problemas e recomendações:',
    },
    {
      id: '4',
      icon: <Newspaper className="w-5 h-5" />,
      text: 'Quais as novidades do dia?',
      prompt: 'Atue como um analista de notícias. Quais são as principais notícias e acontecimentos relevantes do dia de hoje?',
    },
  ];

  const handleSuggestionClick = (prompt: string) => {
    setPromptValue(prompt);
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content);
    setPromptValue('');
  };

  const currentModel = AI_MODELS[selectedModel];

  return (
    <div className="flex-1 flex flex-col bg-govbr-blue-dark">
      <div className="border-b border-govbr-blue-light/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-[#0A1628]/60 border-govbr-blue-light/20 hover:bg-[#0A1628]/80 text-white"
          >
            <span className="font-medium">{currentModel.name}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <span className="text-gray-400 text-sm">{currentModel.specialty}</span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
          <h2 className="text-white text-3xl font-bold mb-12 text-center">
            O que você precisa fazer agora?
          </h2>

          <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mb-8">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.prompt)}
                className="flex items-center gap-3 px-6 py-4 bg-[#0A1628]/60 hover:bg-[#0A1628]/80 border border-govbr-blue-light/20 rounded-lg transition-all group"
              >
                <div className="text-gray-400 group-hover:text-govbr-yellow transition-colors">
                  {suggestion.icon}
                </div>
                <span className="text-gray-300 text-sm font-medium">
                  {suggestion.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            selectedModel={selectedModel}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            promptValue={promptValue}
            onPromptChange={setPromptValue}
          />
        </div>
      )}
    </div>
  );
}
