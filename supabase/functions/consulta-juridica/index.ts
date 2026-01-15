import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ConsultaRequest {
  pergunta: string;
  userId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { pergunta, userId }: ConsultaRequest = await req.json();

    if (!pergunta || !userId) {
      return new Response(
        JSON.stringify({ error: "Pergunta e userId são obrigatórios" }),
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

    const systemPrompt = `Você é um assistente jurídico especializado em direito administrativo brasileiro, com foco em legislação aplicada ao setor público.

Suas responsabilidades:
- Responder perguntas sobre legislação brasileira (Leis, Decretos, Portarias, Instruções Normativas)
- Fornecer orientações práticas para servidores públicos
- Citar sempre as normas específicas e artigos quando disponível
- Indicar jurisprudência relevante quando aplicável
- Usar linguagem técnica mas acessível

Formato da resposta:
1. Resposta direta e objetiva
2. Base legal (Lei/Decreto/Portaria + número + artigo)
3. Interpretação prática
4. Jurisprudência relevante (se houver)

IMPORTANTE: Sempre informe que esta é uma orientação geral e que para casos específicos deve-se consultar o departamento jurídico do órgão.`;

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
          { role: "user", content: pergunta }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro OpenAI:", errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const resposta = data.choices[0].message.content;

    const normasRelacionadas = [
      { tipo: 'Lei', numero: '8.666/1993', artigo: '3º', ementa: 'Princípios da licitação' },
      { tipo: 'Lei', numero: '14.133/2021', artigo: '11', ementa: 'Nova Lei de Licitações' }
    ];

    return new Response(
      JSON.stringify({
        resposta,
        normas_relacionadas: normasRelacionadas,
        confiabilidade: 'alta',
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
    return new Response(
      JSON.stringify({
        error: error.message || "Erro ao processar consulta",
        details: error.toString()
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
