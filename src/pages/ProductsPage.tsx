import { SupabaseDataTable } from '@/components/ui/supabase-data-table'
import { Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { createProduct } from '@/lib/api/products'
import { useToast } from '@/components/ui/use-toast'
import type { Product } from '@/types/database'

export function ProductsPage() {
  const { data, loading, error, refetch } = useProducts({
    sortBy: 'name',
    sortDirection: 'asc',
  })
  const { toast } = useToast()

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      cellScope: 'row',
      ariaLabel: 'Sort by product name',
    },
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      abbr: 'SKU',
      ariaLabel: 'Sort by SKU',
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      ariaLabel: 'Sort by category',
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      ariaLabel: 'Sort by price',
      render: (value) => {
        const price = value as number
        return <span className="font-medium">${price.toFixed(2)}</span>
      },
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      ariaLabel: 'Sort by stock level',
      render: (value) => {
        const stock = value as number
        const variant = stock > 20 ? 'default' : stock > 10 ? 'secondary' : 'destructive'
        return <Badge variant={variant}>{stock}</Badge>
      },
    },
    {
      key: 'is_active',
      header: 'Status',
      sortable: true,
      ariaLabel: 'Sort by status',
      render: (value) => {
        const isActive = value as boolean
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
  ]

  const handleAddProduct = async () => {
    try {
      const randomNum = Math.floor(Math.random() * 10000)
      await createProduct({
        name: `Product ${randomNum}`,
        description: 'New product description',
        sku: `SKU${randomNum}`,
        category: 'General',
        price: 99.99,
        stock: 50,
        is_active: true,
        image_url: null,
      })

      toast({
        title: 'Product created',
        description: 'New product has been created successfully.',
      })

      refetch()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage product inventory and pricing</p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <SupabaseDataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        caption="Product Inventory"
        description="Complete list of products with pricing and stock levels. Click any row to view details."
        rowKeyField="id"
        initialSort={{ key: 'name', direction: 'asc' }}
        onRefresh={refetch}
        emptyMessage="No products found. Click 'Add Product' to create one."
      />
    </div>
  )
}
