import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

type TableName = 'invoices' | 'app_users' | 'products' | 'audit_logs'

export function useRealtimeSubscription(
  table: TableName,
  onUpdate: () => void
) {
  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        () => {
          onUpdate()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, onUpdate])
}
