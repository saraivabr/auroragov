import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditais } from '@/hooks/useEditais';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, FileText, Calendar, Building2, DollarSign, AlertCircle, Filter, Eye } from 'lucide-react';
import { EditalFormModal } from '@/components/editais/EditalFormModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Edital } from '@/types/database';

const statusLabels: Record<Edital['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  em_analise: { label: 'Em Análise', variant: 'secondary' },
  aprovado: { label: 'Aprovado', variant: 'default' },
  rejeitado: { label: 'Rejeitado', variant: 'destructive' },
  enviado: { label: 'Enviado', variant: 'outline' },
  cancelado: { label: 'Cancelado', variant: 'destructive' }
};

export function EditaisPage() {
  const navigate = useNavigate();
  const { editais, loading, refresh } = useEditais();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [modalidadeFilter, setModalidadeFilter] = useState<string>('todos');
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredEditais = editais.filter(edital => {
    const matchesSearch =
      edital.numero_edital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edital.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edital.orgao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || edital.status === statusFilter;
    const matchesModalidade = modalidadeFilter === 'todos' || edital.modalidade === modalidadeFilter;

    return matchesSearch && matchesStatus && matchesModalidade;
  });

  const modalidades = Array.from(new Set(editais.map(e => e.modalidade)));

  const handleEditalClick = (id: string) => {
    navigate(`/editais/${id}`);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Editais</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e analise editais de licitação
          </p>
        </div>
        <Button onClick={() => setShowNewModal(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Novo Edital
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, objeto ou órgão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={modalidadeFilter} onValueChange={setModalidadeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Modalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Modalidades</SelectItem>
                {modalidades.map(mod => (
                  <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{filteredEditais.length} edital(is) encontrado(s)</span>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEditais.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum edital encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== 'todos' || modalidadeFilter !== 'todos'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro edital'}
            </p>
            {!searchTerm && statusFilter === 'todos' && modalidadeFilter === 'todos' && (
              <Button onClick={() => setShowNewModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Edital
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEditais.map(edital => (
            <Card
              key={edital.id}
              className="hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleEditalClick(edital.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={statusLabels[edital.status].variant}>
                    {statusLabels[edital.status].label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditalClick(edital.id);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{edital.numero_edital}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {edital.objeto}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{edital.orgao}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span>{edital.modalidade}</span>
                </div>
                {edital.valor_estimado && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(edital.valor_estimado)}
                    </span>
                  </div>
                )}
                {edital.data_abertura && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {format(new Date(edital.data_abertura), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
                {edital.tags && edital.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {edital.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {edital.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{edital.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EditalFormModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSuccess={() => {
          refresh();
          toast({
            title: 'Edital criado',
            description: 'O edital foi criado com sucesso.'
          });
        }}
      />
    </div>
  );
}
