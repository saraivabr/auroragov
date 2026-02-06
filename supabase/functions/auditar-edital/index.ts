import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  createCorsHeaders,
  getAllowedOriginsFromEnv,
  handleCorsPreflight,
} from "../_shared/cors.ts";
import { requireUser } from "../_shared/auth.ts";

interface AuditRequest {
  tipoDocumento: "edital" | "termo_referencia" | "estudo_tecnico";
  titulo: string;
  conteudo: string;
  modalidade?: string;
}

const FREE_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-4-maverick:free",
  "deepseek/deepseek-chat-v3-0324:free",
];

const SYSTEM_PROMPT = `Você é um auditor jurídico especializado em licitações públicas brasileiras, com profundo conhecimento da Lei 14.133/2021 (Nova Lei de Licitações e Contratos Administrativos) e da jurisprudência do TCU, TCE e STJ.

## PRINCÍPIOS FUNDAMENTAIS
- **Competitividade** (Art. 5º): Toda restrição deve ser justificada e proporcional ao objeto.
- **Isonomia** (Art. 5º): Tratamento igualitário a todos os licitantes.
- **Razoabilidade e Proporcionalidade**: Exigências devem guardar relação com o objeto.
- **Formalismo Moderado**: Vícios sanáveis não devem eliminar propostas.

## ARTIGOS MAIS FREQUENTEMENTE VIOLADOS

### Definição do Objeto (Art. 18)
- Objeto deve ser definido de forma clara, precisa e suficiente.
- Vedada a indicação de marca, exceto quando tecnicamente justificada (Art. 41, I).
- Parcelamento é regra; não parcelar exige justificativa (Art. 40, §3º).

### Edital (Art. 25 e Art. 40)
- Deve conter regras claras e objetivas sobre julgamento.
- Critérios de habilitação limitados ao necessário (Art. 62).
- Prazo de divulgação mínimo conforme Art. 55.

### Amostras e Provas de Conceito (Art. 17, §3º e Art. 42)
- Só podem ser exigidas de licitante provisoriamente classificado em primeiro lugar.
- Critérios de avaliação devem ser objetivos e previstos no edital.
- Exigência na habilitação = RISCO ALTO de impugnação.

### Qualificação Técnica (Art. 67)
- Atestados devem referir-se a parcelas de maior relevância.
- Quantidade máxima de atestados: razoável (usualmente até 50% do objeto).
- Exigência de quantitativos excessivos = restrição à competitividade.
- Súmula TCU 263: exigência de quantitativos mínimos deve guardar proporção.

### Qualificação Econômico-Financeira (Art. 69)
- Capital social mínimo OU patrimônio líquido mínimo de até 10% do valor estimado.
- Vedada exigência de índices contábeis não previstos em lei.
- Certidão negativa de falência é obrigatória.

### Critérios de Julgamento (Art. 33 e Art. 34)
- Menor preço, maior desconto, melhor técnica, técnica e preço, maior lance, maior retorno econômico.
- Critérios subjetivos devem ter parâmetros objetivos de pontuação.

### Pagamento (Art. 141)
- Prazo máximo de 30 dias para pagamento.
- Retenção de pagamento só com justificativa legal.

### Sanções (Art. 155 a Art. 163)
- Penalidades devem ser proporcionais à gravidade da infração.
- Direito ao contraditório e ampla defesa.

## PADRÕES DE VIOLAÇÃO COMUNS

1. **Direcionamento de marca** sem justificativa técnica → Art. 41, I → ALTO
2. **Exigência de atestado com quantitativo irrazoável** → Art. 67 + Súmula TCU 263 → ALTO
3. **Qualificação técnica sem relação com o objeto** → Art. 67, §1º → ALTO
4. **Capital social acima de 10%** do valor estimado → Art. 69 → ALTO
5. **Prazo de divulgação insuficiente** → Art. 55 → MÉDIO
6. **Amostra na fase de habilitação** → Art. 17, §3º → ALTO
7. **Critérios subjetivos sem parâmetros objetivos** → Art. 33 → MÉDIO
8. **Vedação de consórcio sem justificativa** → Art. 15 → MÉDIO
9. **Exigência de visita técnica obrigatória** sem alternativa → Jurisprudência TCU → MÉDIO
10. **Não parcelamento sem justificativa** → Art. 40, §3º → ALTO
11. **Exigência de certidões além das legais** → Art. 68 → MÉDIO
12. **Prazo de pagamento superior a 30 dias** → Art. 141 → MÉDIO
13. **Cláusula de reequilíbrio ausente ou restritiva** → Art. 124 → ALTO
14. **Garantia de proposta acima do limite** → Art. 58 → MÉDIO
15. **Penalidades desproporcionais** → Art. 156 → MÉDIO

## REGRAS DE CLASSIFICAÇÃO DE RISCO
- **ALTO**: Restrição sem justificativa + jurisprudência contrária consolidada = provável impugnação com sucesso
- **MÉDIO**: Exigência incomum ou limite no permitido = possível impugnação, depende do contexto
- **BAIXO**: Prática aceitável com pequena ressalva = improvável impugnação

## FORMATO DE RESPOSTA OBRIGATÓRIO

Responda EXCLUSIVAMENTE em JSON válido com esta estrutura:

{
  "diagnostico_geral": {
    "risco_impugnacao": "Baixo" | "Médio" | "Alto",
    "risco_nulidade": "Baixo" | "Médio" | "Alto",
    "resumo_executivo": "string com 2-4 frases",
    "principais_problemas": ["problema 1", "problema 2"]
  },
  "pontos_criticos": [
    {
      "item": "Identificação do ponto",
      "problema": "Descrição do problema encontrado",
      "base_legal": "Artigo(s) violado(s)",
      "risco_juridico": "Baixo" | "Médio" | "Alto",
      "sugestao_ajuste": "Como corrigir"
    }
  ],
  "pontos_defensaveis": [
    {
      "item": "Identificação do ponto",
      "clausula": "Cláusula do documento",
      "base_legal": "Base legal que sustenta",
      "jurisprudencia": "Decisão TCU/TCE/STJ relevante",
      "argumento_tecnico": "Por que é defensável"
    }
  ],
  "checklist": [
    {
      "item": "Item verificado",
      "status": "conforme" | "atencao" | "nao_conforme",
      "observacao": "Detalhes",
      "base_legal": "Artigo aplicável"
    }
  ],
  "score_impugnacao": {
    "sections": [
      {
        "secao": "Nome da seção",
        "risco": "Baixo" | "Médio" | "Alto",
        "pontuacao": 0-100,
        "justificativa": "Motivo da pontuação"
      }
    ],
    "score_total": 0-100,
    "risco_geral": "Texto descritivo do risco geral"
  }
}

REGRAS:
- Sempre retorne JSON válido, sem texto adicional fora do JSON.
- Mínimo de 5 itens no checklist.
- Seja específico nas referências legais (artigo + parágrafo quando aplicável).
- Quando citar jurisprudência, use formato: "Acórdão XXXX/AAAA-TCU-Plenário" ou "Súmula TCU XXX".
- score_total: 0 = sem risco, 100 = altíssimo risco de impugnação.`;

function buildUserPrompt(req: AuditRequest): string {
  const modalidadeInfo = req.modalidade
    ? `\nModalidade de licitação: ${req.modalidade}`
    : "";
  return `Analise o seguinte documento de licitação:

Tipo: ${req.tipoDocumento}
Título: ${req.titulo}${modalidadeInfo}

--- INÍCIO DO DOCUMENTO ---
${req.conteudo}
--- FIM DO DOCUMENTO ---

Realize a auditoria completa conforme as instruções do sistema.`;
}

async function tryModel(
  model: string,
  messages: { role: string; content: string }[],
  apiKey: string,
  siteUrl: string,
  siteName: string,
): Promise<{ data: unknown; model: string } | null> {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": siteUrl,
          "X-Title": siteName,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 4000,
          temperature: 0.15,
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      console.error(`Model ${model} failed (${response.status}):`, err);
      return null;
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      console.error(`Model ${model}: empty response`);
      return null;
    }

    return { data, model };
  } catch (e) {
    console.error(`Model ${model} error:`, e);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  const corsHeaders = createCorsHeaders(req, {
    allowedOrigins: getAllowedOriginsFromEnv(),
  });
  const preflight = handleCorsPreflight(req, corsHeaders);
  if (preflight) return preflight;

  try {
    await requireUser(req);

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Método não permitido" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body: AuditRequest = await req.json();
    const { tipoDocumento, titulo, conteudo, modalidade } = body;

    if (!tipoDocumento || !titulo || !conteudo) {
      return new Response(
        JSON.stringify({
          error: "tipoDocumento, titulo e conteudo são obrigatórios",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const openrouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openrouterApiKey) {
      throw new Error("OPENROUTER_API_KEY não configurada");
    }
    const siteUrl =
      Deno.env.get("OPENROUTER_SITE_URL") || "https://gov.escreve.ai";
    const siteName = Deno.env.get("OPENROUTER_SITE_NAME") || "AuroraGov";

    const conteudoTruncado = conteudo.substring(0, 12000);

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: buildUserPrompt({
          tipoDocumento,
          titulo,
          conteudo: conteudoTruncado,
          modalidade,
        }),
      },
    ];

    // Try models with fallback
    let result: { data: unknown; model: string } | null = null;
    for (const model of FREE_MODELS) {
      result = await tryModel(
        model,
        messages,
        openrouterApiKey,
        siteUrl,
        siteName,
      );
      if (result) break;
    }

    if (!result) {
      throw new Error(
        "Todos os modelos falharam. Tente novamente em alguns minutos.",
      );
    }

    const { data, model: usedModel } = result;
    const content = (data as any).choices[0].message.content;
    const tokensUsados = (data as any).usage?.total_tokens;

    let auditoria;
    try {
      auditoria = JSON.parse(content);
    } catch (_e) {
      console.error("Erro ao parsear JSON da IA:", content);
      throw new Error("Resposta da IA não está no formato JSON esperado");
    }

    return new Response(
      JSON.stringify({
        diagnostico_geral: auditoria.diagnostico_geral || {},
        pontos_criticos: auditoria.pontos_criticos || [],
        pontos_defensaveis: auditoria.pontos_defensaveis || [],
        checklist: auditoria.checklist || [],
        score_impugnacao: auditoria.score_impugnacao || {},
        modelo_utilizado: usedModel,
        tokens_usados: tokensUsados,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Erro auditar-edital:", error);
    const status =
      typeof (error as any)?.status === "number"
        ? (error as any).status
        : 500;
    return new Response(
      JSON.stringify({
        error:
          (error as Error).message || "Erro ao auditar documento",
        details: String(error),
      }),
      {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
