import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { AppUser } from '@/types/database'

export interface UseUsersOptions {
  role?: 'admin' | 'developer' | 'designer' | 'manager'
  status?: 'active' | 'inactive'
  sortBy?: keyof AppUser
  sortDirection?: 'asc' | 'desc'
}

export function useUsers(options: UseUsersOptions = {}) {
  const [data, setData] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [options.role, options.status, options.sortBy, options.sortDirection])

  async function fetchUsers() {
    try {
      setLoading(true)
      setError(null)

      let query = supabase.from('app_users').select('*')

      if (options.role) {
        query = query.eq('role', options.role)
      }

      if (options.status) {
        query = query.eq('status', options.status)
      }

      if (options.sortBy) {
        query = query.order(options.sortBy, {
          ascending: options.sortDirection === 'asc',
        })
      }

      const { data: users, error: fetchError } = await query

      if (fetchError) throw fetchError

      setData((users || []) as AppUser[])
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
    refetch: fetchUsers,
  }
}
