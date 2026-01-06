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
} from "../components/ui/accessible-table"
import { DataTable, Column } from "../components/ui/data-table"
import { Badge } from "../components/ui/badge"

const meta = {
  title: "ui/AccessibleTable",
  component: AccessibleTable,
  tags: ["autodocs"],
}
export default meta

const invoiceData = [
  { id: "INV001", status: "Paid", method: "Credit Card", amount: 250.00, date: "2024-01-15" },
  { id: "INV002", status: "Pending", method: "PayPal", amount: 150.00, date: "2024-01-14" },
  { id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: 450.00, date: "2024-01-13" },
  { id: "INV004", status: "Paid", method: "Stripe", amount: 250.00, date: "2024-01-12" },
  { id: "INV005", status: "Paid", method: "Credit Card", amount: 50.00, date: "2024-01-11" },
]

type Invoice = typeof invoiceData[0]

export const BasicAccessible = {
  render: () => {
    return (
      <AccessibleTable description="A comprehensive list of your recent invoices with payment details">
        <AccessibleTableCaption>Recent Invoices</AccessibleTableCaption>
        <AccessibleTableHeader>
          <AccessibleTableRow>
            <AccessibleTableHead scope="col" abbr="ID">
              Invoice ID
            </AccessibleTableHead>
            <AccessibleTableHead scope="col">Status</AccessibleTableHead>
            <AccessibleTableHead scope="col">Payment Method</AccessibleTableHead>
            <AccessibleTableHead scope="col">Amount</AccessibleTableHead>
          </AccessibleTableRow>
        </AccessibleTableHeader>
        <AccessibleTableBody>
          {invoiceData.map((invoice) => (
            <AccessibleTableRow key={invoice.id}>
              <AccessibleTableCell scope="row" className="font-medium">
                {invoice.id}
              </AccessibleTableCell>
              <AccessibleTableCell>{invoice.status}</AccessibleTableCell>
              <AccessibleTableCell>{invoice.method}</AccessibleTableCell>
              <AccessibleTableCell>${invoice.amount.toFixed(2)}</AccessibleTableCell>
            </AccessibleTableRow>
          ))}
        </AccessibleTableBody>
      </AccessibleTable>
    )
  },
}

export const SortableTable = {
  render: () => {
    const [sortConfig, setSortConfig] = React.useState<{
      key: string
      direction: "asc" | "desc" | null
    }>({ key: "", direction: null })

    const [data, setData] = React.useState(invoiceData)

    const requestSort = (key: string) => {
      let direction: "asc" | "desc" | null = "asc"

      if (sortConfig.key === key) {
        if (sortConfig.direction === "asc") {
          direction = "desc"
        } else if (sortConfig.direction === "desc") {
          direction = null
        }
      }

      setSortConfig({ key, direction })

      if (!direction) {
        setData(invoiceData)
        return
      }

      const sorted = [...data].sort((a, b) => {
        const aValue = (a as any)[key]
        const bValue = (b as any)[key]

        if (aValue === bValue) return 0
        if (aValue < bValue) return direction === "asc" ? -1 : 1
        return direction === "asc" ? 1 : -1
      })

      setData(sorted)
    }

    return (
      <AccessibleTable description="Sortable table of invoices. Click column headers or press Enter to sort">
        <AccessibleTableCaption>
          Sortable Invoice List - Use keyboard to navigate and sort
        </AccessibleTableCaption>
        <AccessibleTableHeader>
          <AccessibleTableRow>
            <SortableTableHead
              sortKey="id"
              currentSort={sortConfig}
              onSort={requestSort}
              sortLabel="Sort by invoice ID"
            >
              Invoice
            </SortableTableHead>
            <SortableTableHead
              sortKey="status"
              currentSort={sortConfig}
              onSort={requestSort}
              sortLabel="Sort by payment status"
            >
              Status
            </SortableTableHead>
            <SortableTableHead
              sortKey="method"
              currentSort={sortConfig}
              onSort={requestSort}
              sortLabel="Sort by payment method"
            >
              Method
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
          {data.map((invoice) => (
            <AccessibleTableRow key={invoice.id}>
              <AccessibleTableCell scope="row" className="font-medium">
                {invoice.id}
              </AccessibleTableCell>
              <AccessibleTableCell>{invoice.status}</AccessibleTableCell>
              <AccessibleTableCell>{invoice.method}</AccessibleTableCell>
              <AccessibleTableCell>${invoice.amount.toFixed(2)}</AccessibleTableCell>
            </AccessibleTableRow>
          ))}
        </AccessibleTableBody>
      </AccessibleTable>
    )
  },
}

export const DataTableExample = {
  render: () => {
    const columns: Column<Invoice>[] = [
      {
        key: "id",
        header: "Invoice",
        sortable: true,
        abbr: "ID",
        cellScope: "row",
        ariaLabel: "Sort by invoice number",
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        ariaLabel: "Sort by payment status",
        render: (value) => {
          const status = value as string
          const variant =
            status === "Paid" ? "default" : status === "Pending" ? "secondary" : "destructive"
          return <Badge variant={variant}>{status}</Badge>
        },
      },
      {
        key: "method",
        header: "Payment Method",
        sortable: true,
        ariaLabel: "Sort by payment method",
      },
      {
        key: "amount",
        header: "Amount",
        sortable: true,
        ariaLabel: "Sort by amount",
        render: (value) => {
          const amount = value as number
          return (
            <span className="font-medium">
              ${amount.toFixed(2)}
            </span>
          )
        },
      },
      {
        key: "date",
        header: "Date",
        sortable: true,
        ariaLabel: "Sort by date",
      },
    ]

    return (
      <DataTable
        data={invoiceData}
        columns={columns}
        caption="Complete invoice history with sorting capabilities"
        description="Table showing invoice details. Click any row to view details. Use column headers to sort."
        rowKeyField="id"
        initialSort={{ key: "date", direction: "desc" }}
        onRowClick={(invoice) => {
          alert(`Clicked invoice: ${invoice.id}`)
        }}
      />
    )
  },
}

export const ComplexTable = {
  render: () => {
    interface User {
      id: number
      name: string
      email: string
      role: string
      status: "active" | "inactive"
      lastLogin: string
      projects: number
    }

    const users: User[] = [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "active", lastLogin: "2024-01-15", projects: 12 },
      { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Developer", status: "active", lastLogin: "2024-01-14", projects: 8 },
      { id: 3, name: "Carol White", email: "carol@example.com", role: "Designer", status: "inactive", lastLogin: "2023-12-20", projects: 5 },
      { id: 4, name: "David Brown", email: "david@example.com", role: "Developer", status: "active", lastLogin: "2024-01-15", projects: 15 },
      { id: 5, name: "Eve Davis", email: "eve@example.com", role: "Manager", status: "active", lastLogin: "2024-01-13", projects: 20 },
    ]

    const columns: Column<User>[] = [
      {
        key: "name",
        header: "Name",
        sortable: true,
        cellScope: "row",
        ariaLabel: "Sort by user name",
      },
      {
        key: "email",
        header: "Email Address",
        sortable: true,
        ariaLabel: "Sort by email",
      },
      {
        key: "role",
        header: "Role",
        sortable: true,
        ariaLabel: "Sort by role",
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        ariaLabel: "Sort by account status",
        render: (value) => {
          const status = value as "active" | "inactive"
          return (
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status}
            </Badge>
          )
        },
      },
      {
        key: "projects",
        header: "Projects",
        sortable: true,
        ariaLabel: "Sort by number of projects",
        render: (value) => (
          <span className="font-mono">{value}</span>
        ),
      },
      {
        key: "lastLogin",
        header: "Last Login",
        sortable: true,
        abbr: "Login",
        ariaLabel: "Sort by last login date",
      },
    ]

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Accessibility Features Demonstrated:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Proper table structure with thead, tbody</li>
            <li>Scope attributes on all header cells</li>
            <li>Row headers for first column</li>
            <li>ARIA labels for sort functionality</li>
            <li>Keyboard navigation (Tab, Enter, Space)</li>
            <li>ARIA sort states (ascending/descending/none)</li>
            <li>Screen reader descriptions</li>
            <li>Focus indicators</li>
          </ul>
        </div>
        <DataTable
          data={users}
          columns={columns}
          caption="User Management Dashboard"
          description="Table of all users with their roles, status, and activity. Sortable by any column. Press Enter or Space on a row to view details."
          rowKeyField="id"
          initialSort={{ key: "name", direction: "asc" }}
          onRowClick={(user) => {
            console.log("Selected user:", user)
          }}
        />
      </div>
    )
  },
}
