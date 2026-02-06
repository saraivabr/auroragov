import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createCorsHeaders, getAllowedOriginsFromEnv, handleCorsPreflight } from "../_shared/cors.ts";
import { requireUser } from "../_shared/auth.ts";

interface AnaliseRequest {
  tipoDocumento: string;
  titulo: string;
  conteudo: string;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = createCorsHeaders(req, { allowedOrigins: getAllowedOriginsFromEnv() });
  const preflight = handleCorsPreflight(req, corsHeaders);
  if (preflight) return preflight;

  try {
    await requireUser(req);

    const { tipoDocumento, titulo, conteudo }: AnaliseRequest = await req.json();

    if (!tipoDocumento || !titulo || !conteudo) {
      return new Response(
        JSON.stringify({ error: "tipoDocumento, titulo e conteudo são obrigatórios" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openrouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openrouterApiKey) {
      throw new Error("OPENROUTER_API_KEY não configurada");
    }
    const siteUrl = Deno.env.get("OPENROUTER_SITE_URL") || "https://gov.escreve.ai";
    const siteName = Deno.env.get("OPENROUTER_SITE_NAME") || "AuroraGov";

    const conteudoTruncado = conteudo.substring(0, 8000);

    const systemPrompt = `Você é um especialista em análise de documentos governamentais brasileiros, com expertise em:
- Editais de licitação
- Contratos administrativos
- Termos de referência
- Atas de registro de preços
- Pareceres jurídicos

Sua tarefa é analisar o documento fornecido e retornar um JSON estruturado com:
1. resumo: Resumo executivo do documento (máximo 300 palavras)
2. pontos_criticos: Array de objetos com {item, descricao, severidade} onde severidade pode ser "alta", "média" ou "baixa"
3. checklist: Array de objetos com {item, status, observacao} onde status pode ser "conforme", "atencao" ou "nao_conforme"
4. riscos_identificados: Array de objetos com {tipo, descricao, probabilidade, impacto} onde tipo pode ser "Operacional", "Jurídico", "Financeiro"

Analise considerando:
- Conformidade com legislação (Lei 14.133/2021, Lei 8.666/93 se aplicável)
- Clareza e objetividade
- Completude de informações obrigatórias
- Riscos potenciais
- Prazo de execução e viabilidade`;

    const userPrompt = `Tipo de documento: ${tipoDocumento}
Título: ${titulo}

Conteúdo:
${conteudoTruncado}

Forneça uma análise completa em formato JSON.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": siteName,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro OpenRouter:", errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const analiseText = data.choices[0].message.content;

    let analise;
    try {
      analise = JSON.parse(analiseText);
    } catch (e) {
      console.error("Erro ao parsear JSON:", analiseText);
      throw new Error("Resposta da IA não está no formato JSON esperado");
    }

    return new Response(
      JSON.stringify({
        resumo: analise.resumo || "Análise não disponível",
        pontos_criticos: analise.pontos_criticos || [],
        checklist: analise.checklist || [],
        riscos_identificados: analise.riscos_identificados || [],
        tokens_usados: data.usage.total_tokens
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erro:", error);
    const status = typeof error?.status === "number" ? error.status : 500;
    return new Response(
      JSON.stringify({
        error: error.message || "Erro ao analisar documento",
        details: error.toString()
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
