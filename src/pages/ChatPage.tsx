import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Menu, Trash2, Edit2, Check, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

export function ChatPage() {
  const { user, signOut } = useAuth();
  const { conversations, createConversation, updateConversation, deleteConversation } = useConversations();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { messages, addMessage } = useMessages(currentConversationId);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewChat = async () => {
    const newConv = await createConversation('Nova conversa');
    if (newConv) {
      setCurrentConversationId(newConv.id);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let conversationId = currentConversationId;

    if (!conversationId) {
      const newConv = await createConversation('Nova conversa');
      if (!newConv) return;
      conversationId = newConv.id;
      setCurrentConversationId(conversationId);
    }

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    await addMessage(userMessage, 'user');

    setTimeout(async () => {
      const responses = [
        'Olá! Sou o assistente do Governo Federal. Como posso ajudá-lo hoje?',
        'Entendi sua solicitação. Estou processando as informações...',
        'Agradeço por utilizar nossos serviços. Em que mais posso auxiliar?',
        'Essa é uma ótima pergunta. Deixe-me fornecer algumas informações...',
        'Posso ajudá-lo com diversas questões relacionadas aos serviços públicos.',
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      await addMessage(response, 'assistant', 'gpt-4');

      if (messages.length === 0) {
        const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
        await updateConversation(conversationId!, title);
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleEditTitle = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveTitle = async (id: string) => {
    if (editingTitle.trim()) {
      await updateConversation(id, editingTitle);
    }
    setEditingId(null);
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id);
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
    toast({
      title: 'Conversa excluída',
      description: 'A conversa foi removida com sucesso.',
    });
  };

  const ConversationsList = () => (
    <div className="flex flex-col h-full bg-[#071426]">
      <div className="p-4 border-b border-cyan-500/20">
        <Button
          onClick={handleNewChat}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Conversa
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                'group relative p-3 rounded-lg cursor-pointer transition-colors',
                currentConversationId === conv.id
                  ? 'bg-cyan-500/10 border border-cyan-500/30'
                  : 'hover:bg-gray-800/50'
              )}
              onClick={() => setCurrentConversationId(conv.id)}
            >
              {editingId === conv.id ? (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 bg-gray-800 border border-cyan-500/30 rounded px-2 py-1 text-sm text-white"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle(conv.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSaveTitle(conv.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                    <p className="text-sm text-gray-300 flex-1 line-clamp-2">
                      {conv.title}
                    </p>
                  </div>
                  <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTitle(conv.id, conv.title);
                      }}
                      className="h-7 w-7 p-0 hover:bg-cyan-500/20"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => e.stopPropagation()}
                          className="h-7 w-7 p-0 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir conversa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. A conversa e todas as mensagens serão removidas permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteConversation(conv.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-cyan-500/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-medium">
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          onClick={() => signOut()}
          variant="outline"
          className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
        >
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0A1628]">
      <aside className="hidden md:block w-64 border-r border-cyan-500/20">
        <ConversationsList />
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="border-b border-cyan-500/20 bg-[#071426]/80 backdrop-blur-md px-4 py-4 flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-[#071426] border-cyan-500/20">
              <ConversationsList />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white rounded-full relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Assistente Gov.br</h1>
              <p className="text-xs text-gray-400">Governo Federal do Brasil</p>
            </div>
          </div>
        </header>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-6 max-w-2xl px-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <div className="w-12 h-12 border-3 border-white rounded-full relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Bem-vindo ao Assistente Gov.br
                  </h2>
                  <p className="text-gray-400">
                    Um assistente facilitado para ajudá-lo com informações e serviços do Governo Federal.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                  {[
                    'Como posso acessar meu CPF digital?',
                    'Quais documentos preciso para tirar passaporte?',
                    'Como consultar meu FGTS?',
                    'Informações sobre o INSS',
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(suggestion)}
                      className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-cyan-500/20 text-left text-sm text-gray-300 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-4',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <div className="w-5 h-5 border-2 border-white rounded-full relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800/50 text-gray-200 border border-cyan-500/20'
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-medium text-sm">
                      {user?.email?.[0].toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <div className="w-5 h-5 border-2 border-white rounded-full relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-800/50 border border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-cyan-500/20 bg-[#071426]/80 backdrop-blur-md p-4">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                className="min-h-[60px] max-h-[200px] resize-none bg-gray-900/50 border-gray-700 focus:border-cyan-500 text-white placeholder:text-gray-500 pr-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-2 h-10 w-10 p-0 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">Enter</kbd> para enviar •{' '}
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">Shift + Enter</kbd> para nova linha
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
