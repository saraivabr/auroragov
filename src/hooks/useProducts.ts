import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types/database'

export interface UseProductsOptions {
  category?: string
  isActive?: boolean
  lowStock?: boolean
  sortBy?: keyof Product
  sortDirection?: 'asc' | 'desc'
}

export function useProducts(options: UseProductsOptions = {}) {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [
    options.category,
    options.isActive,
    options.lowStock,
    options.sortBy,
    options.sortDirection,
  ])

  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)

      let query = supabase.from('products').select('*')

      if (options.category) {
        query = query.eq('category', options.category)
      }

      if (options.isActive !== undefined) {
        query = query.eq('is_active', options.isActive)
      }

      if (options.lowStock) {
        query = query.lte('stock', 10)
      }

      if (options.sortBy) {
        query = query.order(options.sortBy, {
          ascending: options.sortDirection === 'asc',
        })
      }

      const { data: products, error: fetchError } = await query

      if (fetchError) throw fetchError

      setData(products || [])
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
    refetch: fetchProducts,
  }
}
