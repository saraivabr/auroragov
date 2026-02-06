import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { AIModel, Message } from '@/types/ai-models';
import { useToast } from '@/components/ui/use-toast';

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function useChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('chatgpt');

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      toast({
        title: 'Erro ao carregar conversas',
        description: 'Não foi possível carregar suas conversas.',
        variant: 'destructive',
      });
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = (data || []).map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        model: msg.model_used || selectedModel,
        timestamp: new Date(msg.created_at),
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast({
        title: 'Erro ao carregar mensagens',
        description: 'Não foi possível carregar as mensagens.',
        variant: 'destructive',
      });
    }
  };

  const createConversation = async (title: string = 'Nova conversa'): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user?.id,
          title,
        })
        .select()
        .single();

      if (error) throw error;

      setConversations(prev => [data, ...prev]);
      setCurrentConversationId(data.id);
      return data.id;
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      toast({
        title: 'Erro ao criar conversa',
        description: 'Não foi possível criar uma nova conversa.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    if (!user?.id) {
      toast({
        title: 'Erro de autenticação',
        description: 'Você precisa estar logado para enviar mensagens.',
        variant: 'destructive',
      });
      return;
    }

    let conversationId = currentConversationId;

    if (!conversationId) {
      const newConvId = await createConversation(content.substring(0, 50));
      if (!newConvId) return;
      conversationId = newConvId;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      model: selectedModel,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-agent`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationId: conversationId,
          userId: user.id,
          modelId: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na resposta da API:', errorData);
        throw new Error(errorData.error || 'Erro ao processar mensagem');
      }

      const result = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.response || result.message || 'Desculpe, não consegui processar sua mensagem.',
        model: result.model_used || selectedModel,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);

      const errorMessage = error instanceof Error ? error.message : 'Não foi possível enviar sua mensagem. Tente novamente.';

      toast({
        title: 'Erro ao enviar mensagem',
        description: errorMessage,
        variant: 'destructive',
      });

      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }

      toast({
        title: 'Conversa excluída',
        description: 'A conversa foi excluída com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir conversa:', error);
      toast({
        title: 'Erro ao excluir conversa',
        description: 'Não foi possível excluir a conversa.',
        variant: 'destructive',
      });
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
  };

  return {
    conversations,
    currentConversationId,
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    loadConversations,
    createConversation,
    sendMessage,
    deleteConversation,
    setCurrentConversationId,
    startNewConversation,
  };
}
