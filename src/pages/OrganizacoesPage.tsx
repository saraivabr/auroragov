import { useEffect, useState } from "react";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Pencil } from "lucide-react";
import type { Organization, OrganizationType, CreateOrganizationPayload } from "@/types/access-control";

const TIPO_LABELS: Record<OrganizationType, string> = {
  prefeitura: "Prefeitura",
  secretaria: "Secretaria",
  autarquia: "Autarquia",
  fundacao: "Fundação",
  empresa_publica: "Empresa Pública",
  outro: "Outro",
};

export function OrganizacoesPage() {
  const { organizations, loading, error, listOrganizations, createOrganization, updateOrganization } =
    useOrganizations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  // Form state
  const [formNome, setFormNome] = useState("");
  const [formTipo, setFormTipo] = useState<OrganizationType>("prefeitura");
  const [formCnpj, setFormCnpj] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formEndereco, setFormEndereco] = useState("");
  const [formCidade, setFormCidade] = useState("");
  const [formEstado, setFormEstado] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    listOrganizations();
  }, [listOrganizations]);

  const resetForm = () => {
    setFormNome("");
    setFormTipo("prefeitura");
    setFormCnpj("");
    setFormEmail("");
    setFormTelefone("");
    setFormEndereco("");
    setFormCidade("");
    setFormEstado("");
    setFormError(null);
    setEditingOrg(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (org: Organization) => {
    setEditingOrg(org);
    setFormNome(org.nome);
    setFormTipo(org.tipo);
    setFormCnpj(org.cnpj || "");
    setFormEmail(org.email_contato || "");
    setFormTelefone(org.telefone || "");
    setFormEndereco(org.endereco || "");
    setFormCidade(org.cidade || "");
    setFormEstado(org.estado || "");
    setFormError(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      if (editingOrg) {
        await updateOrganization(editingOrg.id, {
          nome: formNome,
          tipo: formTipo,
          cnpj: formCnpj || null,
          email_contato: formEmail || null,
          telefone: formTelefone || null,
          endereco: formEndereco || null,
          cidade: formCidade || null,
          estado: formEstado || null,
        });
      } else {
        const payload: CreateOrganizationPayload = {
          nome: formNome,
          tipo: formTipo,
          cnpj: formCnpj || undefined,
          email_contato: formEmail || undefined,
          telefone: formTelefone || undefined,
          endereco: formEndereco || undefined,
          cidade: formCidade || undefined,
          estado: formEstado || undefined,
        };
        await createOrganization(payload);
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSubmitting(false);
    }
  };

  const ESTADOS = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
    "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie prefeituras, secretarias e demais órgãos
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Building2 className="w-4 h-4 mr-2" />
          Nova Organização
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Cidade/Estado</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma organização encontrada
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.nome}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{TIPO_LABELS[org.tipo]}</Badge>
                  </TableCell>
                  <TableCell>{org.cnpj || "—"}</TableCell>
                  <TableCell>
                    {org.cidade && org.estado
                      ? `${org.cidade}/${org.estado}`
                      : org.cidade || org.estado || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={org.is_active ? "default" : "destructive"}>
                      {org.is_active ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(org)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingOrg ? "Editar Organização" : "Nova Organização"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="org-nome">Nome *</Label>
              <Input
                id="org-nome"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                placeholder="Nome da organização"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={formTipo} onValueChange={(v) => setFormTipo(v as OrganizationType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPO_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-cnpj">CNPJ</Label>
              <Input
                id="org-cnpj"
                value={formCnpj}
                onChange={(e) => setFormCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="org-email">Email de Contato</Label>
                <Input
                  id="org-email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="contato@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-telefone">Telefone</Label>
                <Input
                  id="org-telefone"
                  value={formTelefone}
                  onChange={(e) => setFormTelefone(e.target.value)}
                  placeholder="(11) 3333-4444"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-endereco">Endereço</Label>
              <Input
                id="org-endereco"
                value={formEndereco}
                onChange={(e) => setFormEndereco(e.target.value)}
                placeholder="Rua, número, bairro"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="org-cidade">Cidade</Label>
                <Input
                  id="org-cidade"
                  value={formCidade}
                  onChange={(e) => setFormCidade(e.target.value)}
                  placeholder="Cidade"
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={formEstado} onValueChange={setFormEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Salvando..." : editingOrg ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
