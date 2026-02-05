import { Info, AlertTriangle, CheckCircle2, FileText, Scale, ClipboardCheck, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EditalReviewHelperProps {
  onUseTemplate: () => void;
}

export function EditalReviewHelper({ onUseTemplate }: EditalReviewHelperProps) {
  return (
    <Card className="glass-effect border-govbr-blue-light/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-govbr-yellow/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-govbr-yellow" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-white">Assistente de Revisão de Edital</CardTitle>
            <CardDescription>
              Ferramenta especializada para análise completa de editais de licitação
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-govbr-blue/10 border-govbr-blue-light/30">
          <Info className="w-4 h-4 text-govbr-yellow" />
          <AlertDescription className="text-gray-300">
            Esta ferramenta analisa editais considerando as principais legislações vigentes e identifica
            potenciais problemas jurídicos, técnicos e administrativos.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-govbr-yellow" />
            O que será analisado:
          </h4>
          
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-4">
              {/* Análise Estrutural */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-white">Análise Estrutural</span>
                </div>
                <ul className="text-xs text-gray-400 space-y-1.5 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Conformidade com Lei 8.666/93 e Lei 14.133/21</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Verificação de elementos obrigatórios do edital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Adequação da modalidade ao objeto e valor</span>
                  </li>
                </ul>
              </div>

              <Separator className="bg-govbr-yellow/20" />

              {/* Análise Jurídica */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Análise Jurídica</span>
                </div>
                <ul className="text-xs text-gray-400 space-y-1.5 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Identificação de cláusulas restritivas ou discriminatórias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Análise de segurança jurídica e proporcionalidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Verificação de penalidades e sanções previstas</span>
                  </li>
                </ul>
              </div>

              <Separator className="bg-govbr-yellow/20" />

              {/* Análise Técnica */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Análise Técnica</span>
                </div>
                <ul className="text-xs text-gray-400 space-y-1.5 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Clareza e objetividade dos requisitos técnicos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Adequação dos prazos de execução e pagamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Viabilidade das especificações e critérios</span>
                  </li>
                </ul>
              </div>

              <Separator className="bg-govbr-yellow/20" />

              {/* Pontos de Atenção */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Pontos de Atenção Especiais</span>
                </div>
                <ul className="text-xs text-gray-400 space-y-1.5 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Tratamento diferenciado para ME/EPP</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Requisitos de sustentabilidade ambiental</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-govbr-yellow mt-0.5">•</span>
                    <span>Critérios de aceitabilidade e desempate</span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </div>

        <Separator className="bg-govbr-yellow/20" />

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white">Resultado da Análise</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
              <Badge variant="outline" className="text-xs border-red-500/50 text-red-400 mb-1">
                CRÍTICAS
              </Badge>
              <p className="text-xs text-gray-400">Podem invalidar</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
              <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-400 mb-1">
                IMPORTANTES
              </Badge>
              <p className="text-xs text-gray-400">Devem corrigir</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
              <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400 mb-1">
                SUGESTÕES
              </Badge>
              <p className="text-xs text-gray-400">Melhorias</p>
            </div>
          </div>
        </div>

        <button
          onClick={onUseTemplate}
          className="w-full mt-4 py-2.5 px-4 rounded-lg bg-govbr-blue hover:bg-govbr-blue-vivid text-white font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Usar Template de Revisão
        </button>
      </CardContent>
    </Card>
  );
}
