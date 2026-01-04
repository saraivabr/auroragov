import { memo } from 'react';
import { Clock, Download, User, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AuditEntry } from '@/types/ai-models';
import { Badge } from '@/components/ui/badge';

interface AuditTrailProps {
  entries: AuditEntry[];
}

// Memoized individual audit entry component
const AuditEntryItem = memo(({ entry }: { entry: AuditEntry }) => (
  <div className="relative pl-6 pb-8 last:pb-4">
    <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-cyan-500"></div>
    <div className="absolute left-[3px] top-2 w-px h-full bg-cyan-500/20"></div>
    
    <div className="glass-effect rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-cyan-400">
          {entry.action}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(entry.timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <User className="w-3 h-3" />
        <span>{entry.user}</span>
      </div>
      
      {entry.model && (
        <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
          {entry.model}
        </Badge>
      )}
      
      <p className="text-xs text-gray-300 line-clamp-2">
        {entry.details}
      </p>
    </div>
  </div>
));

AuditEntryItem.displayName = 'AuditEntryItem';

export const AuditTrail = memo(function AuditTrail({ entries }: AuditTrailProps) {
  const handleExport = (format: 'pdf' | 'csv') => {
    // Mock export functionality
    console.log(`Exporting audit trail as ${format}`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Trilha de Auditoria
          </h3>
          <Badge variant="secondary" className="text-xs">
            {entries.length} registros
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="flex-1 text-xs border-gray-700 hover:border-cyan-500/50"
          >
            <Download className="w-3 h-3 mr-1" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            className="flex-1 text-xs border-gray-700 hover:border-cyan-500/50"
          >
            <Download className="w-3 h-3 mr-1" />
            CSV
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Nenhuma atividade registrada</p>
            </div>
          ) : (
            entries.map((entry) => (
              <AuditEntryItem key={entry.id} entry={entry} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
});
