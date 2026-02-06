import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.6";
import { createCorsHeaders, getAllowedOriginsFromEnv, handleCorsPreflight } from "../_shared/cors.ts";
import { requireUser } from "../_shared/auth.ts";

interface ModelsQueryParams {
  provider?: string;
  tags?: string[];
  recommended?: boolean;
  available?: boolean;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = createCorsHeaders(req, { allowedOrigins: getAllowedOriginsFromEnv() });
  const preflight = handleCorsPreflight(req, corsHeaders);
  if (preflight) return preflight;

  try {
    // Require auth, then query through RLS using the user's JWT.
    await requireUser(req);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const url = new URL(req.url);
    const provider = url.searchParams.get("provider");
    const tagsParam = url.searchParams.get("tags");
    const recommended = url.searchParams.get("recommended");
    const available = url.searchParams.get("available");

    let query = supabase
      .from("ai_models")
      .select("*")
      .order("is_recommended", { ascending: false })
      .order("display_name", { ascending: true });

    if (provider) {
      query = query.eq("provider", provider);
    }

    if (recommended === "true") {
      query = query.eq("is_recommended", true);
    }

    if (available !== "false") {
      query = query.eq("is_available", true);
    }

    if (tagsParam) {
      const tags = tagsParam.split(",");
      query = query.contains("tags", tags);
    }

    const { data: models, error } = await query;

    if (error) {
      console.error("Error fetching models:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch models", details: error.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const groupedByProvider = models?.reduce((acc: any, model: any) => {
      if (!acc[model.provider]) {
        acc[model.provider] = [];
      }
      acc[model.provider].push(model);
      return acc;
    }, {});

    const response = {
      models: models || [],
      total: models?.length || 0,
      grouped_by_provider: groupedByProvider || {},
      recommended: models?.filter((m: any) => m.is_recommended) || [],
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    const status = typeof error?.status === "number" ? error.status : 500;
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
        details: error.toString(),
      }),
      {
        status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
