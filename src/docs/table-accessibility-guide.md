# Accessible Data Tables - Implementation Guide

## Overview

This guide provides comprehensive information on implementing accessible data tables with proper semantic HTML, ARIA attributes, keyboard navigation, and screen reader support.

## Components

### AccessibleTable
Enhanced table component with proper accessibility features including description support and context for child components.

### AccessibleTableHead
Table header cell (`<th>`) with required scope attributes for proper semantic structure.

### SortableTableHead
Interactive table header with built-in sort functionality, keyboard navigation, and ARIA attributes.

### DataTable
Complete data table solution with sorting, keyboard navigation, and full accessibility support.

## Key Accessibility Features

### 1. Semantic HTML Structure

```tsx
<AccessibleTable>
  <AccessibleTableCaption>Table Title</AccessibleTableCaption>
  <AccessibleTableHeader>
    <AccessibleTableRow>
      <AccessibleTableHead scope="col">Header</AccessibleTableHead>
    </AccessibleTableRow>
  </AccessibleTableHeader>
  <AccessibleTableBody>
    <AccessibleTableRow>
      <AccessibleTableCell scope="row">Row Header</AccessibleTableCell>
      <AccessibleTableCell>Data</AccessibleTableCell>
    </AccessibleTableRow>
  </AccessibleTableBody>
</AccessibleTable>
```

### 2. Scope Attributes

**Column Headers** (default):
```tsx
<AccessibleTableHead scope="col">Product Name</AccessibleTableHead>
```

**Row Headers**:
```tsx
<AccessibleTableCell scope="row">Item 001</AccessibleTableCell>
```

### 3. ARIA Attributes

**Sort States**:
- `aria-sort="ascending"` - Column sorted in ascending order
- `aria-sort="descending"` - Column sorted in descending order
- `aria-sort="none"` - Column not sorted but sortable

**Sort Labels**:
```tsx
<SortableTableHead
  sortKey="name"
  sortLabel="Sort by product name"
>
  Product
</SortableTableHead>
```

**Table Description**:
```tsx
<AccessibleTable description="List of all products with prices and availability">
  {/* table content */}
</AccessibleTable>
```

### 4. Keyboard Navigation

**Sortable Headers**:
- `Tab` - Navigate to sortable column header
- `Enter` or `Space` - Activate sort
- `Shift + Tab` - Navigate backwards

**Clickable Rows**:
- `Tab` - Navigate to row
- `Enter` or `Space` - Activate row action
- Arrow keys work naturally for screen readers

### 5. Screen Reader Support

**Caption and Description**:
```tsx
<AccessibleTable description="Detailed description for screen readers">
  <AccessibleTableCaption>
    Visible caption for all users
  </AccessibleTableCaption>
</AccessibleTable>
```

**Abbreviations**:
```tsx
<AccessibleTableHead abbr="ID">
  Invoice Number
</AccessibleTableHead>
```

## Usage Examples

### Basic Accessible Table

```tsx
import {
  AccessibleTable,
  AccessibleTableHeader,
  AccessibleTableBody,
  AccessibleTableRow,
  AccessibleTableHead,
  AccessibleTableCell,
  AccessibleTableCaption,
} from "@/components/ui/accessible-table"

function InvoiceTable() {
  return (
    <AccessibleTable description="List of recent invoices with payment status">
      <AccessibleTableCaption>Recent Invoices</AccessibleTableCaption>
      <AccessibleTableHeader>
        <AccessibleTableRow>
          <AccessibleTableHead scope="col">Invoice</AccessibleTableHead>
          <AccessibleTableHead scope="col">Status</AccessibleTableHead>
          <AccessibleTableHead scope="col">Amount</AccessibleTableHead>
        </AccessibleTableRow>
      </AccessibleTableHeader>
      <AccessibleTableBody>
        <AccessibleTableRow>
          <AccessibleTableCell scope="row">INV001</AccessibleTableCell>
          <AccessibleTableCell>Paid</AccessibleTableCell>
          <AccessibleTableCell>$250.00</AccessibleTableCell>
        </AccessibleTableRow>
      </AccessibleTableBody>
    </AccessibleTable>
  )
}
```

### Sortable Table

```tsx
import { SortableTableHead } from "@/components/ui/accessible-table"
import { useTableSort } from "@/hooks/useTableSort"

function SortableInvoiceTable() {
  const invoices = [/* data */]
  const { sortedData, sortConfig, requestSort } = useTableSort(invoices)

  return (
    <AccessibleTable description="Sortable invoice list">
      <AccessibleTableCaption>Invoices</AccessibleTableCaption>
      <AccessibleTableHeader>
        <AccessibleTableRow>
          <SortableTableHead
            sortKey="id"
            currentSort={sortConfig}
            onSort={requestSort}
            sortLabel="Sort by invoice number"
          >
            Invoice
          </SortableTableHead>
          <SortableTableHead
            sortKey="amount"
            currentSort={sortConfig}
            onSort={requestSort}
            sortLabel="Sort by amount"
          >
            Amount
          </SortableTableHead>
        </AccessibleTableRow>
      </AccessibleTableHeader>
      <AccessibleTableBody>
        {sortedData.map(invoice => (
          <AccessibleTableRow key={invoice.id}>
            <AccessibleTableCell scope="row">{invoice.id}</AccessibleTableCell>
            <AccessibleTableCell>${invoice.amount}</AccessibleTableCell>
          </AccessibleTableRow>
        ))}
      </AccessibleTableBody>
    </AccessibleTable>
  )
}
```

### Complete DataTable Component

```tsx
import { DataTable, Column } from "@/components/ui/data-table"

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

function ProductTable() {
  const products: Product[] = [/* data */]

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Product Name",
      sortable: true,
      cellScope: "row",
      ariaLabel: "Sort by product name",
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      ariaLabel: "Sort by price",
      render: (value) => `$${(value as number).toFixed(2)}`,
    },
    {
      key: "stock",
      header: "Stock",
      sortable: true,
      ariaLabel: "Sort by stock level",
    },
  ]

  return (
    <DataTable
      data={products}
      columns={columns}
      caption="Product Inventory"
      description="Complete list of products with pricing and stock levels. Click rows to view details."
      rowKeyField="id"
      initialSort={{ key: "name", direction: "asc" }}
      onRowClick={(product) => {
        console.log("Selected:", product)
      }}
    />
  )
}
```

## Best Practices

### 1. Always Use Scope Attributes
```tsx
// Column headers
<AccessibleTableHead scope="col">Header</AccessibleTableHead>

// Row headers (first column typically)
<AccessibleTableCell scope="row">Row ID</AccessibleTableCell>
```

### 2. Provide Meaningful Labels
```tsx
<SortableTableHead
  sortKey="createdAt"
  sortLabel="Sort by creation date" // Clear, descriptive label
>
  Created
</SortableTableHead>
```

### 3. Use Abbreviations When Helpful
```tsx
<AccessibleTableHead abbr="Qty">
  Quantity
</AccessibleTableHead>
```

### 4. Include Both Caption and Description
```tsx
<AccessibleTable description="Detailed context for screen readers">
  <AccessibleTableCaption>
    Short, visible title
  </AccessibleTableCaption>
</AccessibleTable>
```

### 5. Make Row Headers Bold
The first column often serves as a row identifier and should have `scope="row"` and be visually distinct (automatically handled by `AccessibleTableCell` with scope).

### 6. Provide Visual Sort Indicators
Sort icons are automatically included with `SortableTableHead` and marked as `aria-hidden` since the sort state is announced through `aria-sort`.

## Testing Checklist

### Screen Reader Testing
- [ ] Table caption is announced
- [ ] Table description is announced
- [ ] Column headers are announced with "column header"
- [ ] Row headers are announced with "row header"
- [ ] Sort state is announced (ascending/descending/none)
- [ ] Cell navigation announces row and column headers
- [ ] Empty table state is announced clearly

### Keyboard Testing
- [ ] Tab key navigates to sortable headers
- [ ] Enter/Space activates sort on focused header
- [ ] Tab navigates to clickable rows
- [ ] Enter/Space activates row action
- [ ] Focus indicators are clearly visible
- [ ] Tab order is logical

### Visual Testing
- [ ] Sort icons are visible and change appropriately
- [ ] Focus indicators meet WCAG contrast requirements
- [ ] Hover states provide clear feedback
- [ ] Table is responsive and scrollable if needed

## WCAG Compliance

These components meet WCAG 2.1 Level AA requirements:

- **1.3.1 Info and Relationships** - Proper semantic structure
- **2.1.1 Keyboard** - Full keyboard operability
- **2.4.7 Focus Visible** - Clear focus indicators
- **4.1.2 Name, Role, Value** - Proper ARIA attributes
- **4.1.3 Status Messages** - Sort state announcements

## Additional Resources

- [MDN: Table Accessibility](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced#Tables_for_visually_impaired_users)
- [W3C: Table Tutorial](https://www.w3.org/WAI/tutorials/tables/)
- [ARIA Authoring Practices: Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
