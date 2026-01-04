import { FileText, ChevronRight, HelpCircle } from 'lucide-react';
import { PROMPT_TEMPLATES } from '@/data/templates';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { EditalReviewHelper } from './EditalReviewHelper';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TemplateLibraryProps {
  onSelectTemplate: (prompt: string) => void;
}

export function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const categories = Array.from(new Set(PROMPT_TEMPLATES.map(t => t.category)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Biblioteca de Templates
        </h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Ajuda Edital
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#0A1628] border-cyan-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Assistente de Revisão de Edital</DialogTitle>
            </DialogHeader>
            <EditalReviewHelper 
              onUseTemplate={() => {
                const editalTemplate = PROMPT_TEMPLATES.find(t => t.id === 'edital');
                if (editalTemplate) {
                  onSelectTemplate(editalTemplate.prompt);
                }
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="space-y-6 pr-4">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <h4 className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                {category}
              </h4>
              
              <div className="space-y-2">
                {PROMPT_TEMPLATES.filter(t => t.category === category).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template.prompt)}
                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-cyan-500/50 hover:bg-gray-800 transition-all duration-200 text-left group relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-white">
                              {template.title}
                            </span>
                            {template.id === 'edital' && (
                              <Badge variant="outline" className="text-xs border-orange-500/50 text-orange-400 px-1.5 py-0">
                                Aprimorado
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
