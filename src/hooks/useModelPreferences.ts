import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserModelPreference } from '@/types/openrouter';

interface UseModelPreferencesReturn {
  preferences: Map<string, string>;
  loading: boolean;
  error: string | null;
  getPreferredModel: (agentId: string | null) => string | null;
  setPreferredModel: (agentId: string | null, modelId: string) => Promise<void>;
  clearPreference: (agentId: string | null) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useModelPreferences(userId: string | undefined): UseModelPreferencesReturn {
  const [preferences, setPreferences] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_model_preferences')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;

      const prefsMap = new Map<string, string>();
      data?.forEach((pref: UserModelPreference) => {
        const key = pref.agent_id || 'default';
        prefsMap.set(key, pref.preferred_model_id);
      });

      setPreferences(prefsMap);
    } catch (err) {
      console.error('Error fetching preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  const getPreferredModel = (agentId: string | null): string | null => {
    const key = agentId || 'default';
    return preferences.get(key) || null;
  };

  const setPreferredModel = async (agentId: string | null, modelId: string): Promise<void> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const { error: upsertError } = await supabase
        .from('user_model_preferences')
        .upsert({
          user_id: userId,
          agent_id: agentId,
          preferred_model_id: modelId,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,agent_id',
        });

      if (upsertError) throw upsertError;

      const key = agentId || 'default';
      setPreferences(prev => new Map(prev).set(key, modelId));
    } catch (err) {
      console.error('Error setting preference:', err);
      throw err;
    }
  };

  const clearPreference = async (agentId: string | null): Promise<void> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const { error: deleteError } = await supabase
        .from('user_model_preferences')
        .delete()
        .eq('user_id', userId)
        .eq('agent_id', agentId);

      if (deleteError) throw deleteError;

      const key = agentId || 'default';
      setPreferences(prev => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
    } catch (err) {
      console.error('Error clearing preference:', err);
      throw err;
    }
  };

  return {
    preferences,
    loading,
    error,
    getPreferredModel,
    setPreferredModel,
    clearPreference,
    refetch: fetchPreferences,
  };
}
