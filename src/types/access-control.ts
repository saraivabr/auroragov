export type UserRole = "super_admin" | "gestor" | "usuario";

export type OrganizationType =
  | "prefeitura"
  | "secretaria"
  | "autarquia"
  | "fundacao"
  | "empresa_publica"
  | "outro";

export interface Organization {
  id: string;
  nome: string;
  tipo: OrganizationType;
  cnpj: string | null;
  email_contato: string | null;
  telefone: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  nome: string | null;
  email: string | null;
  role: UserRole;
  organization_id: string | null;
  created_by: string | null;
  is_active: boolean;
  telefone: string | null;
  cargo: string | null;
  created_at: string;
  updated_at: string;
  organizations?: { id: string; nome: string } | null;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  nome?: string;
  cargo?: string;
  telefone?: string;
  role?: UserRole;
  organization_id?: string;
}

export interface CreateOrganizationPayload {
  nome: string;
  tipo?: OrganizationType;
  cnpj?: string;
  email_contato?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
}
