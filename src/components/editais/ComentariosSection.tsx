import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Trash2, Calendar, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ComentarioEdital } from '@/types/database';
import { deleteComentarioEdital } from '@/lib/api/editais';
import { useToast } from '@/components/ui/use-toast';
import { useEditalDetails } from '@/hooks/useEditalDetails';

interface ComentariosSectionProps {
  editalId: string;
  comentarios: ComentarioEdital[];
  onRefresh: () => void;
}

const tipoComentarioConfig = {
  comentario: { label: 'Comentário', variant: 'default' as const },
  observacao: { label: 'Observação', variant: 'secondary' as const },
  alerta: { label: 'Alerta', variant: 'destructive' as const }
};

export function ComentariosSection({ editalId, comentarios, onRefresh }: ComentariosSectionProps) {
  const { toast } = useToast();
  const { addComentario } = useEditalDetails(editalId);
  const [novoComentario, setNovoComentario] = useState('');
  const [tipoComentario, setTipoComentario] = useState<'comentario' | 'observacao' | 'alerta'>('comentario');
  const [saving, setSaving] = useState(false);

  const handleAddComentario = async () => {
    if (!novoComentario.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite um comentário antes de enviar.',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      await addComentario({
        comentario: novoComentario,
        tipo: tipoComentario,
        usuario_id: '',
        usuario_nome: ''
      });
      setNovoComentario('');
      setTipoComentario('comentario');
      toast({
        title: 'Comentário adicionado',
        description: 'Seu comentário foi salvo com sucesso.'
      });
      onRefresh();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o comentário.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return;

    try {
      await deleteComentarioEdital(id);
      toast({
        title: 'Comentário excluído',
        description: 'O comentário foi removido com sucesso.'
      });
      onRefresh();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o comentário.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Adicionar Comentário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Digite seu comentário..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            rows={4}
          />
          <div className="flex items-center justify-between">
            <Select value={tipoComentario} onValueChange={(value: any) => setTipoComentario(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comentario">Comentário</SelectItem>
                <SelectItem value="observacao">Observação</SelectItem>
                <SelectItem value="alerta">Alerta</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddComentario} disabled={saving}>
              <Send className="w-4 h-4 mr-2" />
              {saving ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {comentarios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum comentário</h3>
            <p className="text-muted-foreground text-center">
              Seja o primeiro a comentar neste edital
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {comentarios.map((comentario) => (
            <Card key={comentario.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={tipoComentarioConfig[comentario.tipo].variant}>
                        {tipoComentarioConfig[comentario.tipo].label}
                      </Badge>
                      <span className="text-sm font-medium">{comentario.usuario_nome}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {format(new Date(comentario.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                          locale: ptBR
                        })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(comentario.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comentario.comentario}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
