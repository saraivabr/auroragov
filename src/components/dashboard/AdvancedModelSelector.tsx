import { useState } from 'react';
import { Plus, ChevronDown, Search, Star, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Model {
  id: string;
  name: string;
  icon: string;
  badge?: 'most-used' | 'new';
  color: string;
}

interface AdvancedModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function AdvancedModelSelector({ isOpen, onClose, selectedModel, onModelChange }: AdvancedModelSelectorProps) {
  const [activeTab, setActiveTab] = useState('texto');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['recomendados']);

  const textModels: Model[] = [
    { id: 'one', name: 'ONE', icon: '⚙️', badge: 'most-used', color: 'from-purple-500 to-purple-600' },
    { id: 'gpt-5', name: 'GPT-5', icon: '🤖', badge: 'new', color: 'from-teal-500 to-teal-600' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', icon: '💎', color: 'from-blue-500 to-blue-600' },
    { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', icon: '🎭', color: 'from-orange-500 to-orange-600' },
    { id: 'deepseek-v3', name: 'DeepSeek V3', icon: '🔍', color: 'from-cyan-500 to-cyan-600' },
    { id: 'grok-4', name: 'Grok 4', icon: '⚡', color: 'from-gray-700 to-gray-800' },
  ];

  const reasoningModels: Model[] = [
    { id: 'o1', name: 'o1', icon: '🧠', color: 'from-pink-500 to-pink-600' },
    { id: 'o1-mini', name: 'o1 mini', icon: '🧠', color: 'from-pink-400 to-pink-500' },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="absolute top-4 left-4 z-50 w-[440px] bg-[#2a2a2a] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <Plus className="w-4 h-4 text-gray-400" />
            </Button>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#3a3a3a] rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded flex items-center justify-center text-sm">
                ⚙️
              </div>
              <span className="text-white font-medium">ONE Image</span>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab('texto')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'texto'
                  ? 'bg-[#3a3a3a] text-white border-b-2 border-cyan-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Texto
            </button>
            <button
              onClick={() => setActiveTab('imagens')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'imagens'
                  ? 'bg-[#3a3a3a] text-white border-b-2 border-cyan-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Imagens
            </button>
            <button
              onClick={() => setActiveTab('experts')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'experts'
                  ? 'bg-[#3a3a3a] text-white border-b-2 border-cyan-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Experts
            </button>
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <Search className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-4">
            <div>
              <button
                onClick={() => toggleSection('recomendados')}
                className="w-full flex items-center justify-between mb-3"
              >
                <h3 className="text-white font-medium text-sm">Recomendados</h3>
              </button>

              {expandedSections.includes('recomendados') && (
                <div className="space-y-2">
                  {textModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onModelChange(model.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedModel === model.id
                          ? 'bg-[#3a3a3a] border border-cyan-500'
                          : 'bg-[#333] hover:bg-[#3a3a3a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${model.color} rounded flex items-center justify-center text-lg`}>
                          {model.icon}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-white font-medium text-sm">{model.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {model.badge === 'most-used' && (
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                            Mais usado
                          </Badge>
                        )}
                        {model.badge === 'new' && (
                          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 text-xs flex items-center gap-1">
                            ✨ Novo
                          </Badge>
                        )}
                        {selectedModel === model.id && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                        <Button size="icon" variant="ghost" className="w-6 h-6">
                          <Info className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSection('raciocinio')}
                className="w-full flex items-center justify-between mb-3"
              >
                <h3 className="text-white font-medium text-sm">IAs de raciocínio</h3>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedSections.includes('raciocinio') ? 'rotate-180' : ''
                }`} />
              </button>

              {expandedSections.includes('raciocinio') && (
                <div className="space-y-2">
                  {reasoningModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onModelChange(model.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedModel === model.id
                          ? 'bg-[#3a3a3a] border border-cyan-500'
                          : 'bg-[#333] hover:bg-[#3a3a3a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${model.color} rounded flex items-center justify-center text-lg`}>
                          {model.icon}
                        </div>
                        <span className="text-white font-medium text-sm">{model.name}</span>
                      </div>
                      <Button size="icon" variant="ghost" className="w-6 h-6">
                        <Info className="w-4 h-4 text-gray-400" />
                      </Button>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSection('outras')}
                className="w-full flex items-center justify-between mb-3"
              >
                <h3 className="text-white font-medium text-sm">Outras IAs</h3>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedSections.includes('outras') ? 'rotate-180' : ''
                }`} />
              </button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
