type CorsOptions = {
  allowedOrigins: string[]; // exact match
};

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/$/, "");
}

export function getAllowedOriginsFromEnv(): string[] {
  const raw = Deno.env.get("ALLOWED_ORIGINS") || "";
  const parsed = raw
    .split(",")
    .map((o) => normalizeOrigin(o))
    .filter(Boolean);

  // Safe local dev fallback (explicit production should set ALLOWED_ORIGINS).
  if (parsed.length === 0) {
    return ["http://localhost:5173", "http://127.0.0.1:5173"];
  }

  return parsed;
}

export function createCorsHeaders(req: Request, opts: CorsOptions) {
  const origin = req.headers.get("Origin");
  const allowedSet = new Set(opts.allowedOrigins.map(normalizeOrigin));

  // Non-browser requests (no Origin header): allow.
  const allowOrigin =
    !origin ? "*" : allowedSet.has(normalizeOrigin(origin)) ? origin : null;

  // If Origin is present but not allowed, we intentionally omit ACAO.
  const base: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Client-Info, Apikey, apikey",
    // Reasonable preflight cache.
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };

  if (allowOrigin) {
    base["Access-Control-Allow-Origin"] = allowOrigin;
  }

  return base;
}

export function handleCorsPreflight(req: Request, corsHeaders: Record<string, string>) {
  if (req.method !== "OPTIONS") return null;

  // If browser Origin is present but not allowed, omit ACAO and return 204 anyway.
  return new Response(null, { status: 204, headers: corsHeaders });
}
