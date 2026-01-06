import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from './useConversations';

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (content: string, role: 'user' | 'assistant', model?: string) => {
    if (!conversationId) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          role,
          content,
          model: role === 'assistant' ? model : undefined
        }])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data as Message]);
      return data as Message;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar mensagem');
      return null;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar mensagem');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    addMessage,
    deleteMessage,
    refreshMessages: fetchMessages
  };
}
