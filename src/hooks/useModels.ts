import { useState, useEffect } from 'react';
import type { AIModel } from '@/types/openrouter';
import { callEdgeFunction } from '@/lib/edge-functions';

interface UseModelsOptions {
  provider?: string;
  tags?: string[];
  recommended?: boolean;
  available?: boolean;
}

interface UseModelsReturn {
  models: AIModel[];
  recommended: AIModel[];
  groupedByProvider: Record<string, AIModel[]>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getModelById: (modelId: string) => AIModel | undefined;
  getModelsByProvider: (provider: string) => AIModel[];
  getModelsByTag: (tag: string) => AIModel[];
}

export function useModels(options: UseModelsOptions = {}): UseModelsReturn {
  const [models, setModels] = useState<AIModel[]>([]);
  const [recommended, setRecommended] = useState<AIModel[]>([]);
  const [groupedByProvider, setGroupedByProvider] = useState<Record<string, AIModel[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.provider) params.append('provider', options.provider);
      if (options.tags) params.append('tags', options.tags.join(','));
      if (options.recommended !== undefined) params.append('recommended', String(options.recommended));
      if (options.available !== undefined) params.append('available', String(options.available));
      const qs = params.toString();

      const data = await callEdgeFunction<{
        models: AIModel[];
        recommended: AIModel[];
        grouped_by_provider: Record<string, AIModel[]>;
      }>('get-available-models', {
        method: 'GET',
        path: qs ? `?${qs}` : '',
      });

      setModels(data.models || []);
      setRecommended(data.recommended || []);
      setGroupedByProvider(data.grouped_by_provider || {});
    } catch (err) {
      console.error('Error fetching models:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [options.provider, options.tags?.join(','), options.recommended, options.available]);

  const getModelById = (modelId: string): AIModel | undefined => {
    return models.find(model => model.model_id === modelId);
  };

  const getModelsByProvider = (provider: string): AIModel[] => {
    return models.filter(model => model.provider === provider);
  };

  const getModelsByTag = (tag: string): AIModel[] => {
    return models.filter(model => model.tags.includes(tag));
  };

  return {
    models,
    recommended,
    groupedByProvider,
    loading,
    error,
    refetch: fetchModels,
    getModelById,
    getModelsByProvider,
    getModelsByTag,
  };
}
