import { createClient } from "npm:@supabase/supabase-js@2.45.6";

export type AuthenticatedUser = {
  id: string;
  email?: string;
};

function getBearerToken(req: Request) {
  const auth = req.headers.get("Authorization") || req.headers.get("authorization");
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

export async function requireUser(req: Request): Promise<AuthenticatedUser> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in function environment");
  }

  const token = getBearerToken(req);
  if (!token) {
    const err = new Error("Missing Authorization bearer token");
    // @ts-ignore - attach status for caller
    err.status = 401;
    throw err;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    const err = new Error("Invalid or expired token");
    // @ts-ignore
    err.status = 401;
    throw err;
  }

  return { id: data.user.id, email: data.user.email ?? undefined };
}

export type AuthenticatedUserWithProfile = {
  id: string;
  email?: string;
  role: "super_admin" | "gestor" | "usuario";
  organization_id: string | null;
};

export async function requireUserWithProfile(
  req: Request,
): Promise<AuthenticatedUserWithProfile> {
  const user = await requireUser(req);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: profile, error } = await adminClient
    .from("user_profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Error fetching user profile: ${error.message}`);
  }

  if (!profile) {
    const err = new Error("User profile not found");
    // @ts-ignore
    err.status = 403;
    throw err;
  }

  if (!profile.role) {
    const err = new Error("User has no role assigned");
    // @ts-ignore
    err.status = 403;
    throw err;
  }

  return {
    id: user.id,
    email: user.email,
    role: profile.role,
    organization_id: profile.organization_id,
  };
}

