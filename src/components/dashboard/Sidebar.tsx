import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MessageSquare, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    startNewConversation,
    deleteConversation,
  } = useChat();

  const groupConversationsByDate = (conversations: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const grouped: Record<string, any[]> = {
      'Hoje': [],
      'Ontem': [],
      'Últimos 7 dias': [],
      'Últimos 30 dias': [],
      'Mais antigo': [],
    };

    conversations.forEach((conv) => {
      const convDate = new Date(conv.updated_at);

      if (convDate >= today) {
        grouped['Hoje'].push(conv);
      } else if (convDate >= yesterday) {
        grouped['Ontem'].push(conv);
      } else if (convDate >= lastWeek) {
        grouped['Últimos 7 dias'].push(conv);
      } else if (convDate >= lastMonth) {
        grouped['Últimos 30 dias'].push(conv);
      } else {
        grouped['Mais antigo'].push(conv);
      }
    });

    return Object.entries(grouped).filter(([_, convs]) => convs.length > 0);
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    return conversations.filter((conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const groupedConversations = useMemo(() => {
    return groupConversationsByDate(filteredConversations);
  }, [filteredConversations]);

  return (
    <div className="w-[280px] h-screen bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-govbr-blue to-govbr-blue-vivid rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-white font-semibold text-lg">
              Aurora<span className="text-gray-400">Gov</span>
            </span>
          </div>
        </div>

        <Button
          onClick={startNewConversation}
          className="w-full bg-govbr-blue hover:bg-govbr-blue-vivid text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Chat
        </Button>
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
          <Input
            type="text"
            placeholder="Pesquisar conversas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 bg-gray-800 border-gray-700 text-gray-300 text-xs h-8"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {groupedConversations.length === 0 ? (
            <div className="px-3 py-8 text-center text-gray-500 text-sm">
              Nenhuma conversa encontrada
            </div>
          ) : (
            groupedConversations.map(([date, convs]) => (
              <div key={date} className="pt-4">
                <div className="px-3 py-2">
                  <span className="text-gray-500 text-xs font-medium">{date}</span>
                </div>
                <div className="space-y-1">
                  {convs.map((conv) => (
                    <div
                      key={conv.id}
                      className={cn(
                        "group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                        currentConversationId === conv.id
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800"
                      )}
                    >
                      <button
                        onClick={() => setCurrentConversationId(conv.id)}
                        className="flex-1 flex items-center gap-2 min-w-0 text-left"
                      >
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{conv.title}</span>
                      </button>
                      <button
                        onClick={() => deleteConversation(conv.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                        title="Excluir conversa"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-gray-800 space-y-1">
        <div className="w-full flex items-center gap-3 px-3 py-2 text-gray-400">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-govbr-blue to-govbr-blue-warm flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.email?.[0].toUpperCase()}
            </span>
          </div>
          <span className="text-sm truncate">{user?.email}</span>
        </div>
        <button
          onClick={async () => { await signOut(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </div>
  );
}
