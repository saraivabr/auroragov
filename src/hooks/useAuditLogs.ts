import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { AuditLog } from '@/types/database'

export interface UseAuditLogsOptions {
  entityType?: string
  limit?: number
}

export function useAuditLogs(options: UseAuditLogsOptions = {}) {
  const [data, setData] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchAuditLogs()
  }, [options.entityType, options.limit])

  async function fetchAuditLogs() {
    try {
      setLoading(true)
      setError(null)

      let query = supabase.from('audit_logs').select('*').order('timestamp', { ascending: false })

      if (options.entityType) {
        query = query.eq('entity_type', options.entityType)
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data: logs, error: fetchError } = await query

      if (fetchError) throw fetchError

      setData((logs || []) as AuditLog[])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchAuditLogs,
  }
}
