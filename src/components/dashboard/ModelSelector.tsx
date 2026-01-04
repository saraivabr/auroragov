import { AIModel, AI_MODELS } from '@/types/ai-models';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Modelo de IA
        </h3>
        <Badge variant="secondary" className="text-xs">
          {AI_MODELS[selectedModel].specialty}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(AI_MODELS) as AIModel[]).map((modelId) => {
          const model = AI_MODELS[modelId];
          const isSelected = selectedModel === modelId;

          return (
            <button
              key={modelId}
              onClick={() => onModelChange(modelId)}
              className={cn(
                'relative p-4 rounded-lg border transition-all duration-300',
                'hover:scale-[1.02] active:scale-[0.98]',
                isSelected
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              )}
            >
              {isSelected && (
                <div className="absolute inset-0 rounded-lg animate-pulse-glow pointer-events-none" />
              )}
              
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{model.name}</span>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-gray-400">{model.specialty}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
