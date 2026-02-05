import { useState } from 'react';
import { MessageSquare, Languages, FileText, Newspaper, Paperclip, Lightbulb, Search, Wand2, Mic, ChevronUp, Settings2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ActionMenu } from './ActionMenu';
import { AdvancedModelSelector } from './AdvancedModelSelector';

interface SuggestionCard {
  id: string;
  icon: React.ReactNode;
  text: string;
}

export function MainContent() {
  const [inputValue, setInputValue] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState('one');

  const suggestions: SuggestionCard[] = [
    {
      id: '1',
      icon: <MessageSquare className="w-5 h-5" />,
      text: 'Resuma esse texto',
    },
    {
      id: '2',
      icon: <Languages className="w-5 h-5" />,
      text: 'Traduza o seguinte para o Português',
    },
    {
      id: '3',
      icon: <FileText className="w-5 h-5" />,
      text: 'Analise um documento',
    },
    {
      id: '4',
      icon: <Newspaper className="w-5 h-5" />,
      text: 'Quais as novidades do dia?',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#2a2a2a] relative">
      <ActionMenu isOpen={showActionMenu} onClose={() => setShowActionMenu(false)} />
      <AdvancedModelSelector
        isOpen={showModelSelector}
        onClose={() => setShowModelSelector(false)}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="px-4 py-2 bg-[#3a3a3a] hover:bg-[#454545] border border-gray-700 rounded-lg flex items-center gap-2 transition-colors"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-govbr-blue to-govbr-blue-vivid rounded flex items-center justify-center text-sm">
              ⚙️
            </div>
            <span className="text-white font-medium text-sm">ONE</span>
            <ChevronUp className="w-4 h-4 text-gray-400" />
          </button>

          <h1 className="text-white text-xl font-semibold">
            ADAPTAONE<sup className="text-xs text-gray-400">2.0</sup>
          </h1>
          <span className="text-gray-400 text-sm">
            Uma plataforma mais completa, autônoma e ainda MAIS inteligente
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-govbr-blue hover:bg-govbr-blue-vivid text-white">
            Saiba Mais
            <span className="ml-2">→</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-8 p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronUp
            className={`w-6 h-6 text-gray-600 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {!isCollapsed && (
          <>
            <h2 className="text-white text-3xl font-bold mb-12 text-center">
              O que você precisa fazer agora?
            </h2>

            <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="flex items-center gap-3 px-6 py-4 bg-[#3a3a3a] hover:bg-[#454545] border border-gray-700 rounded-lg transition-all group"
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
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-[340px] right-0 bg-[#2a2a2a] border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="bg-[#3a3a3a] border border-gray-700 rounded-2xl overflow-hidden">
              <div className="flex items-end gap-2 p-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 flex-shrink-0"
                  onClick={() => setShowActionMenu(!showActionMenu)}
                  title="Menu de ações"
                >
                  <List className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 flex-shrink-0"
                  onClick={() => setShowActionMenu(!showActionMenu)}
                  title="Anexar arquivo"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>

                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 resize-none min-h-[44px] max-h-[200px] focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={1}
                />

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-700 gap-1 text-xs"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Pensar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-700 gap-1 text-xs"
                  >
                    <Search className="w-4 h-4" />
                    Pesquisar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-700 gap-1 text-xs"
                  >
                    <Wand2 className="w-4 h-4" />
                    Gerar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-3">
              <button className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
                Termos
              </button>
              <span className="text-gray-700">•</span>
              <button className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
                Privacidade
              </button>
              <span className="text-gray-700">•</span>
              <span className="text-gray-500 text-xs">
                ADAPTAONE pode cometer erros
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
