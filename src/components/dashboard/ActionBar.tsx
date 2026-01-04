import { FileText, GitCompare, ThumbsUp, ThumbsDown, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface ActionBarProps {
  onOpenDocument: () => void;
  onOpenComparison: () => void;
  onFeedback: (type: 'positive' | 'negative') => void;
  onExport: (format: 'pdf' | 'docx' | 'txt') => void;
  hasMessages: boolean;
}

export function ActionBar({
  onOpenDocument,
  onOpenComparison,
  onFeedback,
  onExport,
  hasMessages
}: ActionBarProps) {
  return (
    <div className="border-b border-cyan-500/20 bg-[#0A1628]/60 backdrop-blur-md px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenDocument}
            disabled={!hasMessages}
            className="text-gray-300 hover:text-white hover:bg-cyan-500/10"
          >
            <FileText className="w-4 h-4 mr-2" />
            Área de Trabalho
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenComparison}
            className="text-gray-300 hover:text-white hover:bg-cyan-500/10"
          >
            <GitCompare className="w-4 h-4 mr-2" />
            Comparar Modelos
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFeedback('positive')}
            disabled={!hasMessages}
            className="text-gray-300 hover:text-green-400 hover:bg-green-500/10"
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFeedback('negative')}
            disabled={!hasMessages}
            className="text-gray-300 hover:text-red-400 hover:bg-red-500/10"
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={!hasMessages}
                className="text-gray-300 hover:text-white hover:bg-cyan-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
              <DropdownMenuItem onClick={() => onExport('pdf')} className="text-gray-300 hover:text-white">
                Exportar como PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('docx')} className="text-gray-300 hover:text-white">
                Exportar como DOCX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('txt')} className="text-gray-300 hover:text-white">
                Exportar como TXT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            disabled={!hasMessages}
            className="text-gray-300 hover:text-white hover:bg-cyan-500/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  );
}
