import { FileText, ChevronRight, HelpCircle, Star, Sparkles } from 'lucide-react';
import { PROMPT_TEMPLATES } from '@/data/templates';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { EditalReviewHelper } from './EditalReviewHelper';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { PromptTemplate } from '@/types/ai-models';

interface TemplateLibraryProps {
  onSelectTemplate?: (prompt: string) => void;
}

export function TemplateLibrary({ onSelectTemplate: onSelectTemplateProp }: TemplateLibraryProps) {
  const { 
    handleSelectTemplate, 
    toggleFavoriteTemplate, 
    favoriteTemplates,
    getRecommendedTemplates,
    templateUsage
  } = useApp();
  
  const onSelectTemplate = (template: PromptTemplate) => {
    handleSelectTemplate(template);
    onSelectTemplateProp?.(template.prompt);
  };
  
  const categories = Array.from(new Set(PROMPT_TEMPLATES.map(t => t.category)));
  const recommendedTemplates = getRecommendedTemplates(PROMPT_TEMPLATES);
  const hasRecommendations = recommendedTemplates.length > 0 && Object.keys(templateUsage).length > 0;

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
              className="text-govbr-yellow hover:text-govbr-yellow/80 hover:bg-govbr-yellow/10"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Ajuda Edital
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#0A1628] border-govbr-blue-light/30">
            <DialogHeader>
              <DialogTitle className="text-white">Assistente de Revisão de Edital</DialogTitle>
            </DialogHeader>
            <EditalReviewHelper 
              onUseTemplate={() => {
                const editalTemplate = PROMPT_TEMPLATES.find(t => t.id === 'edital');
                if (editalTemplate) {
                  onSelectTemplate(editalTemplate);
                }
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="space-y-6 pr-4">
          {/* Recommended Templates Section */}
          {hasRecommendations && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <h4 className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                  Recomendados para Você
                </h4>
              </div>
              
              <div className="space-y-2">
                {recommendedTemplates.map((template) => (
                  <button
                    key={`rec-${template.id}`}
                    onClick={() => onSelectTemplate(template)}
                    className="w-full p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-200 text-left group relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-white">
                              {template.title}
                            </span>
                            {favoriteTemplates.includes(template.id) && (
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            )}
                            <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400 px-1.5 py-0">
                              Usado {templateUsage[template.id]?.count || 0}x
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteTemplate(template.id);
                        }}
                        className="text-gray-500 hover:text-amber-400 transition-colors flex-shrink-0"
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            favoriteTemplates.includes(template.id) 
                              ? 'fill-amber-400 text-amber-400' 
                              : ''
                          }`} 
                        />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* All Templates by Category */}
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <h4 className="text-xs font-medium text-govbr-yellow uppercase tracking-wider">
                {category}
              </h4>
              
              <div className="space-y-2">
                {PROMPT_TEMPLATES.filter(t => t.category === category).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-govbr-yellow/50 hover:bg-gray-800 transition-all duration-200 text-left group relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="w-4 h-4 text-govbr-yellow mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-white">
                              {template.title}
                            </span>
                            {favoriteTemplates.includes(template.id) && (
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            )}
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteTemplate(template.id);
                        }}
                        className="text-gray-500 hover:text-amber-400 transition-colors flex-shrink-0"
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            favoriteTemplates.includes(template.id) 
                              ? 'fill-amber-400 text-amber-400' 
                              : ''
                          }`} 
                        />
                      </button>
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
