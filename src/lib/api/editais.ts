import { supabase } from '../supabase';
import type { Edital, EditalInsert, EditalUpdate, AnaliseEdital, AnaliseEditalInsert, ComentarioEdital, ComentarioEditalInsert } from '@/types/database';

export async function fetchEditais() {
  const { data, error } = await supabase
    .from('editais' as any)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Edital[];
}

export async function fetchEditalById(id: string) {
  const { data, error } = await supabase
    .from('editais' as any)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Edital | null;
}

export async function createEdital(edital: EditalInsert) {
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('editais' as any)
    .insert({
      ...edital,
      user_id: userData.user?.id || ''
    })
    .select()
    .single();

  if (error) throw error;
  return data as Edital;
}

export async function updateEdital(id: string, updates: EditalUpdate) {
  const { data, error } = await supabase
    .from('editais' as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Edital;
}

export async function deleteEdital(id: string) {
  const { error } = await supabase
    .from('editais' as any)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function fetchAnalisesByEditalId(editalId: string) {
  const { data, error } = await supabase
    .from('analises_editais' as any)
    .select('*')
    .eq('edital_id', editalId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as AnaliseEdital[];
}

export async function createAnaliseEdital(analise: AnaliseEditalInsert) {
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('analises_editais' as any)
    .insert({
      ...analise,
      usuario_id: userData.user?.id || '',
      usuario_nome: userData.user?.email || 'Usuário'
    })
    .select()
    .single();

  if (error) throw error;
  return data as AnaliseEdital;
}

export async function deleteAnaliseEdital(id: string) {
  const { error } = await supabase
    .from('analises_editais' as any)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function fetchComentariosByEditalId(editalId: string) {
  const { data, error } = await supabase
    .from('comentarios_editais' as any)
    .select('*')
    .eq('edital_id', editalId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ComentarioEdital[];
}

export async function createComentarioEdital(comentario: ComentarioEditalInsert) {
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('comentarios_editais' as any)
    .insert({
      ...comentario,
      usuario_id: userData.user?.id || '',
      usuario_nome: userData.user?.email || 'Usuário'
    })
    .select()
    .single();

  if (error) throw error;
  return data as ComentarioEdital;
}

export async function deleteComentarioEdital(id: string) {
  const { error } = await supabase
    .from('comentarios_editais' as any)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function uploadEditalPDF(file: File, editalId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${editalId}.${fileExt}`;
  const filePath = `editais/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
