import { useState, useEffect } from 'react';
import { fetchEditais, createEdital, updateEdital, deleteEdital } from '@/lib/api/editais';
import type { Edital, EditalInsert, EditalUpdate } from '@/types/database';

export function useEditais() {
  const [editais, setEditais] = useState<Edital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEditais = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEditais();
      setEditais(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEditais();
  }, []);

  const addEdital = async (edital: EditalInsert) => {
    try {
      const newEdital = await createEdital(edital);
      setEditais(prev => [newEdital, ...prev]);
      return newEdital;
    } catch (err) {
      throw err;
    }
  };

  const modifyEdital = async (id: string, updates: EditalUpdate) => {
    try {
      const updated = await updateEdital(id, updates);
      setEditais(prev => prev.map(e => e.id === id ? updated : e));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const removeEdital = async (id: string) => {
    try {
      await deleteEdital(id);
      setEditais(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    editais,
    loading,
    error,
    refresh: loadEditais,
    addEdital,
    modifyEdital,
    removeEdital
  };
}
