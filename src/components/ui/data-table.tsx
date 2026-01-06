import * as React from "react"
import {
  AccessibleTable,
  AccessibleTableBody,
  AccessibleTableCaption,
  AccessibleTableCell,
  AccessibleTableHead,
  AccessibleTableHeader,
  AccessibleTableRow,
  SortableTableHead,
} from "./accessible-table"
import { useTableSort } from "@/hooks/useTableSort"

export interface Column<T> {
  key: keyof T
  header: string
  sortable?: boolean
  abbr?: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
  headerScope?: "col" | "row"
  cellScope?: "row"
  ariaLabel?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  caption?: string
  description?: string
  rowKeyField: keyof T
  initialSort?: { key: keyof T; direction: 'asc' | 'desc' }
  allowUnsort?: boolean
  onRowClick?: (item: T) => void
  getRowProps?: (item: T) => React.HTMLAttributes<HTMLTableRowElement>
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  caption,
  description,
  rowKeyField,
  initialSort,
  allowUnsort = true,
  onRowClick,
  getRowProps,
}: DataTableProps<T>) {
  const { sortedData, sortConfig, requestSort } = useTableSort(data, {
    initialSort,
    allowUnsort,
  })

  const handleRowClick = (item: T) => {
    if (onRowClick) {
      onRowClick(item)
    }
  }

  const handleRowKeyDown = (e: React.KeyboardEvent, item: T) => {
    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onRowClick(item)
    }
  }

  return (
    <AccessibleTable description={description}>
      {caption && <AccessibleTableCaption>{caption}</AccessibleTableCaption>}
      <AccessibleTableHeader>
        <AccessibleTableRow>
          {columns.map((column) => {
            const key = String(column.key)

            if (column.sortable) {
              return (
                <SortableTableHead
                  key={key}
                  sortKey={key}
                  currentSort={sortConfig}
                  onSort={requestSort}
                  sortLabel={column.ariaLabel}
                  abbr={column.abbr}
                  scope={column.headerScope}
                >
                  {column.header}
                </SortableTableHead>
              )
            }

            return (
              <AccessibleTableHead
                key={key}
                scope={column.headerScope || "col"}
                abbr={column.abbr}
              >
                {column.header}
              </AccessibleTableHead>
            )
          })}
        </AccessibleTableRow>
      </AccessibleTableHeader>
      <AccessibleTableBody>
        {sortedData.length === 0 ? (
          <AccessibleTableRow>
            <AccessibleTableCell
              colSpan={columns.length}
              className="text-center text-muted-foreground py-8"
            >
              No data available
            </AccessibleTableCell>
          </AccessibleTableRow>
        ) : (
          sortedData.map((item) => {
            const rowProps = getRowProps?.(item) || {}
            const isClickable = !!onRowClick

            return (
              <AccessibleTableRow
                key={String(item[rowKeyField])}
                onClick={() => handleRowClick(item)}
                onKeyDown={(e) => handleRowKeyDown(e, item)}
                tabIndex={isClickable ? 0 : undefined}
                role={isClickable ? "button" : undefined}
                className={isClickable ? "cursor-pointer" : undefined}
                {...rowProps}
              >
                {columns.map((column, index) => {
                  const value = item[column.key]
                  const content = column.render ? column.render(value, item) : String(value ?? '')

                  return (
                    <AccessibleTableCell
                      key={String(column.key)}
                      scope={column.cellScope || (index === 0 ? "row" : undefined)}
                    >
                      {content}
                    </AccessibleTableCell>
                  )
                })}
              </AccessibleTableRow>
            )
          })
        )}
      </AccessibleTableBody>
    </AccessibleTable>
  )
}
