import { useState, useMemo } from 'react';
import { Check, ChevronDown, Sparkles, Zap, DollarSign, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useModels } from '@/hooks/useModels';
import type { AIModel } from '@/types/openrouter';

interface ModelSelectorProps {
  value?: string;
  onValueChange: (modelId: string) => void;
  agentId?: string;
  showPrice?: boolean;
  showDescription?: boolean;
  disabled?: boolean;
}

export function ModelSelector({
  value,
  onValueChange,
  agentId,
  showPrice = true,
  showDescription = false,
  disabled = false,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'recommended' | 'economico' | 'qualidade'>('all');

  const { models, recommended, loading, groupedByProvider } = useModels({
    available: true,
  });

  const selectedModel = useMemo(() => {
    return models.find(m => m.model_id === value);
  }, [models, value]);

  const filteredModels = useMemo(() => {
    switch (filter) {
      case 'recommended':
        return recommended;
      case 'economico':
        return models.filter(m => m.tags.includes('economico'));
      case 'qualidade':
        return models.filter(m => m.tags.includes('qualidade') || m.tags.includes('premium'));
      default:
        return models;
    }
  }, [filter, models, recommended]);

  const formatPrice = (input: number | null, output: number | null) => {
    if (!input || !output) return 'N/A';
    return `$${input.toFixed(2)}/$${output.toFixed(2)}`;
  };

  const getProviderIcon = (provider: string) => {
    const icons: Record<string, string> = {
      'anthropic': '🤖',
      'openai': '🔮',
      'google': '🔍',
      'meta': '🦙',
      'mistral': '🌬️',
      'cohere': '💬',
      'qwen': '🐉',
    };
    return icons[provider] || '🤖';
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'recomendado':
        return <Sparkles className="h-3 w-3" />;
      case 'rapido':
      case 'economico':
        return <Zap className="h-3 w-3" />;
      case 'qualidade':
      case 'premium':
        return <Sparkles className="h-3 w-3" />;
      case 'portugues':
        return <Globe className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Button variant="outline" disabled className="w-full justify-between">
        Carregando modelos...
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedModel ? (
              <>
                <span className="text-lg">{getProviderIcon(selectedModel.provider)}</span>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="font-medium truncate">{selectedModel.display_name}</span>
                  {showPrice && selectedModel.pricing_input && selectedModel.pricing_output && (
                    <span className="text-xs text-muted-foreground">
                      {formatPrice(selectedModel.pricing_input, selectedModel.pricing_output)} / 1M tokens
                    </span>
                  )}
                </div>
              </>
            ) : (
              <span className="text-muted-foreground">Selecione um modelo...</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar modelo..." />
          <div className="flex gap-1 p-2 border-b">
            <Button
              variant={filter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={filter === 'recommended' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('recommended')}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Recomendados
            </Button>
            <Button
              variant={filter === 'economico' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('economico')}
            >
              <DollarSign className="h-3 w-3 mr-1" />
              Econômico
            </Button>
            <Button
              variant={filter === 'qualidade' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('qualidade')}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Qualidade
            </Button>
          </div>
          <CommandList className="max-h-[400px]">
            <CommandEmpty>Nenhum modelo encontrado.</CommandEmpty>

            {filter === 'all' ? (
              Object.entries(groupedByProvider).map(([provider, providerModels]) => (
                <CommandGroup
                  key={provider}
                  heading={
                    <div className="flex items-center gap-2">
                      <span>{getProviderIcon(provider)}</span>
                      <span className="capitalize">{provider}</span>
                    </div>
                  }
                >
                  {providerModels.map((model) => (
                    <CommandItem
                      key={model.model_id}
                      value={model.model_id}
                      onSelect={() => {
                        onValueChange(model.model_id);
                        setOpen(false);
                      }}
                      className="flex items-start gap-2 py-3"
                    >
                      <Check
                        className={cn(
                          'mt-1 h-4 w-4 shrink-0',
                          value === model.model_id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{model.display_name}</span>
                          {model.is_recommended && (
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Recomendado
                            </Badge>
                          )}
                        </div>
                        {showDescription && model.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                            {model.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          {showPrice && (
                            <span className="text-xs text-muted-foreground">
                              {formatPrice(model.pricing_input, model.pricing_output)} / 1M
                            </span>
                          )}
                          {model.context_length && (
                            <span className="text-xs text-muted-foreground">
                              {model.context_length >= 1000000
                                ? `${(model.context_length / 1000000).toFixed(1)}M`
                                : `${(model.context_length / 1000).toFixed(0)}K`} contexto
                            </span>
                          )}
                          <div className="flex gap-1">
                            {model.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {getTagIcon(tag)}
                                <span className="ml-1">{tag}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            ) : (
              <CommandGroup>
                {filteredModels.map((model) => (
                  <CommandItem
                    key={model.model_id}
                    value={model.model_id}
                    onSelect={() => {
                      onValueChange(model.model_id);
                      setOpen(false);
                    }}
                    className="flex items-start gap-2 py-3"
                  >
                    <Check
                      className={cn(
                        'mt-1 h-4 w-4 shrink-0',
                        value === model.model_id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getProviderIcon(model.provider)}</span>
                        <span className="font-medium">{model.display_name}</span>
                        {model.is_recommended && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Recomendado
                          </Badge>
                        )}
                      </div>
                      {showDescription && model.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                          {model.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {showPrice && (
                          <span className="text-xs text-muted-foreground">
                            {formatPrice(model.pricing_input, model.pricing_output)} / 1M
                          </span>
                        )}
                        {model.context_length && (
                          <span className="text-xs text-muted-foreground">
                            {model.context_length >= 1000000
                              ? `${(model.context_length / 1000000).toFixed(1)}M`
                              : `${(model.context_length / 1000).toFixed(0)}K`} contexto
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
