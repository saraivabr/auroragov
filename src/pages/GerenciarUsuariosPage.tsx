import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useManageUsers } from "@/hooks/useManageUsers";
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
import { Switch } from "@/components/ui/switch";
import { UserPlus, Pencil } from "lucide-react";
import type { UserProfile, UserRole, CreateUserPayload } from "@/types/access-control";

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  gestor: "Gestor",
  usuario: "Usuário",
};

export function GerenciarUsuariosPage() {
  const { isSuperAdmin, profile } = useAuth();
  const { users, loading, error, listUsers, createUser, updateUser, toggleUserStatus } =
    useManageUsers();
  const { organizations, listOrganizations } = useOrganizations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form state
  const [formNome, setFormNome] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSenha, setFormSenha] = useState("");
  const [formCargo, setFormCargo] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("usuario");
  const [formOrgId, setFormOrgId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    listUsers();
    if (isSuperAdmin) {
      listOrganizations();
    }
  }, [listUsers, isSuperAdmin, listOrganizations]);

  const resetForm = () => {
    setFormNome("");
    setFormEmail("");
    setFormSenha("");
    setFormCargo("");
    setFormTelefone("");
    setFormRole("usuario");
    setFormOrgId("");
    setFormError(null);
    setEditingUser(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user);
    setFormNome(user.nome || "");
    setFormCargo(user.cargo || "");
    setFormTelefone(user.telefone || "");
    setFormRole(user.role);
    setFormOrgId(user.organization_id || "");
    setFormError(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      if (editingUser) {
        const updates: Record<string, unknown> = {
          nome: formNome || undefined,
          cargo: formCargo || undefined,
          telefone: formTelefone || undefined,
        };
        if (isSuperAdmin) {
          updates.role = formRole;
          updates.organization_id = formOrgId || undefined;
        }
        await updateUser(editingUser.id, updates);
      } else {
        const payload: CreateUserPayload = {
          email: formEmail,
          password: formSenha,
          nome: formNome || undefined,
          cargo: formCargo || undefined,
          telefone: formTelefone || undefined,
        };
        if (isSuperAdmin) {
          payload.role = formRole;
          payload.organization_id = formOrgId || undefined;
        }
        await createUser(payload);
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
    } catch {
      // error is set in the hook
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSuperAdmin
              ? "Gerencie todos os usuários do sistema"
              : "Gerencie os usuários criados por você"}
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Usuário
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
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Organização</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nome || "—"}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.cargo || "—"}</TableCell>
                  <TableCell>{u.organizations?.nome || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.role === "super_admin"
                          ? "default"
                          : u.role === "gestor"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.is_active ? "default" : "destructive"}>
                      {u.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(u)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {u.id !== profile?.id && (
                        <Switch
                          checked={u.is_active}
                          onCheckedChange={() => handleToggleStatus(u.id)}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            {!editingUser && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="usuario@exemplo.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formSenha}
                    onChange={(e) => setFormSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={formCargo}
                onChange={(e) => setFormCargo(e.target.value)}
                placeholder="Ex: Analista Jurídico"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formTelefone}
                onChange={(e) => setFormTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            {isSuperAdmin && (
              <>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formRole} onValueChange={(v) => setFormRole(v as UserRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usuario">Usuário</SelectItem>
                      <SelectItem value="gestor">Gestor</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Organização</Label>
                  <Select value={formOrgId} onValueChange={setFormOrgId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Salvando..." : editingUser ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
