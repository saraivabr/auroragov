import { supabase } from '@/lib/supabase'
import type { AppUser, AppUserInsert, AppUserUpdate } from '@/types/database'

export async function createUser(user: AppUserInsert): Promise<AppUser> {
  const { data, error } = await supabase
    .from('app_users')
    .insert(user)
    .select()
    .single()

  if (error) throw error
  return data as AppUser
}

export async function updateUser(id: string, updates: AppUserUpdate): Promise<AppUser> {
  const { data, error } = await supabase
    .from('app_users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as AppUser
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('app_users').delete().eq('id', id)

  if (error) throw error
}

export async function getUserById(id: string): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data as AppUser | null
}

export async function bulkUpdateUserStatus(
  ids: string[],
  status: 'active' | 'inactive'
): Promise<void> {
  const { error } = await supabase.from('app_users').update({ status }).in('id', ids)

  if (error) throw error
}
