import * as React from "react"
import { DataTable, Column } from "./data-table"
import { Button } from "./button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Skeleton } from "./skeleton"

interface SupabaseDataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  error?: Error | null
  caption?: string
  description?: string
  rowKeyField: keyof T
  initialSort?: { key: keyof T; direction: 'asc' | 'desc' }
  allowUnsort?: boolean
  onRowClick?: (item: T) => void
  onRefresh?: () => void
  emptyMessage?: string
  getRowProps?: (item: T) => React.HTMLAttributes<HTMLTableRowElement>
}

function LoadingSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-10 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SupabaseDataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  caption,
  description,
  rowKeyField,
  initialSort,
  allowUnsort = true,
  onRowClick,
  onRefresh,
  emptyMessage = "No data available",
  getRowProps,
}: SupabaseDataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-4">
        {caption && <h3 className="text-lg font-semibold">{caption}</h3>}
        <LoadingSkeleton rows={5} columns={columns.length} />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading data</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{error.message}</span>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  if (data.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No data</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{emptyMessage}</span>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <DataTable
        data={data}
        columns={columns}
        caption={caption}
        description={description}
        rowKeyField={rowKeyField}
        initialSort={initialSort}
        allowUnsort={allowUnsort}
        onRowClick={onRowClick}
        getRowProps={getRowProps}
      />
      {onRefresh && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      )}
    </div>
  )
}
