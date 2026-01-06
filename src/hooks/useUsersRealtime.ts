import { useCallback } from 'react'
import { useUsers, UseUsersOptions } from './useUsers'
import { useRealtimeSubscription } from './useRealtimeSubscription'

export function useUsersRealtime(options: UseUsersOptions = {}) {
  const result = useUsers(options)

  const handleUpdate = useCallback(() => {
    result.refetch()
  }, [result])

  useRealtimeSubscription('app_users', handleUpdate)

  return result
}
