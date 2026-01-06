import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createEdital, updateEdital } from '@/lib/api/editais';
import type { Edital, EditalInsert } from '@/types/database';
import { Loader2 } from 'lucide-react';

interface EditalFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  edital?: Edital;
}

const modalidades = [
  'Pregão Eletrônico',
  'Pregão Presencial',
  'Concorrência',
  'Tomada de Preços',
  'Convite',
  'Concurso',
  'Leilão',
  'Dispensa',
  'Inexigibilidade'
];

export function EditalFormModal({ open, onClose, onSuccess, edital }: EditalFormModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<EditalInsert>>({
    numero_edital: edital?.numero_edital || '',
    orgao: edital?.orgao || '',
    objeto: edital?.objeto || '',
    modalidade: edital?.modalidade || '',
    valor_estimado: edital?.valor_estimado || null,
    data_publicacao: edital?.data_publicacao || null,
    data_abertura: edital?.data_abertura || null,
    status: edital?.status || 'em_analise',
    descricao: edital?.descricao || '',
    tags: edital?.tags || [],
    arquivo_url: edital?.arquivo_url || null,
    usuario_responsavel_id: edital?.usuario_responsavel_id || null,
    usuario_responsavel_nome: edital?.usuario_responsavel_nome || null,
    user_id: edital?.user_id || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.numero_edital || !formData.orgao || !formData.objeto || !formData.modalidade) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      if (edital) {
        await updateEdital(edital.id, formData);
        toast({
          title: 'Sucesso',
          description: 'Edital atualizado com sucesso.'
        });
      } else {
        await createEdital(formData as EditalInsert);
        toast({
          title: 'Sucesso',
          description: 'Edital criado com sucesso.'
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o edital.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData({ ...formData, tags });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{edital ? 'Editar Edital' : 'Novo Edital'}</DialogTitle>
          <DialogDescription>
            {edital ? 'Atualize as informações do edital' : 'Preencha as informações do novo edital'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_edital">
                Número do Edital <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numero_edital"
                value={formData.numero_edital}
                onChange={(e) => setFormData({ ...formData, numero_edital: e.target.value })}
                placeholder="Ex: 001/2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modalidade">
                Modalidade <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.modalidade}
                onValueChange={(value) => setFormData({ ...formData, modalidade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  {modalidades.map(mod => (
                    <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orgao">
              Órgão <span className="text-red-500">*</span>
            </Label>
            <Input
              id="orgao"
              value={formData.orgao}
              onChange={(e) => setFormData({ ...formData, orgao: e.target.value })}
              placeholder="Ex: Prefeitura Municipal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objeto">
              Objeto <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="objeto"
              value={formData.objeto}
              onChange={(e) => setFormData({ ...formData, objeto: e.target.value })}
              placeholder="Descrição do objeto da licitação"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição Detalhada</Label>
            <Textarea
              id="descricao"
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Informações adicionais sobre o edital"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_estimado">Valor Estimado (R$)</Label>
              <Input
                id="valor_estimado"
                type="number"
                step="0.01"
                value={formData.valor_estimado || ''}
                onChange={(e) => setFormData({ ...formData, valor_estimado: parseFloat(e.target.value) || null })}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_publicacao">Data de Publicação</Label>
              <Input
                id="data_publicacao"
                type="date"
                value={formData.data_publicacao || ''}
                onChange={(e) => setFormData({ ...formData, data_publicacao: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_abertura">Data/Hora de Abertura</Label>
              <Input
                id="data_abertura"
                type="datetime-local"
                value={formData.data_abertura?.slice(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, data_abertura: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="Ex: urgente, tecnologia, saúde"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {edital ? 'Atualizar' : 'Criar'} Edital
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
