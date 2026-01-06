import { useCallback } from 'react'
import { useProducts, UseProductsOptions } from './useProducts'
import { useRealtimeSubscription } from './useRealtimeSubscription'

export function useProductsRealtime(options: UseProductsOptions = {}) {
  const result = useProducts(options)

  const handleUpdate = useCallback(() => {
    result.refetch()
  }, [result])

  useRealtimeSubscription('products', handleUpdate)

  return result
}
