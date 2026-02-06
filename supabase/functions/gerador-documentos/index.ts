import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createCorsHeaders, getAllowedOriginsFromEnv, handleCorsPreflight } from "../_shared/cors.ts";
import { requireUser } from "../_shared/auth.ts";

interface GeradorRequest {
  tipoDocumento: string;
  conteudo: string;
  contexto?: string;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = createCorsHeaders(req, { allowedOrigins: getAllowedOriginsFromEnv() });
  const preflight = handleCorsPreflight(req, corsHeaders);
  if (preflight) return preflight;

  try {
    await requireUser(req);

    const { tipoDocumento, conteudo, contexto }: GeradorRequest = await req.json();

    if (!tipoDocumento || !conteudo) {
      return new Response(
        JSON.stringify({ error: "tipoDocumento e conteudo são obrigatórios" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY não configurada");
    }

    const systemPrompt = `Você é um especialista em redação oficial do governo brasileiro, seguindo as normas do Manual de Redação da Presidência da República.

Sua função é melhorar e formalizar textos de documentos oficiais, mantendo:
- Linguagem formal e técnica
- Padrão culto da língua portuguesa
- Clareza e objetividade
- Impessoalidade
- Concisão
- Estrutura adequada ao tipo de documento

Tipos de documentos que você domina:
- Ofício
- Memorando
- Parecer
- Despacho
- Portaria
- Relatório
- Ata

Regras importantes:
1. Mantenha o conteúdo essencial fornecido
2. Corrija erros gramaticais e de concordância
3. Melhore a estruturação de parágrafos
4. Use terminologia técnica apropriada
5. Adicione formalidades necessárias ao tipo de documento
6. NÃO invente informações não fornecidas`;

    const userPrompt = `Tipo de documento: ${tipoDocumento}
${contexto ? `Contexto adicional: ${contexto}\n` : ''}
Texto fornecido pelo usuário:
${conteudo}

Por favor, melhore este texto seguindo as normas de redação oficial brasileira. Retorne apenas o texto melhorado, sem explicações adicionais.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro OpenAI:", errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const textoMelhorado = data.choices[0].message.content;

    return new Response(
      JSON.stringify({
        texto_melhorado: textoMelhorado,
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
        error: error.message || "Erro ao gerar documento",
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
