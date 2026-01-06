import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, AlertTriangle, Info, Sparkles, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AnaliseEdital } from '@/types/database';
import { deleteAnaliseEdital } from '@/lib/api/editais';
import { useToast } from '@/components/ui/use-toast';

interface AnalisesSectionProps {
  analises: AnaliseEdital[];
  onRefresh: () => void;
  onNovaAnalise: () => void;
}

const criticidadeConfig = {
  critica: { label: 'Crítica', variant: 'destructive' as const, color: 'text-red-500' },
  alta: { label: 'Alta', variant: 'destructive' as const, color: 'text-orange-500' },
  media: { label: 'Média', variant: 'secondary' as const, color: 'text-yellow-500' },
  baixa: { label: 'Baixa', variant: 'default' as const, color: 'text-green-500' }
};

export function AnalisesSection({ analises, onRefresh, onNovaAnalise }: AnalisesSectionProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta análise?')) return;

    try {
      await deleteAnaliseEdital(id);
      toast({
        title: 'Análise excluída',
        description: 'A análise foi removida com sucesso.'
      });
      onRefresh();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a análise.',
        variant: 'destructive'
      });
    }
  };

  if (analises.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma análise realizada</h3>
          <p className="text-muted-foreground text-center mb-4">
            Utilize a IA para analisar este edital e identificar possíveis problemas
          </p>
          <Button onClick={onNovaAnalise}>
            <Sparkles className="w-4 h-4 mr-2" />
            Realizar Primeira Análise
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {analises.map((analise) => (
        <Card key={analise.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={criticidadeConfig[analise.criticidade_geral].variant}>
                    {criticidadeConfig[analise.criticidade_geral].label}
                  </Badge>
                  <Badge variant="outline">{analise.tipo_analise}</Badge>
                  {analise.modelo_ia && (
                    <Badge variant="outline">{analise.modelo_ia}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(analise.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                      locale: ptBR
                    })}
                  </span>
                  <span>•</span>
                  <span>por {analise.usuario_nome}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(analise.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {analise.pontos_criticos && analise.pontos_criticos.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  Pontos Críticos ({analise.pontos_criticos.length})
                </h4>
                <div className="space-y-2">
                  {analise.pontos_criticos.map((ponto: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                      <p className="text-sm font-medium mb-1">{ponto.titulo}</p>
                      <p className="text-sm text-muted-foreground">{ponto.descricao}</p>
                      {ponto.referencia_legal && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {ponto.referencia_legal}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analise.pontos_importantes && analise.pontos_importantes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-orange-500">
                  <AlertTriangle className="w-4 h-4" />
                  Pontos Importantes ({analise.pontos_importantes.length})
                </h4>
                <div className="space-y-2">
                  {analise.pontos_importantes.map((ponto: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg border border-orange-500/30 bg-orange-500/5">
                      <p className="text-sm font-medium mb-1">{ponto.titulo}</p>
                      <p className="text-sm text-muted-foreground">{ponto.descricao}</p>
                      {ponto.referencia_legal && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {ponto.referencia_legal}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analise.sugestoes && analise.sugestoes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-500">
                  <Info className="w-4 h-4" />
                  Sugestões ({analise.sugestoes.length})
                </h4>
                <div className="space-y-2">
                  {analise.sugestoes.map((ponto: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/5">
                      <p className="text-sm font-medium mb-1">{ponto.titulo}</p>
                      <p className="text-sm text-muted-foreground">{ponto.descricao}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
