# Guia de Integração OpenRouter

## Visão Geral

O sistema agora está integrado com **OpenRouter**, permitindo acesso a múltiplos modelos de IA de diferentes providers (Anthropic, OpenAI, Google, Meta, Mistral, Cohere, Qwen).

## Benefícios

- **15+ modelos disponíveis** de 7 providers diferentes
- **Flexibilidade**: Escolha o modelo ideal para cada tarefa
- **Economia**: Use modelos mais baratos quando apropriado
- **Qualidade**: Acesso aos melhores modelos do mercado
- **Backup**: Se um provider cai, use outro
- **Transparência**: Custo claro por mensagem
- **Controle**: Estatísticas detalhadas de uso e custos

## Configuração

### 1. Obter API Key do OpenRouter

1. Acesse [openrouter.ai](https://openrouter.ai)
2. Crie uma conta
3. Acesse "API Keys"
4. Gere uma nova chave
5. Copie a chave (formato: `sk-or-v1-...`)

### 2. Configurar Variáveis de Ambiente

No arquivo `.env`, substitua:

```env
OPENROUTER_API_KEY=seu-openrouter-api-key-aqui
```

Por:

```env
OPENROUTER_API_KEY=sk-or-v1-sua-chave-real-aqui
```

### 3. Verificar Instalação

Acesse a página de teste:
```
http://localhost:5173/openrouter-test
```

## Modelos Disponíveis

### Recomendados

| Modelo | Provider | Uso | Preço (Entrada/Saída) |
|--------|----------|-----|----------------------|
| **Claude 3.5 Sonnet** | Anthropic | Análise complexa, qualidade premium | $3/$15 por 1M tokens |
| **GPT-4o** | OpenAI | Multimodal, redação criativa | $2.5/$10 por 1M tokens |
| **GPT-4o Mini** | OpenAI | Custo-benefício excelente | $0.15/$0.60 por 1M tokens |
| **Gemini Pro 1.5** | Google | Contexto longo (2M tokens) | $1.25/$5 por 1M tokens |
| **Llama 3.1 70B** | Meta | Open source, privacidade | $0.35/$0.40 por 1M tokens |

### Econômicos

- **Claude 3 Haiku**: $0.25/$1.25 - Rápido e barato
- **Gemini Flash 1.5**: $0.075/$0.30 - Mais barato do mercado
- **Mixtral 8x7B**: $0.24/$0.24 - Europeu, eficiente

### Premium

- **O1 Preview**: $15/$60 - Raciocínio complexo
- **Claude 3 Opus**: $15/$75 - Análise profunda
- **Mistral Large**: $2/$6 - Francês, qualidade

### Especializado

- **Command R+**: $2.5/$10 - Otimizado para português
- **Qwen 2.5 72B**: $0.35/$0.40 - Multilingual

## Arquitetura

### Database (Supabase)

#### Tabela: `ai_models`
Armazena informações de todos os modelos disponíveis:
- Provider (anthropic, openai, google, etc.)
- Preços (input/output por 1M tokens)
- Contexto máximo
- Tags (recomendado, econômico, qualidade, português)
- Capabilities (JSON, streaming, vision)

#### Tabela: `user_model_preferences`
Preferências de modelo por usuário e agente:
- Qual modelo o usuário prefere para cada agente
- Permite personalização da experiência

#### Tabela: `usage_stats`
Estatísticas agregadas por dia:
- Mensagens enviadas
- Tokens consumidos (input/output)
- Custo total em USD
- Breakdown por modelo e agente

#### Tabela: `messages` (modificada)
Agora inclui:
- `model_used`: Qual modelo foi usado
- `model_provider`: Provider do modelo
- `tokens_input/output`: Tokens consumidos
- `cost_usd`: Custo da mensagem
- `processing_time_ms`: Tempo de processamento

### Edge Functions

#### `get-available-models`
Retorna lista de modelos disponíveis.

**Endpoint:**
```
GET /functions/v1/get-available-models
```

**Query Params:**
- `provider`: Filtrar por provider (opcional)
- `tags`: Filtrar por tags (opcional)
- `recommended`: Apenas recomendados (opcional)

**Resposta:**
```json
{
  "models": [...],
  "total": 15,
  "grouped_by_provider": {...},
  "recommended": [...]
}
```

#### `chat-with-agent`
Envia mensagem e recebe resposta de qualquer modelo.

**Endpoint:**
```
POST /functions/v1/chat-with-agent
```

**Body:**
```json
{
  "conversationId": "uuid",
  "message": "Sua pergunta",
  "userId": "user-uuid",
  "agentId": "agent-uuid (opcional)",
  "modelId": "openai/gpt-4o-mini (opcional)",
  "stream": false
}
```

**Resposta:**
```json
{
  "message": {...},
  "response": "Resposta da IA",
  "model_used": "openai/gpt-4o-mini",
  "model_provider": "openai",
  "tokens_input": 156,
  "tokens_output": 342,
  "total_tokens": 498,
  "cost_usd": 0.000234,
  "processing_time_ms": 1245
}
```

### Frontend Components

#### `ModelSelector`
Componente dropdown para escolha de modelo.

**Props:**
```typescript
{
  value?: string;
  onValueChange: (modelId: string) => void;
  agentId?: string;
  showPrice?: boolean;
  showDescription?: boolean;
  disabled?: boolean;
}
```

**Exemplo:**
```tsx
<ModelSelector
  value={selectedModel}
  onValueChange={setSelectedModel}
  showPrice={true}
  showDescription={true}
/>
```

### Hooks

#### `useModels()`
Busca modelos disponíveis.

```typescript
const { models, recommended, loading, groupedByProvider } = useModels({
  provider: 'anthropic', // opcional
  tags: ['economico'], // opcional
  recommended: true // opcional
});
```

#### `useModelPreferences(userId)`
Gerencia preferências de modelo do usuário.

```typescript
const { preferences, getPreferredModel, setPreferredModel } = useModelPreferences(user.id);

// Obter preferência para um agente
const preferredModel = getPreferredModel(agentId);

// Salvar preferência
await setPreferredModel(agentId, 'anthropic/claude-3.5-sonnet');
```

#### `useUsageStats(userId, period)`
Estatísticas de uso.

```typescript
const { stats, loading } = useUsageStats(user.id, 'month');

// stats.total_messages
// stats.total_cost_usd
// stats.by_model
// stats.by_agent
// stats.daily_breakdown
```

## Página de Teste

Acesse `/openrouter-test` para:
- Testar diferentes modelos
- Ver custos em tempo real
- Comparar respostas
- Visualizar estatísticas de uso

## Custos Estimados

### Exemplo de Uso Mensal (100 mensagens)

**Cenário Econômico** (GPT-4o Mini):
- 100 msgs × 500 tokens médios
- Custo: ~$0.04/mês

**Cenário Balanceado** (Mix de modelos):
- 50 msgs GPT-4o Mini + 30 Claude Haiku + 20 GPT-4o
- Custo: ~$0.50/mês

**Cenário Premium** (Claude 3.5 Sonnet):
- 100 msgs × 1000 tokens médios
- Custo: ~$1.80/mês

**Cenário Intensivo** (200+ msgs/dia):
- 6000 msgs/mês mix de modelos
- Custo: $15-30/mês

## Próximos Passos

1. **Criar Agentes**: Definir agentes especializados com modelos padrão
2. **Dashboard de Uso**: Página com gráficos de consumo
3. **Alertas de Custo**: Notificar quando atingir limites
4. **A/B Testing**: Comparar modelos lado a lado
5. **Cache**: Salvar respostas frequentes
6. **Fallback**: Trocar modelo automaticamente se falhar

## Troubleshooting

### Erro: "OPENROUTER_API_KEY não configurada"
- Verifique o arquivo `.env`
- Reinicie o servidor dev (`npm run dev`)

### Erro: "No models available"
- Verifique conexão com Supabase
- Execute: `SELECT * FROM ai_models;` no Supabase SQL Editor

### Custo muito alto
- Use modelos econômicos (GPT-4o Mini, Gemini Flash)
- Configure alertas de custo
- Revise histórico em `/openrouter-test`

## Suporte

Para dúvidas:
- Documentação OpenRouter: [openrouter.ai/docs](https://openrouter.ai/docs)
- Status dos modelos: [openrouter.ai/models](https://openrouter.ai/models)
- Discord OpenRouter: Link no site
