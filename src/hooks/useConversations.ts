import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (title: string = 'Nova conversa') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('conversations')
        .insert([{ user_id: user.id, title }])
        .select()
        .single();

      if (error) throw error;

      setConversations(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conversa');
      return null;
    }
  };

  const updateConversation = async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setConversations(prev =>
        prev.map(conv => conv.id === id ? { ...conv, title } : conv)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar conversa');
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setConversations(prev => prev.filter(conv => conv.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar conversa');
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    createConversation,
    updateConversation,
    deleteConversation,
    refreshConversations: fetchConversations
  };
}
