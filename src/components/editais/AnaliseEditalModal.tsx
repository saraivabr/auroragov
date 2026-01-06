import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createAnaliseEdital } from '@/lib/api/editais';
import { useApp } from '@/contexts/AppContext';
import { Loader2, Sparkles, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PontoAnalise } from '@/types/database';

interface AnaliseEditalModalProps {
  open: boolean;
  onClose: () => void;
  editalId: string;
  editalTexto: string;
  onSuccess: () => void;
}

export function AnaliseEditalModal({ open, onClose, editalId, editalTexto, onSuccess }: AnaliseEditalModalProps) {
  const { toast } = useToast();
  const { selectedModel } = useApp();
  const [loading, setLoading] = useState(false);
  const [tipoAnalise, setTipoAnalise] = useState<'completa' | 'estrutural' | 'juridica' | 'tecnica'>('completa');
  const [resultado, setResultado] = useState<{
    pontos_criticos: PontoAnalise[];
    pontos_importantes: PontoAnalise[];
    sugestoes: PontoAnalise[];
    criticidade_geral: 'baixa' | 'media' | 'alta' | 'critica';
  } | null>(null);

  const handleAnalise = async () => {
    setLoading(true);
    setResultado(null);

    setTimeout(async () => {
      try {
        const mockResultado = {
          pontos_criticos: [
            {
              titulo: 'Prazo de habilitação restritivo',
              descricao: 'O prazo de 5 dias para apresentação de documentos é inferior ao mínimo legal de 8 dias.',
              referencia_legal: 'Lei 14.133/2021, Art. 55',
              impacto: 'Pode invalidar o edital'
            },
            {
              titulo: 'Exigência desproporcional de capital social',
              descricao: 'A exigência de capital social mínimo de R$ 5.000.000,00 não guarda proporcionalidade com o valor estimado.',
              referencia_legal: 'Lei 14.133/2021, Art. 63, §2º',
              impacto: 'Restrição à competitividade'
            }
          ],
          pontos_importantes: [
            {
              titulo: 'Ausência de margem de preferência para ME/EPP',
              descricao: 'O edital não prevê a aplicação de margem de preferência para empresas de pequeno porte.',
              referencia_legal: 'Lei Complementar 123/2006, Art. 44',
              impacto: 'Recomenda-se inclusão'
            },
            {
              titulo: 'Critérios de sustentabilidade não especificados',
              descricao: 'Faltam critérios objetivos de sustentabilidade ambiental conforme legislação vigente.',
              referencia_legal: 'Lei 14.133/2021, Art. 11',
              impacto: 'Conformidade legal'
            }
          ],
          sugestoes: [
            {
              titulo: 'Clareza nos critérios de desempate',
              descricao: 'Recomenda-se detalhar melhor os critérios de desempate entre propostas.',
              referencia_legal: 'Lei 14.133/2021, Art. 60',
              impacto: 'Melhoria de processo'
            },
            {
              titulo: 'Prazo de execução',
              descricao: 'Considerar ampliar o prazo de execução de 90 para 120 dias para garantir qualidade.',
              impacto: 'Qualidade da execução'
            }
          ],
          criticidade_geral: 'alta' as const
        };

        await createAnaliseEdital({
          edital_id: editalId,
          tipo_analise: tipoAnalise,
          resultado: {},
          criticidade_geral: mockResultado.criticidade_geral,
          pontos_criticos: mockResultado.pontos_criticos as any,
          pontos_importantes: mockResultado.pontos_importantes as any,
          sugestoes: mockResultado.sugestoes as any,
          modelo_ia: selectedModel,
          usuario_id: '',
          usuario_nome: ''
        });

        setResultado(mockResultado);
        toast({
          title: 'Análise concluída',
          description: 'A análise do edital foi realizada com sucesso.'
        });
        onSuccess();
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao realizar a análise.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const criticidadeConfig = {
    critica: { label: 'Crítica', color: 'text-red-500', bg: 'bg-red-500/10' },
    alta: { label: 'Alta', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    media: { label: 'Média', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    baixa: { label: 'Baixa', color: 'text-green-500', bg: 'bg-green-500/10' }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Análise de Edital com IA
          </DialogTitle>
          <DialogDescription>
            Utilize inteligência artificial para analisar o edital e identificar possíveis problemas
          </DialogDescription>
        </DialogHeader>

        {!resultado ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Análise</Label>
              <Select value={tipoAnalise} onValueChange={(value: any) => setTipoAnalise(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completa">Análise Completa</SelectItem>
                  <SelectItem value="estrutural">Análise Estrutural</SelectItem>
                  <SelectItem value="juridica">Análise Jurídica</SelectItem>
                  <SelectItem value="tecnica">Análise Técnica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Modelo de IA Selecionado</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{selectedModel.toUpperCase()}</Badge>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleAnalise} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? 'Analisando...' : 'Iniciar Análise'}
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              <Card className={criticidadeConfig[resultado.criticidade_geral].bg}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className={`w-5 h-5 ${criticidadeConfig[resultado.criticidade_geral].color}`} />
                    Criticidade Geral: {criticidadeConfig[resultado.criticidade_geral].label}
                  </CardTitle>
                </CardHeader>
              </Card>

              {resultado.pontos_criticos.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    Pontos Críticos ({resultado.pontos_criticos.length})
                  </h3>
                  {resultado.pontos_criticos.map((ponto, idx) => (
                    <Card key={idx} className="border-red-500/30">
                      <CardHeader>
                        <CardTitle className="text-base">{ponto.titulo}</CardTitle>
                        <CardDescription>{ponto.descricao}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {ponto.referencia_legal && (
                          <p className="text-sm">
                            <span className="font-medium">Base Legal:</span> {ponto.referencia_legal}
                          </p>
                        )}
                        {ponto.impacto && (
                          <Badge variant="destructive">{ponto.impacto}</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {resultado.pontos_importantes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-500">
                    <AlertTriangle className="w-5 h-5" />
                    Pontos Importantes ({resultado.pontos_importantes.length})
                  </h3>
                  {resultado.pontos_importantes.map((ponto, idx) => (
                    <Card key={idx} className="border-orange-500/30">
                      <CardHeader>
                        <CardTitle className="text-base">{ponto.titulo}</CardTitle>
                        <CardDescription>{ponto.descricao}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {ponto.referencia_legal && (
                          <p className="text-sm">
                            <span className="font-medium">Base Legal:</span> {ponto.referencia_legal}
                          </p>
                        )}
                        {ponto.impacto && (
                          <Badge variant="outline" className="border-orange-500/50 text-orange-500">
                            {ponto.impacto}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {resultado.sugestoes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-500">
                    <Info className="w-5 h-5" />
                    Sugestões de Melhoria ({resultado.sugestoes.length})
                  </h3>
                  {resultado.sugestoes.map((ponto, idx) => (
                    <Card key={idx} className="border-blue-500/30">
                      <CardHeader>
                        <CardTitle className="text-base">{ponto.titulo}</CardTitle>
                        <CardDescription>{ponto.descricao}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {ponto.referencia_legal && (
                          <p className="text-sm">
                            <span className="font-medium">Base Legal:</span> {ponto.referencia_legal}
                          </p>
                        )}
                        {ponto.impacto && (
                          <Badge variant="outline" className="border-blue-500/50 text-blue-500">
                            {ponto.impacto}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={onClose}>Fechar</Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
