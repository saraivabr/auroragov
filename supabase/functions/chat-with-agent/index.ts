import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.6";
import { createCorsHeaders, getAllowedOriginsFromEnv, handleCorsPreflight } from "../_shared/cors.ts";
import { requireUser } from "../_shared/auth.ts";

interface ChatRequest {
  conversationId: string;
  message: string;
  agentId?: string;
  modelId?: string;
  stream?: boolean;
}

// Free models fallback order
const FREE_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "deepseek/deepseek-r1:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen-2.5-72b-instruct:free",
];

async function callOpenRouter(
  apiKey: string,
  modelId: string,
  messages: Array<{ role: string; content: string }>,
  siteUrl: string,
  siteName: string,
  maxTokens: number,
  temperature: number,
): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": siteUrl,
        "X-Title": siteName,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        max_tokens: maxTokens,
        temperature,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Model ${modelId} failed:`, errorData);
      return { ok: false, error: `${response.status}: ${JSON.stringify(errorData)}` };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Model ${modelId} error:`, err);
    return { ok: false, error: err.message };
  }
}

Deno.serve(async (req: Request) => {
  const corsHeaders = createCorsHeaders(req, { allowedOrigins: getAllowedOriginsFromEnv() });
  const preflight = handleCorsPreflight(req, corsHeaders);
  if (preflight) return preflight;

  try {
    const user = await requireUser(req);
    const { conversationId, message, agentId, modelId, stream = false }: ChatRequest = await req.json();

    if (!conversationId || !message) {
      return new Response(
        JSON.stringify({ error: "conversationId e message são obrigatórios" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (stream) {
      return new Response(
        JSON.stringify({ error: "stream=true ainda não é suportado neste endpoint" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const openrouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    const siteUrl = Deno.env.get("OPENROUTER_SITE_URL") || "https://auroragov.com.br";
    const siteName = Deno.env.get("OPENROUTER_SITE_NAME") || "AuroraGov";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!openrouterApiKey) {
      throw new Error("OPENROUTER_API_KEY não configurada");
    }

    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization") || "";
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const supabaseAdmin = supabaseServiceRoleKey
      ? createClient(supabaseUrl, supabaseServiceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;

    // Ensure conversation belongs to this user
    const { data: conversation, error: convError } = await supabaseUser
      .from("conversations")
      .select("id, user_id")
      .eq("id", conversationId)
      .maybeSingle();

    if (convError) {
      throw new Error(`Erro ao validar conversa: ${convError.message}`);
    }
    if (!conversation) {
      return new Response(JSON.stringify({ error: "Conversa não encontrada" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (conversation.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Acesso negado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let selectedModelId = modelId || FREE_MODELS[0];
    let agentData = null;

    if (agentId) {
      const { data: agent } = await supabaseUser
        .from("agents")
        .select("*")
        .eq("id", agentId)
        .maybeSingle();

      agentData = agent;

      if (!modelId) {
        const { data: preference } = await supabaseUser
          .from("user_model_preferences")
          .select("preferred_model_id")
          .eq("user_id", user.id)
          .eq("agent_id", agentId)
          .maybeSingle();

        selectedModelId = preference?.preferred_model_id || agent?.default_model_id || FREE_MODELS[0];
      }
    }

    // Save user message
    const { error: userMessageError } = await supabaseUser
      .from("messages")
      .insert({
        conversation_id: conversationId,
        agent_id: agentId,
        role: "user",
        content: message,
        user_id: user.id,
      })
      .select()
      .single();

    if (userMessageError) {
      console.error("Error saving user message:", userMessageError);
    }

    // Build conversation history
    const { data: previousMessages } = await supabaseUser
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    const allowedRoles = new Set(["system", "user", "assistant"]);
    const conversationHistory = (previousMessages || [])
      .map((msg: any) => ({
        role: String(msg?.role || ""),
        content: String(msg?.content || ""),
      }))
      .filter((m: any) => allowedRoles.has(m.role) && m.content.trim().length > 0);

    const last = conversationHistory[conversationHistory.length - 1];
    if (!last || last.role !== "user" || last.content !== message) {
      conversationHistory.push({ role: "user", content: message });
    }

    if (agentData?.system_prompt) {
      conversationHistory.unshift({
        role: "system",
        content: agentData.system_prompt,
      });
    }

    const startTime = Date.now();
    const maxTokens = agentData?.max_tokens || 2000;
    const temperature = agentData?.temperature || 0.7;

    // Try the selected model first, then fallback through free models
    const modelsToTry = [selectedModelId, ...FREE_MODELS.filter(m => m !== selectedModelId)];
    let responseData = null;
    let actualModelUsed = selectedModelId;

    for (const tryModelId of modelsToTry) {
      const result = await callOpenRouter(
        openrouterApiKey,
        tryModelId,
        conversationHistory,
        siteUrl,
        siteName,
        maxTokens,
        temperature,
      );

      if (result.ok && result.data) {
        responseData = result.data;
        actualModelUsed = tryModelId;
        break;
      }

      console.warn(`Fallback: model ${tryModelId} failed, trying next...`);
    }

    if (!responseData) {
      throw new Error("Todos os modelos falharam. Tente novamente mais tarde.");
    }

    const processingTime = Date.now() - startTime;

    const assistantResponse = responseData.choices[0].message.content;
    const tokensInput = responseData.usage?.prompt_tokens || 0;
    const tokensOutput = responseData.usage?.completion_tokens || 0;
    const totalCost = 0; // Free models

    // Save assistant message
    const { data: assistantMessage, error: assistantMessageError } = await supabaseUser
      .from("messages")
      .insert({
        conversation_id: conversationId,
        agent_id: agentId,
        role: "assistant",
        content: assistantResponse,
        model_used: actualModelUsed,
        model_provider: actualModelUsed.split("/")[0],
        tokens_input: tokensInput,
        tokens_output: tokensOutput,
        cost_usd: totalCost,
        processing_time_ms: processingTime,
        user_id: user.id,
      })
      .select()
      .single();

    if (assistantMessageError) {
      console.error("Error saving assistant message:", assistantMessageError);
    }

    // Update usage stats
    const today = new Date().toISOString().split('T')[0];

    if (supabaseAdmin) {
      const { data: existingStats } = await supabaseAdmin
        .from("usage_stats")
        .select("*")
        .eq("user_id", user.id)
        .eq("model_id", actualModelUsed)
        .eq("date", today)
        .maybeSingle();

      if (existingStats) {
        await supabaseAdmin
          .from("usage_stats")
          .update({
            total_messages: existingStats.total_messages + 1,
            total_tokens_input: existingStats.total_tokens_input + tokensInput,
            total_tokens_output: existingStats.total_tokens_output + tokensOutput,
            total_cost_usd: existingStats.total_cost_usd + totalCost,
          })
          .eq("id", existingStats.id);
      } else {
        await supabaseAdmin
          .from("usage_stats")
          .insert({
            user_id: user.id,
            agent_id: agentId,
            model_id: actualModelUsed,
            date: today,
            total_messages: 1,
            total_tokens_input: tokensInput,
            total_tokens_output: tokensOutput,
            total_cost_usd: totalCost,
          });
      }
    }

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        response: assistantResponse,
        model_used: actualModelUsed,
        model_provider: actualModelUsed.split("/")[0],
        tokens_input: tokensInput,
        tokens_output: tokensOutput,
        total_tokens: tokensInput + tokensOutput,
        cost_usd: totalCost,
        processing_time_ms: processingTime,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    const status = typeof error?.status === "number" ? error.status : 500;
    return new Response(
      JSON.stringify({
        error: error.message || "Erro ao processar chat",
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
