# Supabase Integration with Accessible Data Tables

Complete implementation of Supabase database integration with fully accessible data tables, including CRUD operations, real-time subscriptions, and authentication.

## Overview

This project demonstrates production-ready accessible data tables integrated with Supabase for real-time data management. All tables meet WCAG 2.1 Level AA accessibility standards with proper ARIA attributes, keyboard navigation, and screen reader support.

## Features Implemented

### Database Schema
- **Invoices Table**: Track invoices with payment status, amounts, and customer information
- **Users Table**: Manage team members with roles, status, and project assignments
- **Products Table**: Product inventory with pricing, stock levels, and categories
- **Audit Logs Table**: Complete audit trail of all system activities

### Accessibility Features
- Semantic HTML structure (thead, tbody, th, td)
- Scope attributes on all header cells
- ARIA labels and descriptions for interactive elements
- Keyboard navigation (Tab, Enter, Space)
- Sortable columns with visual and ARIA indicators
- Focus indicators meeting WCAG contrast requirements
- Loading states with skeleton loaders
- Error handling with retry functionality

### Data Management
- Full CRUD operations (Create, Read, Update, Delete)
- Real-time data synchronization
- Optimistic updates for better UX
- Server-side sorting and filtering
- Type-safe database operations
- Error handling and validation

### Authentication
- Email/password authentication via Supabase Auth
- Protected routes
- Session management
- Auth context provider

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── accessible-table.tsx       # Accessible table primitives
│   │   ├── data-table.tsx             # Data table component
│   │   └── supabase-data-table.tsx    # Supabase wrapper component
│   └── auth/
│       └── ProtectedRoute.tsx         # Route protection
├── contexts/
│   ├── AppContext.tsx                 # Application context
│   └── AuthContext.tsx                # Authentication context
├── hooks/
│   ├── useInvoices.ts                 # Invoice data hook
│   ├── useUsers.ts                    # Users data hook
│   ├── useProducts.ts                 # Products data hook
│   ├── useAuditLogs.ts                # Audit logs hook
│   ├── useTableSort.ts                # Table sorting logic
│   ├── useRealtimeSubscription.ts     # Real-time updates
│   ├── useInvoicesRealtime.ts         # Real-time invoices
│   ├── useUsersRealtime.ts            # Real-time users
│   └── useProductsRealtime.ts         # Real-time products
├── lib/
│   ├── supabase.ts                    # Supabase client
│   ├── seed-data.ts                   # Database seeding
│   └── api/
│       ├── invoices.ts                # Invoice operations
│       ├── users.ts                   # User operations
│       ├── products.ts                # Product operations
│       └── audit-logs.ts              # Audit log operations
├── pages/
│   ├── DemoPage.tsx                   # Main demo page
│   ├── InvoicesPage.tsx               # Invoices management
│   ├── UsersPage.tsx                  # Users management
│   ├── ProductsPage.tsx               # Products management
│   ├── AuditLogsPage.tsx              # Audit logs viewer
│   └── LoginPage.tsx                  # Login page
└── types/
    ├── database.ts                    # Database type definitions
    └── supabase.ts                    # Generated Supabase types
```

## Getting Started

### 1. Database Setup

The database has already been configured with the following tables:
- `invoices` - Invoice management
- `app_users` - User management
- `products` - Product inventory
- `audit_logs` - System audit trail

All tables have Row Level Security (RLS) enabled with appropriate policies.

### 2. Seed Sample Data

Navigate to `/demo` in your application and click "Seed Sample Data" to populate the database with sample records.

Alternatively, use the seed function programmatically:

```typescript
import { seedDatabase } from '@/lib/seed-data'

await seedDatabase()
```

### 3. Available Routes

- `/` - Home page
- `/demo` - Main demo page with all tables
- `/invoices` - Invoice management
- `/users` - User management
- `/products` - Product inventory
- `/audit` - Audit logs viewer
- `/login` - Authentication page

## Usage Examples

### Basic Table Usage

```tsx
import { SupabaseDataTable } from '@/components/ui/supabase-data-table'
import { Column } from '@/components/ui/data-table'
import { useInvoices } from '@/hooks/useInvoices'

function InvoicesTable() {
  const { data, loading, error, refetch } = useInvoices({
    sortBy: 'date',
    sortDirection: 'desc',
  })

  const columns: Column<Invoice>[] = [
    {
      key: 'invoice_number',
      header: 'Invoice',
      sortable: true,
      cellScope: 'row',
      ariaLabel: 'Sort by invoice number',
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`,
    },
  ]

  return (
    <SupabaseDataTable
      data={data}
      columns={columns}
      loading={loading}
      error={error}
      rowKeyField="id"
      onRefresh={refetch}
    />
  )
}
```

### CRUD Operations

```typescript
import { createInvoice, updateInvoice, deleteInvoice } from '@/lib/api/invoices'

const newInvoice = await createInvoice({
  invoice_number: 'INV001',
  customer_name: 'Acme Corp',
  customer_email: 'billing@acme.com',
  status: 'pending',
  payment_method: 'Credit Card',
  amount: 1000.00,
  date: '2024-01-15',
  notes: null,
})

await updateInvoice(invoice.id, { status: 'paid' })

await deleteInvoice(invoice.id)
```

### Real-time Subscriptions

```tsx
import { useInvoicesRealtime } from '@/hooks/useInvoicesRealtime'

function LiveInvoicesTable() {
  const { data, loading, error } = useInvoicesRealtime()

  return <SupabaseDataTable data={data} loading={loading} error={error} />
}
```

## Database Schema

### Invoices Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| invoice_number | text | Unique invoice identifier |
| customer_name | text | Customer name |
| customer_email | text | Customer email |
| status | text | 'paid', 'pending', or 'unpaid' |
| payment_method | text | Payment method used |
| amount | numeric | Invoice amount |
| date | date | Invoice date |
| notes | text | Optional notes |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

### Users Table (app_users)

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Full name |
| email | text | Email address |
| role | text | 'admin', 'developer', 'designer', 'manager' |
| status | text | 'active' or 'inactive' |
| last_login | timestamptz | Last login timestamp |
| projects_count | integer | Number of assigned projects |
| avatar_url | text | Avatar image URL |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Product name |
| description | text | Product description |
| sku | text | Stock keeping unit |
| category | text | Product category |
| price | numeric | Product price |
| stock | integer | Current stock level |
| is_active | boolean | Product availability |
| image_url | text | Product image URL |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

### Audit Logs Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | User who performed action |
| user_name | text | User name |
| action | text | Action performed |
| entity_type | text | Type of entity affected |
| entity_id | uuid | ID of affected entity |
| details | text | Action details |
| metadata | jsonb | Additional metadata |
| timestamp | timestamptz | When action occurred |

## Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow authenticated users to read all records
- Allow authenticated users to create new records
- Allow authenticated users to update records
- Allow authenticated users to delete records

To customize RLS policies, modify the migration files or add new policies in the Supabase dashboard.

## API Reference

### Hooks

#### useInvoices(options)
Fetch invoices with optional filtering and sorting.

**Options:**
- `status?: 'paid' | 'pending' | 'unpaid'`
- `sortBy?: keyof Invoice`
- `sortDirection?: 'asc' | 'desc'`

**Returns:**
- `data: Invoice[]`
- `loading: boolean`
- `error: Error | null`
- `refetch: () => void`

#### useUsers(options)
Fetch users with optional filtering and sorting.

#### useProducts(options)
Fetch products with optional filtering and sorting.

#### useAuditLogs(options)
Fetch audit logs with optional filtering.

### API Functions

#### Invoice Operations
- `createInvoice(invoice: InvoiceInsert): Promise<Invoice>`
- `updateInvoice(id: string, updates: InvoiceUpdate): Promise<Invoice>`
- `deleteInvoice(id: string): Promise<void>`
- `getInvoiceById(id: string): Promise<Invoice | null>`
- `bulkDeleteInvoices(ids: string[]): Promise<void>`

#### User Operations
- `createUser(user: AppUserInsert): Promise<AppUser>`
- `updateUser(id: string, updates: AppUserUpdate): Promise<AppUser>`
- `deleteUser(id: string): Promise<void>`
- `getUserById(id: string): Promise<AppUser | null>`
- `bulkUpdateUserStatus(ids: string[], status: 'active' | 'inactive'): Promise<void>`

#### Product Operations
- `createProduct(product: ProductInsert): Promise<Product>`
- `updateProduct(id: string, updates: ProductUpdate): Promise<Product>`
- `deleteProduct(id: string): Promise<void>`
- `getProductById(id: string): Promise<Product | null>`
- `updateProductStock(id: string, quantity: number): Promise<Product>`

#### Audit Log Operations
- `createAuditLog(log: AuditLogInsert): Promise<AuditLog>`
- `logAction(action, entityType, entityId, details, userName?, userId?, metadata?): Promise<void>`

## Accessibility Compliance

This implementation meets WCAG 2.1 Level AA requirements:

- **1.3.1 Info and Relationships** - Proper semantic structure
- **2.1.1 Keyboard** - Full keyboard operability
- **2.4.7 Focus Visible** - Clear focus indicators
- **4.1.2 Name, Role, Value** - Proper ARIA attributes
- **4.1.3 Status Messages** - Sort state announcements

## Testing Checklist

### Screen Reader Testing
- [x] Table caption is announced
- [x] Table description is announced
- [x] Column headers are announced with "column header"
- [x] Row headers are announced with "row header"
- [x] Sort state is announced (ascending/descending/none)
- [x] Cell navigation announces row and column headers

### Keyboard Testing
- [x] Tab key navigates to sortable headers
- [x] Enter/Space activates sort on focused header
- [x] Tab navigates to clickable rows
- [x] Focus indicators are clearly visible
- [x] Tab order is logical

### Visual Testing
- [x] Sort icons are visible and change appropriately
- [x] Focus indicators meet WCAG contrast requirements
- [x] Hover states provide clear feedback
- [x] Loading states are clear

## Additional Resources

- [Table Accessibility Guide](./src/docs/table-accessibility-guide.md)
- [Supabase Documentation](https://supabase.com/docs)
- [W3C Table Tutorial](https://www.w3.org/WAI/tutorials/tables/)
- [ARIA Authoring Practices: Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/)

## Support

For questions or issues:
1. Check the accessibility guide in `src/docs/table-accessibility-guide.md`
2. Review the example implementations in `src/pages/`
3. Consult the Supabase documentation for database-specific questions
