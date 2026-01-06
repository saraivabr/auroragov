import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

interface TableContextValue {
  describedBy?: string
}

const TableContext = React.createContext<TableContextValue>({})

interface AccessibleTableProps extends React.HTMLAttributes<HTMLTableElement> {
  description?: string
}

const AccessibleTable = React.forwardRef<HTMLTableElement, AccessibleTableProps>(
  ({ className, description, children, ...props }, ref) => {
    const descriptionId = React.useId()

    return (
      <TableContext.Provider value={{ describedBy: description ? descriptionId : undefined }}>
        <div className="relative w-full overflow-auto">
          <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            aria-describedby={description ? descriptionId : undefined}
            {...props}
          >
            {children}
          </table>
          {description && (
            <div id={descriptionId} className="sr-only">
              {description}
            </div>
          )}
        </div>
      </TableContext.Provider>
    )
  }
)
AccessibleTable.displayName = "AccessibleTable"

const AccessibleTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
AccessibleTableHeader.displayName = "AccessibleTableHeader"

const AccessibleTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
AccessibleTableBody.displayName = "AccessibleTableBody"

const AccessibleTableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
AccessibleTableFooter.displayName = "AccessibleTableFooter"

const AccessibleTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
AccessibleTableRow.displayName = "AccessibleTableRow"

interface AccessibleTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  scope?: "col" | "row" | "colgroup" | "rowgroup"
  abbr?: string
}

const AccessibleTableHead = React.forwardRef<
  HTMLTableCellElement,
  AccessibleTableHeadProps
>(({ className, scope = "col", abbr, children, ...props }, ref) => (
  <th
    ref={ref}
    scope={scope}
    abbr={abbr}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  >
    {children}
  </th>
))
AccessibleTableHead.displayName = "AccessibleTableHead"

type SortDirection = "asc" | "desc" | null

interface SortableTableHeadProps extends Omit<AccessibleTableHeadProps, 'onClick'> {
  sortKey: string
  currentSort?: { key: string; direction: SortDirection }
  onSort?: (key: string) => void
  sortLabel?: string
}

const SortableTableHead = React.forwardRef<
  HTMLTableCellElement,
  SortableTableHeadProps
>(({
  className,
  sortKey,
  currentSort,
  onSort,
  sortLabel,
  children,
  ...props
}, ref) => {
  const isSorted = currentSort?.key === sortKey
  const sortDirection = isSorted ? currentSort.direction : null

  const handleClick = () => {
    if (onSort) {
      onSort(sortKey)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const ariaSort = sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none'
  const ariaLabel = sortLabel || `Sort by ${children}`

  return (
    <th
      ref={ref}
      scope="col"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground",
        onSort && "cursor-pointer select-none hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onSort ? 0 : undefined}
      role={onSort ? "button" : undefined}
      aria-sort={onSort ? ariaSort : undefined}
      aria-label={onSort ? ariaLabel : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {onSort && (
          <span className="inline-flex" aria-hidden="true">
            {sortDirection === 'asc' && <ArrowUp className="h-4 w-4" />}
            {sortDirection === 'desc' && <ArrowDown className="h-4 w-4" />}
            {!sortDirection && <ArrowUpDown className="h-4 w-4 opacity-50" />}
          </span>
        )}
      </div>
    </th>
  )
})
SortableTableHead.displayName = "SortableTableHead"

interface AccessibleTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  scope?: "row"
}

const AccessibleTableCell = React.forwardRef<
  HTMLTableCellElement,
  AccessibleTableCellProps
>(({ className, scope, ...props }, ref) => (
  <td
    ref={ref}
    scope={scope}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      scope === "row" && "font-medium",
      className
    )}
    {...props}
  />
))
AccessibleTableCell.displayName = "AccessibleTableCell"

const AccessibleTableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
AccessibleTableCaption.displayName = "AccessibleTableCaption"

export {
  AccessibleTable,
  AccessibleTableHeader,
  AccessibleTableBody,
  AccessibleTableFooter,
  AccessibleTableHead,
  AccessibleTableRow,
  AccessibleTableCell,
  AccessibleTableCaption,
  SortableTableHead,
  type SortDirection,
}
