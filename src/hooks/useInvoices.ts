import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Invoice } from '@/types/database'

export interface UseInvoicesOptions {
  status?: 'paid' | 'pending' | 'unpaid'
  sortBy?: keyof Invoice
  sortDirection?: 'asc' | 'desc'
}

export function useInvoices(options: UseInvoicesOptions = {}) {
  const [data, setData] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchInvoices()
  }, [options.status, options.sortBy, options.sortDirection])

  async function fetchInvoices() {
    try {
      setLoading(true)
      setError(null)

      let query = supabase.from('invoices').select('*')

      if (options.status) {
        query = query.eq('status', options.status)
      }

      if (options.sortBy) {
        query = query.order(options.sortBy, {
          ascending: options.sortDirection === 'asc',
        })
      }

      const { data: invoices, error: fetchError } = await query

      if (fetchError) throw fetchError

      setData((invoices || []) as Invoice[])
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
    refetch: fetchInvoices,
  }
}
