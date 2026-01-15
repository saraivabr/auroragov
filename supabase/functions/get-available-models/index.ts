import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ModelsQueryParams {
  provider?: string;
  tags?: string[];
  recommended?: boolean;
  available?: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
