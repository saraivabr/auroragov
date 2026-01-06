import { SupabaseDataTable } from '@/components/ui/supabase-data-table'
import { Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { useAuditLogs } from '@/hooks/useAuditLogs'
import type { AuditLog } from '@/types/database'

export function AuditLogsPage() {
  const { data, loading, error, refetch } = useAuditLogs({ limit: 100 })

  const columns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      ariaLabel: 'Sort by timestamp',
      render: (value) => {
        const date = new Date(value as string)
        return (
          <span className="text-sm">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </span>
        )
      },
    },
    {
      key: 'user_name',
      header: 'User',
      sortable: true,
      ariaLabel: 'Sort by user',
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      ariaLabel: 'Sort by action',
      render: (value) => {
        const action = value as string
        return <Badge variant="outline">{action}</Badge>
      },
    },
    {
      key: 'entity_type',
      header: 'Entity Type',
      sortable: true,
      ariaLabel: 'Sort by entity type',
    },
    {
      key: 'details',
      header: 'Details',
      sortable: false,
      render: (value) => {
        const details = value as string
        return <span className="text-sm text-muted-foreground truncate max-w-md block">{details}</span>
      },
    },
  ]

  return (
    <div className="container mx-auto py-8 space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Track all system activities and changes</p>
      </div>

      <SupabaseDataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        caption="System Audit Trail"
        description="Comprehensive log of all system activities and user actions."
        rowKeyField="id"
        initialSort={{ key: 'timestamp', direction: 'desc' }}
        onRefresh={refetch}
        emptyMessage="No audit logs found."
      />
    </div>
  )
}
