import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.6";
import {
  createCorsHeaders,
  getAllowedOriginsFromEnv,
  handleCorsPreflight,
} from "../_shared/cors.ts";
import { requireUserWithProfile } from "../_shared/auth.ts";
import type { AuthenticatedUserWithProfile } from "../_shared/auth.ts";

type Action =
  | "list_users"
  | "create_user"
  | "update_user"
  | "toggle_user_status"
  | "list_organizations"
  | "create_organization"
  | "update_organization";

function jsonResponse(
  body: unknown,
  status: number,
  corsHeaders: Record<string, string>,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ---- Action handlers ----

async function listUsers(
  caller: AuthenticatedUserWithProfile,
  _data: Record<string, unknown>,
) {
  if (caller.role !== "super_admin" && caller.role !== "gestor") {
    throw { status: 403, message: "Sem permissão para listar usuários" };
  }

  const admin = getAdminClient();
  let query = admin
    .from("user_profiles")
    .select("*, organizations(id, nome)")
    .order("created_at", { ascending: false });

  if (caller.role === "gestor") {
    query = query.or(`created_by.eq.${caller.id},id.eq.${caller.id}`);
  }

  const { data, error } = await query;
  if (error) throw { status: 500, message: error.message };
  return data;
}

async function createUser(
  caller: AuthenticatedUserWithProfile,
  data: Record<string, unknown>,
) {
  if (caller.role !== "super_admin" && caller.role !== "gestor") {
    throw { status: 403, message: "Sem permissão para criar usuários" };
  }

  const { email, password, nome, cargo, telefone } = data as {
    email: string;
    password: string;
    nome?: string;
    cargo?: string;
    telefone?: string;
  };

  if (!email || !password) {
    throw { status: 400, message: "Email e senha são obrigatórios" };
  }

  // Gestor: role forcado 'usuario', org herdada
  let role = (data.role as string) || "usuario";
  let organization_id = data.organization_id as string | null;

  if (caller.role === "gestor") {
    role = "usuario";
    organization_id = caller.organization_id;
  }

  if (caller.role === "super_admin" && !["super_admin", "gestor", "usuario"].includes(role)) {
    throw { status: 400, message: "Role inválido" };
  }

  const admin = getAdminClient();

  // Create auth user
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    throw { status: 400, message: authError.message };
  }

  // Create user profile
  const { error: profileError } = await admin.from("user_profiles").insert({
    id: authData.user.id,
    email,
    nome: nome || null,
    role,
    organization_id: organization_id || null,
    created_by: caller.id,
    cargo: cargo || null,
    telefone: telefone || null,
  });

  if (profileError) {
    // Rollback: delete auth user
    await admin.auth.admin.deleteUser(authData.user.id);
    throw { status: 500, message: profileError.message };
  }

  // Return the created profile
  const { data: profile } = await admin
    .from("user_profiles")
    .select("*, organizations(id, nome)")
    .eq("id", authData.user.id)
    .single();

  return profile;
}

async function updateUser(
  caller: AuthenticatedUserWithProfile,
  data: Record<string, unknown>,
) {
  const { user_id, nome, cargo, telefone, role, organization_id } = data as {
    user_id: string;
    nome?: string;
    cargo?: string;
    telefone?: string;
    role?: string;
    organization_id?: string;
  };

  if (!user_id) {
    throw { status: 400, message: "user_id é obrigatório" };
  }

  const admin = getAdminClient();

  // Check permissions
  const { data: target, error: fetchError } = await admin
    .from("user_profiles")
    .select("id, created_by, role")
    .eq("id", user_id)
    .single();

  if (fetchError || !target) {
    throw { status: 404, message: "Usuário não encontrado" };
  }

  if (caller.role === "gestor") {
    if (target.created_by !== caller.id && target.id !== caller.id) {
      throw { status: 403, message: "Sem permissão para editar este usuário" };
    }
  } else if (caller.role !== "super_admin") {
    throw { status: 403, message: "Sem permissão para editar usuários" };
  }

  const updates: Record<string, unknown> = {};
  if (nome !== undefined) updates.nome = nome;
  if (cargo !== undefined) updates.cargo = cargo;
  if (telefone !== undefined) updates.telefone = telefone;

  // Somente super_admin pode alterar role e organization
  if (caller.role === "super_admin") {
    if (role !== undefined) updates.role = role;
    if (organization_id !== undefined) updates.organization_id = organization_id;
  }

  if (Object.keys(updates).length === 0) {
    throw { status: 400, message: "Nenhum campo para atualizar" };
  }

  const { error: updateError } = await admin
    .from("user_profiles")
    .update(updates)
    .eq("id", user_id);

  if (updateError) {
    throw { status: 500, message: updateError.message };
  }

  const { data: updated } = await admin
    .from("user_profiles")
    .select("*, organizations(id, nome)")
    .eq("id", user_id)
    .single();

  return updated;
}

async function toggleUserStatus(
  caller: AuthenticatedUserWithProfile,
  data: Record<string, unknown>,
) {
  const { user_id } = data as { user_id: string };

  if (!user_id) {
    throw { status: 400, message: "user_id é obrigatório" };
  }

  const admin = getAdminClient();

  const { data: target, error: fetchError } = await admin
    .from("user_profiles")
    .select("id, created_by, is_active")
    .eq("id", user_id)
    .single();

  if (fetchError || !target) {
    throw { status: 404, message: "Usuário não encontrado" };
  }

  if (caller.role === "gestor") {
    if (target.created_by !== caller.id) {
      throw { status: 403, message: "Sem permissão para alterar status deste usuário" };
    }
  } else if (caller.role !== "super_admin") {
    throw { status: 403, message: "Sem permissão" };
  }

  const { error: updateError } = await admin
    .from("user_profiles")
    .update({ is_active: !target.is_active })
    .eq("id", user_id);

  if (updateError) {
    throw { status: 500, message: updateError.message };
  }

  return { id: user_id, is_active: !target.is_active };
}

async function listOrganizations(
  caller: AuthenticatedUserWithProfile,
  _data: Record<string, unknown>,
) {
  if (caller.role !== "super_admin") {
    throw { status: 403, message: "Somente super_admin pode listar organizações" };
  }

  const admin = getAdminClient();
  const { data, error } = await admin
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw { status: 500, message: error.message };
  return data;
}

async function createOrganization(
  caller: AuthenticatedUserWithProfile,
  data: Record<string, unknown>,
) {
  if (caller.role !== "super_admin") {
    throw { status: 403, message: "Somente super_admin pode criar organizações" };
  }

  const { nome, tipo, cnpj, email_contato, telefone, endereco, cidade, estado } = data as {
    nome: string;
    tipo?: string;
    cnpj?: string;
    email_contato?: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
  };

  if (!nome) {
    throw { status: 400, message: "Nome é obrigatório" };
  }

  const admin = getAdminClient();
  const { data: org, error } = await admin
    .from("organizations")
    .insert({
      nome,
      tipo: tipo || "prefeitura",
      cnpj: cnpj || null,
      email_contato: email_contato || null,
      telefone: telefone || null,
      endereco: endereco || null,
      cidade: cidade || null,
      estado: estado || null,
    })
    .select()
    .single();

  if (error) throw { status: 500, message: error.message };
  return org;
}

async function updateOrganization(
  caller: AuthenticatedUserWithProfile,
  data: Record<string, unknown>,
) {
  if (caller.role !== "super_admin") {
    throw { status: 403, message: "Somente super_admin pode editar organizações" };
  }

  const { organization_id, ...fields } = data as { organization_id: string; [key: string]: unknown };

  if (!organization_id) {
    throw { status: 400, message: "organization_id é obrigatório" };
  }

  const allowedFields = ["nome", "tipo", "cnpj", "email_contato", "telefone", "endereco", "cidade", "estado", "is_active"];
  const updates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      updates[key] = fields[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw { status: 400, message: "Nenhum campo para atualizar" };
  }

  const admin = getAdminClient();
  const { error } = await admin
    .from("organizations")
    .update(updates)
    .eq("id", organization_id);

  if (error) throw { status: 500, message: error.message };

  const { data: updated } = await admin
    .from("organizations")
    .select("*")
    .eq("id", organization_id)
    .single();

  return updated;
}

// ---- Router ----

const actionHandlers: Record<
  Action,
  (caller: AuthenticatedUserWithProfile, data: Record<string, unknown>) => Promise<unknown>
> = {
  list_users: listUsers,
  create_user: createUser,
  update_user: updateUser,
  toggle_user_status: toggleUserStatus,
  list_organizations: listOrganizations,
  create_organization: createOrganization,
  update_organization: updateOrganization,
};

Deno.serve(async (req: Request) => {
  const corsHeaders = createCorsHeaders(req, {
    allowedOrigins: getAllowedOriginsFromEnv(),
  });
  const preflight = handleCorsPreflight(req, corsHeaders);
  if (preflight) return preflight;

  try {
    const caller = await requireUserWithProfile(req);

    if (req.method !== "POST") {
      return jsonResponse({ error: "Método não permitido" }, 405, corsHeaders);
    }

    const body = await req.json();
    const { action, data } = body as { action: Action; data?: Record<string, unknown> };

    if (!action || !actionHandlers[action]) {
      return jsonResponse(
        { error: `Action inválida: ${action}` },
        400,
        corsHeaders,
      );
    }

    const result = await actionHandlers[action](caller, data || {});
    return jsonResponse(result, 200, corsHeaders);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error.status || 500;
    const message = error.message || "Erro interno";
    return jsonResponse({ error: message }, status, corsHeaders);
  }
});
