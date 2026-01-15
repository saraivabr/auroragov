import { useState } from 'react';
import { Plus, Home, Search, FolderClosed, Star, Sparkles, MessageSquare, Settings, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Folder {
  id: string;
  name: string;
  count: number;
}

interface Conversation {
  id: string;
  title: string;
  date: string;
}

export function Sidebar() {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['pastas']);
  const [searchQuery, setSearchQuery] = useState('');

  const folders: Folder[] = [
    { id: '1', name: 'Projeto Legado - Controle...', count: 8 },
    { id: '2', name: 'Legado Rep', count: 1 },
    { id: '3', name: 'Micro_Saas', count: 3 },
  ];

  const favorites: Conversation[] = [
    { id: '1', title: 'Dr. Liam - Eng. Computação', date: '' },
    { id: '2', title: 'Conselheiro Noah', date: '' },
  ];

  const conversationsByDate = {
    'Agosto de 2025': [
      { id: '1', title: 'Olá', date: 'Agosto de 2025' },
    ],
    'Julho de 2025': [
      { id: '2', title: 'Atue como um consultor sênior...', date: 'Julho de 2025' },
      { id: '3', title: 'Atue como um consultor sênior...', date: 'Julho de 2025' },
      { id: '4', title: 'Atue como um analista de merc...', date: 'Julho de 2025' },
    ],
    'Junho de 2025': [
      { id: '5', title: 'Atue como um especialista inte...', date: 'Junho de 2025' },
      { id: '6', title: 'Atue como um Especialista em ...', date: 'Junho de 2025' },
      { id: '7', title: 'Atue como um especialista em ...', date: 'Junho de 2025' },
      { id: '8', title: 'Atue como um Analista Sênior ...', date: 'Junho de 2025' },
      { id: '9', title: 'Atue como um consultor sênior...', date: 'Junho de 2025' },
      { id: '10', title: 'Atue como um consultor sênior', date: 'Junho de 2025' },
      { id: '11', title: 'Atue como um consultor sênior', date: 'Junho de 2025' },
    ],
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  return (
    <div className="w-[280px] h-screen bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-white font-semibold text-lg">
              ADAPTA<span className="text-gray-400">ONE</span>
            </span>
          </div>
        </div>

        <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700">
          <Plus className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm">Hub</span>
          </button>

          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
              <Input
                type="text"
                placeholder="Pesquisar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 bg-gray-800 border-gray-700 text-gray-300 text-xs h-8"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => toggleFolder('pastas')}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Pastas</span>
              </div>
              <div className="flex items-center gap-2">
                <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                {expandedFolders.includes('pastas') ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </button>

            {expandedFolders.includes('pastas') && (
              <div className="ml-2 mt-1 space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    className="w-full flex items-center justify-between px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FolderClosed className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{folder.name}</span>
                    </div>
                    <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full flex-shrink-0">
                      {folder.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <div className="px-3 py-2">
              <span className="text-gray-500 text-xs font-medium">Favoritos</span>
            </div>
            <div className="space-y-1">
              {favorites.map((fav) => (
                <button
                  key={fav.id}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{fav.title}</span>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {Object.entries(conversationsByDate).map(([date, conversations]) => (
            <div key={date} className="pt-4">
              <div className="px-3 py-2">
                <span className="text-gray-500 text-xs font-medium">{date}</span>
              </div>
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{conv.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-gray-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
