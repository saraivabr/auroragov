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

