import { supabase } from '@/lib/supabase'
import type { AuditLog, AuditLogInsert } from '@/types/database'

export async function createAuditLog(log: AuditLogInsert): Promise<AuditLog> {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert(log)
    .select()
    .single()

  if (error) throw error
  return data as AuditLog
}

export async function logAction(
  action: string,
  entityType: string,
  entityId: string | null,
  details: string,
  userName: string = 'System',
  userId: string | null = null,
  metadata?: Record<string, any>
): Promise<void> {
  await createAuditLog({
    user_id: userId,
    user_name: userName,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
    metadata: metadata || null,
  })
}
