import { useState, useEffect } from 'react';
import {
  fetchEditalById,
  fetchAnalisesByEditalId,
  fetchComentariosByEditalId,
  createAnaliseEdital,
  createComentarioEdital,
  deleteAnaliseEdital,
  deleteComentarioEdital
} from '@/lib/api/editais';
import type { Edital, AnaliseEdital, AnaliseEditalInsert, ComentarioEdital, ComentarioEditalInsert } from '@/types/database';

export function useEditalDetails(editalId: string) {
  const [edital, setEdital] = useState<Edital | null>(null);
  const [analises, setAnalises] = useState<AnaliseEdital[]>([]);
  const [comentarios, setComentarios] = useState<ComentarioEdital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [editalData, analisesData, comentariosData] = await Promise.all([
        fetchEditalById(editalId),
        fetchAnalisesByEditalId(editalId),
        fetchComentariosByEditalId(editalId)
      ]);

      setEdital(editalData);
      setAnalises(analisesData);
      setComentarios(comentariosData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [editalId]);

  const addAnalise = async (analise: Omit<AnaliseEditalInsert, 'edital_id'>) => {
    try {
      const newAnalise = await createAnaliseEdital({
        ...analise,
        edital_id: editalId
      });
      setAnalises(prev => [newAnalise, ...prev]);
      return newAnalise;
    } catch (err) {
      throw err;
    }
  };

  const removeAnalise = async (id: string) => {
    try {
      await deleteAnaliseEdital(id);
      setAnalises(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const addComentario = async (comentario: Omit<ComentarioEditalInsert, 'edital_id'>) => {
    try {
      const newComentario = await createComentarioEdital({
        ...comentario,
        edital_id: editalId
      });
      setComentarios(prev => [newComentario, ...prev]);
      return newComentario;
    } catch (err) {
      throw err;
    }
  };

  const removeComentario = async (id: string) => {
    try {
      await deleteComentarioEdital(id);
      setComentarios(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    edital,
    analises,
    comentarios,
    loading,
    error,
    refresh: loadData,
    addAnalise,
    removeAnalise,
    addComentario,
    removeComentario
  };
}
