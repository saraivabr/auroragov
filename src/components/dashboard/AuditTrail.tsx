import { Clock, Download, User, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AuditEntry } from '@/types/ai-models';
import { Badge } from '@/components/ui/badge';

interface AuditTrailProps {
  entries: AuditEntry[];
}

export function AuditTrail({ entries }: AuditTrailProps) {
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
            entries.map((entry, index) => (
              <div
                key={entry.id}
                className="relative pl-6 pb-4 border-l-2 border-gray-800 last:border-l-0 last:pb-0 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-cyan-500 border-2 border-[#0A1628]" />
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {entry.action === 'message' ? (
                          <MessageSquare className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <User className="w-3 h-3 text-cyan-400" />
                        )}
                        <span className="text-xs font-medium text-white">
                          {entry.action}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {entry.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {entry.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>

                  {entry.model && (
                    <Badge variant="outline" className="text-xs border-gray-700">
                      {entry.model}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
