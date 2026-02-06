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

    // Use RLS with the authenticated user for most reads/writes.
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization") || "";
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Admin client only for server-maintained aggregates (usage_stats).
    const supabaseAdmin = supabaseServiceRoleKey
      ? createClient(supabaseUrl, supabaseServiceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;

    // Ensure conversation belongs to this user (prevents guessing UUIDs).
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

    let selectedModelId = modelId;
    let agentData = null;

    if (agentId) {
      const { data: agent } = await supabaseUser
        .from("agents")
        .select("*")
        .eq("id", agentId)
        .maybeSingle();

      agentData = agent;

      if (!selectedModelId) {
        const { data: preference } = await supabaseUser
          .from("user_model_preferences")
          .select("preferred_model_id")
          .eq("user_id", user.id)
          .eq("agent_id", agentId)
          .maybeSingle();

        selectedModelId = preference?.preferred_model_id || agent?.default_model_id || "openai/gpt-4o-mini";
      }
    } else {
      if (!selectedModelId) {
        selectedModelId = "openai/gpt-4o-mini";
      }
    }

    let { data: modelInfo } = await supabaseUser
      .from("ai_models")
      .select("*")
      .eq("model_id", selectedModelId)
      .maybeSingle();

    if (!modelInfo || !modelInfo.is_available) {
      selectedModelId = "openai/gpt-4o-mini";
      const { data: fallbackModel } = await supabaseUser
        .from("ai_models")
        .select("*")
        .eq("model_id", selectedModelId)
        .maybeSingle();

      modelInfo = fallbackModel ?? modelInfo;
    }

    const { data: userMessage, error: userMessageError } = await supabaseUser
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

    const { data: previousMessages } = await supabaseUser
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    const conversationHistory = previousMessages?.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    })) || [];

    if (agentData?.system_prompt) {
      conversationHistory.unshift({
        role: "system",
        content: agentData.system_prompt,
      });
    }

    const startTime = Date.now();

    const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterApiKey}`,
        "HTTP-Referer": siteUrl,
        "X-Title": siteName,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModelId,
        messages: conversationHistory,
        max_tokens: agentData?.max_tokens || 2000,
        temperature: agentData?.temperature || 0.7,
        stream: false,
      }),
    });

    if (!openrouterResponse.ok) {
      const errorData = await openrouterResponse.json();
      console.error("OpenRouter API error:", errorData);
      throw new Error(`OpenRouter API error: ${openrouterResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const responseData = await openrouterResponse.json();
    const processingTime = Date.now() - startTime;

    const assistantResponse = responseData.choices[0].message.content;
    const tokensInput = responseData.usage?.prompt_tokens || 0;
    const tokensOutput = responseData.usage?.completion_tokens || 0;

    const costInput = modelInfo?.pricing_input ? (tokensInput / 1_000_000) * modelInfo.pricing_input : 0;
    const costOutput = modelInfo?.pricing_output ? (tokensOutput / 1_000_000) * modelInfo.pricing_output : 0;
    const totalCost = costInput + costOutput;

    const { data: assistantMessage, error: assistantMessageError } = await supabaseUser
      .from("messages")
      .insert({
        conversation_id: conversationId,
        agent_id: agentId,
        role: "assistant",
        content: assistantResponse,
        model_used: selectedModelId,
        model_provider: modelInfo?.provider || "unknown",
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

    const today = new Date().toISOString().split('T')[0];

    if (supabaseAdmin) {
      const { data: existingStats } = await supabaseAdmin
        .from("usage_stats")
        .select("*")
        .eq("user_id", user.id)
        .eq("agent_id", agentId || null)
        .eq("model_id", selectedModelId)
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
            model_id: selectedModelId,
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
        model_used: selectedModelId,
        model_provider: modelInfo?.provider,
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
