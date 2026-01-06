import { useState, useMemo, useCallback } from 'react'

type SortDirection = 'asc' | 'desc' | null

interface SortConfig {
  key: string
  direction: SortDirection
}

interface UseTableSortOptions<T> {
  initialSort?: { key: keyof T; direction: 'asc' | 'desc' }
  allowUnsort?: boolean
}

export function useTableSort<T>(data: T[], options: UseTableSortOptions<T> = {}) {
  const { initialSort, allowUnsort = true } = options

  const [sortConfig, setSortConfig] = useState<SortConfig>(() => ({
    key: initialSort?.key as string || '',
    direction: initialSort?.direction || null,
  }))

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data
    }

    const sorted = [...data].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key]
      const bValue = (b as any)[sortConfig.key]

      if (aValue === bValue) return 0

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const comparison = aValue < bValue ? -1 : 1

      return sortConfig.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [data, sortConfig])

  const requestSort = useCallback((key: string) => {
    setSortConfig((current) => {
      if (current.key !== key) {
        return { key, direction: 'asc' }
      }

      if (current.direction === 'asc') {
        return { key, direction: 'desc' }
      }

      if (current.direction === 'desc' && allowUnsort) {
        return { key: '', direction: null }
      }

      return { key, direction: 'asc' }
    })
  }, [allowUnsort])

  return {
    sortedData,
    sortConfig,
    requestSort,
  }
}
