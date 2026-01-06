import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InvoicesPage } from './InvoicesPage'
import { UsersPage } from './UsersPage'
import { ProductsPage } from './ProductsPage'
import { AuditLogsPage } from './AuditLogsPage'
import { seedDatabase, clearDatabase } from '@/lib/seed-data'
import { useToast } from '@/components/ui/use-toast'
import { Database, Trash2, RefreshCw } from 'lucide-react'

export function DemoPage() {
  const [seeding, setSeeding] = useState(false)
  const [clearing, setClearing] = useState(false)
  const { toast } = useToast()

  const handleSeedDatabase = async () => {
    setSeeding(true)
    try {
      const result = await seedDatabase()
      if (result.success) {
        toast({
          title: 'Database seeded',
          description: 'Sample data has been added successfully.',
        })
      } else {
        throw new Error('Seeding failed')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to seed database',
        variant: 'destructive',
      })
    } finally {
      setSeeding(false)
    }
  }

  const handleClearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all data?')) return

    setClearing(true)
    try {
      const result = await clearDatabase()
      if (result.success) {
        toast({
          title: 'Database cleared',
          description: 'All data has been removed.',
        })
      } else {
        throw new Error('Clearing failed')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear database',
        variant: 'destructive',
      })
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Accessible Data Tables Demo</CardTitle>
          <CardDescription>
            This demo showcases fully accessible data tables integrated with Supabase for real-time data management.
            All tables include proper ARIA attributes, keyboard navigation, sorting, and screen reader support.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={handleSeedDatabase} disabled={seeding}>
            <Database className="h-4 w-4 mr-2" />
            {seeding ? 'Seeding...' : 'Seed Sample Data'}
          </Button>
          <Button variant="outline" onClick={handleClearDatabase} disabled={clearing}>
            <Trash2 className="h-4 w-4 mr-2" />
            {clearing ? 'Clearing...' : 'Clear Database'}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <InvoicesPage />
        </TabsContent>

        <TabsContent value="users">
          <UsersPage />
        </TabsContent>

        <TabsContent value="products">
          <ProductsPage />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogsPage />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Proper semantic HTML structure with thead, tbody, th, td elements</li>
            <li>Scope attributes on all header cells for screen reader context</li>
            <li>ARIA labels and descriptions for all interactive elements</li>
            <li>Keyboard navigation with Tab, Enter, and Space keys</li>
            <li>Sortable columns with visual and ARIA sort indicators</li>
            <li>Focus indicators that meet WCAG contrast requirements</li>
            <li>Loading states with skeleton loaders</li>
            <li>Error handling with retry functionality</li>
            <li>Real-time data synchronization with Supabase</li>
            <li>Full CRUD operations with optimistic updates</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
