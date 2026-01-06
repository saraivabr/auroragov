import { useCallback } from 'react'
import { useInvoices, UseInvoicesOptions } from './useInvoices'
import { useRealtimeSubscription } from './useRealtimeSubscription'

export function useInvoicesRealtime(options: UseInvoicesOptions = {}) {
  const result = useInvoices(options)

  const handleUpdate = useCallback(() => {
    result.refetch()
  }, [result])

  useRealtimeSubscription('invoices', handleUpdate)

  return result
}
