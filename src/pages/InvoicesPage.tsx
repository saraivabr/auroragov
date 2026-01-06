import { useState } from 'react'
import { SupabaseDataTable } from '@/components/ui/supabase-data-table'
import { Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useInvoices } from '@/hooks/useInvoices'
import { createInvoice, deleteInvoice } from '@/lib/api/invoices'
import { useToast } from '@/components/ui/use-toast'
import type { Invoice } from '@/types/database'

export function InvoicesPage() {
  const { data, loading, error, refetch } = useInvoices({
    sortBy: 'date',
    sortDirection: 'desc',
  })
  const { toast } = useToast()
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const columns: Column<Invoice>[] = [
    {
      key: 'invoice_number',
      header: 'Invoice',
      sortable: true,
      cellScope: 'row',
      ariaLabel: 'Sort by invoice number',
    },
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      ariaLabel: 'Sort by customer name',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      ariaLabel: 'Sort by payment status',
      render: (value) => {
        const status = value as string
        const variant =
          status === 'paid'
            ? 'default'
            : status === 'pending'
            ? 'secondary'
            : 'destructive'
        return <Badge variant={variant}>{status}</Badge>
      },
    },
    {
      key: 'payment_method',
      header: 'Payment Method',
      sortable: true,
      ariaLabel: 'Sort by payment method',
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      ariaLabel: 'Sort by amount',
      render: (value) => {
        const amount = value as number
        return <span className="font-medium">${amount.toFixed(2)}</span>
      },
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      ariaLabel: 'Sort by date',
      render: (value) => {
        const date = value as string
        return new Date(date).toLocaleDateString()
      },
    },
  ]

  const handleAddInvoice = async () => {
    try {
      const invoiceNumber = `INV${Date.now().toString().slice(-6)}`
      await createInvoice({
        invoice_number: invoiceNumber,
        customer_name: 'New Customer',
        customer_email: 'customer@example.com',
        status: 'pending',
        payment_method: 'Credit Card',
        amount: 100.0,
        date: new Date().toISOString().split('T')[0],
        notes: null,
      })

      toast({
        title: 'Invoice created',
        description: `Invoice ${invoiceNumber} has been created successfully.`,
      })

      refetch()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteInvoice(id)

      toast({
        title: 'Invoice deleted',
        description: 'Invoice has been deleted successfully.',
      })

      refetch()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete invoice',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage your invoices and track payments</p>
        </div>
        <Button onClick={handleAddInvoice}>
          <Plus className="h-4 w-4 mr-2" />
          Add Invoice
        </Button>
      </div>

      <SupabaseDataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        caption="Invoice List"
        description="Complete list of invoices with payment status. Click any row to view details."
        rowKeyField="id"
        initialSort={{ key: 'date', direction: 'desc' }}
        onRefresh={refetch}
        emptyMessage="No invoices found. Click 'Add Invoice' to create one."
      />
    </div>
  )
}
