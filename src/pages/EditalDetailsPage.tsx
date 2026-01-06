import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditalDetails } from '@/hooks/useEditalDetails';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Edit,
  Trash2,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
  Download
} from 'lucide-react';
import { EditalFormModal } from '@/components/editais/EditalFormModal';
import { AnaliseEditalModal } from '@/components/editais/AnaliseEditalModal';
import { ComentariosSection } from '@/components/editais/ComentariosSection';
import { AnalisesSection } from '@/components/editais/AnalisesSection';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { deleteEdital } from '@/lib/api/editais';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  em_analise: { label: 'Em Análise', variant: 'secondary' },
  aprovado: { label: 'Aprovado', variant: 'default' },
  rejeitado: { label: 'Rejeitado', variant: 'destructive' },
  enviado: { label: 'Enviado', variant: 'outline' },
  cancelado: { label: 'Cancelado', variant: 'destructive' }
};

export function EditalDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { edital, analises, comentarios, loading, refresh } = useEditalDetails(id!);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnaliseModal, setShowAnaliseModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEdital(id!);
      toast({
        title: 'Edital excluído',
        description: 'O edital foi excluído com sucesso.'
      });
      navigate('/editais');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o edital.',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!edital) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Edital não encontrado</h3>
            <p className="text-muted-foreground mb-4">
              O edital que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate('/editais')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Editais
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/editais')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditModal(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={statusLabels[edital.status].variant}>
                  {statusLabels[edital.status].label}
                </Badge>
                {edital.tags?.map((tag, idx) => (
                  <Badge key={idx} variant="outline">{tag}</Badge>
                ))}
              </div>
              <CardTitle className="text-2xl">{edital.numero_edital}</CardTitle>
              <CardDescription className="text-base">{edital.objeto}</CardDescription>
            </div>
            <Button size="lg" onClick={() => setShowAnaliseModal(true)}>
              <Sparkles className="w-4 h-4 mr-2" />
              Analisar com IA
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Órgão</p>
                  <p className="text-sm text-muted-foreground">{edital.orgao}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Modalidade</p>
                  <p className="text-sm text-muted-foreground">{edital.modalidade}</p>
                </div>
              </div>

              {edital.valor_estimado && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Valor Estimado</p>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(edital.valor_estimado)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {edital.data_publicacao && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Data de Publicação</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(edital.data_publicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )}

              {edital.data_abertura && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Data/Hora de Abertura</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(edital.data_abertura), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR
                      })}
                    </p>
                  </div>
                </div>
              )}

              {edital.arquivo_url && (
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Arquivo do Edital</p>
                    <Button variant="link" className="h-auto p-0" asChild>
                      <a href={edital.arquivo_url} target="_blank" rel="noopener noreferrer">
                        Baixar PDF
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {edital.descricao && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-2">Descrição Detalhada</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{edital.descricao}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="analises" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analises" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Análises ({analises.length})
          </TabsTrigger>
          <TabsTrigger value="comentarios" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comentários ({comentarios.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analises">
          <AnalisesSection
            analises={analises}
            onRefresh={refresh}
            onNovaAnalise={() => setShowAnaliseModal(true)}
          />
        </TabsContent>

        <TabsContent value="comentarios">
          <ComentariosSection
            editalId={id!}
            comentarios={comentarios}
            onRefresh={refresh}
          />
        </TabsContent>
      </Tabs>

      <EditalFormModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          refresh();
          toast({
            title: 'Edital atualizado',
            description: 'As alterações foram salvas com sucesso.'
          });
        }}
        edital={edital}
      />

      <AnaliseEditalModal
        open={showAnaliseModal}
        onClose={() => setShowAnaliseModal(false)}
        editalId={id!}
        editalTexto={edital.objeto}
        onSuccess={() => {
          refresh();
          toast({
            title: 'Análise concluída',
            description: 'A análise do edital foi realizada com sucesso.'
          });
        }}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este edital? Esta ação não pode ser desfeita e todas as
              análises e comentários relacionados também serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
