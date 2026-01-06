import { SupabaseDataTable } from '@/components/ui/supabase-data-table'
import { Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useUsers } from '@/hooks/useUsers'
import { createUser } from '@/lib/api/users'
import { useToast } from '@/components/ui/use-toast'
import type { AppUser } from '@/types/database'

export function UsersPage() {
  const { data, loading, error, refetch } = useUsers({
    sortBy: 'name',
    sortDirection: 'asc',
  })
  const { toast } = useToast()

  const columns: Column<AppUser>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      cellScope: 'row',
      ariaLabel: 'Sort by name',
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      ariaLabel: 'Sort by email',
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      ariaLabel: 'Sort by role',
      render: (value) => {
        const role = value as string
        return <Badge variant="outline">{role}</Badge>
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      ariaLabel: 'Sort by status',
      render: (value) => {
        const status = value as string
        return (
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        )
      },
    },
    {
      key: 'projects_count',
      header: 'Projects',
      sortable: true,
      ariaLabel: 'Sort by project count',
      render: (value) => <span className="font-mono">{value}</span>,
    },
    {
      key: 'last_login',
      header: 'Last Login',
      sortable: true,
      ariaLabel: 'Sort by last login',
      render: (value) => {
        const date = value as string
        return new Date(date).toLocaleDateString()
      },
    },
  ]

  const handleAddUser = async () => {
    try {
      const randomNum = Math.floor(Math.random() * 1000)
      await createUser({
        name: `User ${randomNum}`,
        email: `user${randomNum}@example.com`,
        role: 'developer',
        status: 'active',
        projects_count: 0,
        avatar_url: null,
      })

      toast({
        title: 'User created',
        description: 'New user has been created successfully.',
      })

      refetch()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage team members and their roles</p>
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <SupabaseDataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        caption="User Management"
        description="List of all team members with their roles and status. Click any row to view details."
        rowKeyField="id"
        initialSort={{ key: 'name', direction: 'asc' }}
        onRefresh={refetch}
        emptyMessage="No users found. Click 'Add User' to create one."
      />
    </div>
  )
}
