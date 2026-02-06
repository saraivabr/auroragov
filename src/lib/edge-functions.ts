import { supabase } from "@/lib/supabase";

type EdgeFunctionName =
  | "consulta-juridica"
  | "analise-documentos"
  | "gerador-documentos"
  | "chat-with-agent"
  | "get-available-models";

export async function callEdgeFunction<TResponse>(
  name: EdgeFunctionName,
  init: (Omit<RequestInit, "headers"> & {
    headers?: Record<string, string>;
    path?: string; // e.g. "?a=b" or "/subpath?..."
  }) = {},
): Promise<TResponse> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${supabaseUrl}/functions/v1/${name}${init.path || ""}`, {
    ...init,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const msg =
      typeof payload === "string"
        ? payload
        : payload?.error || payload?.message || `Edge function error (${res.status})`;
    throw new Error(msg);
  }

  return payload as TResponse;
}
