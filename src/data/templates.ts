import { PromptTemplate } from '@/types/ai-models';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'oficio',
    title: 'Redigir Ofício',
    category: 'Comunicação',
    description: 'Criar um ofício oficial seguindo padrões governamentais',
    prompt: 'Redija um ofício oficial com o seguinte conteúdo:\n\nDestinatário: [Nome e cargo]\nAssunto: [Assunto do ofício]\nConteúdo: [Descreva o conteúdo principal]\n\nSiga as normas da ABNT e padrões de comunicação oficial do governo brasileiro.'
  },
  {
    id: 'contrato',
    title: 'Analisar Contrato',
    category: 'Jurídico',
    description: 'Análise detalhada de contratos e termos legais',
    prompt: 'Analise o seguinte contrato e identifique:\n\n1. Cláusulas principais\n2. Possíveis riscos ou inconsistências\n3. Conformidade com legislação brasileira\n4. Recomendações de ajustes\n\n[Cole o texto do contrato aqui]'
  },
  {
    id: 'legislacao',
    title: 'Resumir Legislação',
    category: 'Jurídico',
    description: 'Resumo e análise de leis e normas',
    prompt: 'Faça um resumo executivo da seguinte legislação:\n\n[Cole o texto da lei ou norma]\n\nInclua:\n- Objetivo principal\n- Pontos-chave\n- Impactos práticos\n- Prazos e obrigações'
  },
  {
    id: 'relatorio',
    title: 'Gerar Relatório',
    category: 'Financeiro',
    description: 'Criar relatórios financeiros e orçamentários',
    prompt: 'Gere um relatório financeiro com base nos seguintes dados:\n\n[Insira dados financeiros]\n\nInclua:\n- Análise de receitas e despesas\n- Comparativo com período anterior\n- Indicadores principais\n- Recomendações'
  },
  {
    id: 'ata',
    title: 'Redigir Ata de Reunião',
    category: 'Comunicação',
    description: 'Criar ata formal de reunião',
    prompt: 'Redija uma ata de reunião com as seguintes informações:\n\nData: [Data]\nParticipantes: [Lista de participantes]\nPauta: [Tópicos discutidos]\nDecisões: [Decisões tomadas]\nEncaminhamentos: [Ações e responsáveis]'
  },
  {
    id: 'parecer',
    title: 'Elaborar Parecer Técnico',
    category: 'Jurídico',
    description: 'Criar parecer técnico fundamentado',
    prompt: 'Elabore um parecer técnico sobre:\n\nAssunto: [Tema do parecer]\nContexto: [Contexto e histórico]\nQuestão: [Questão a ser analisada]\n\nFundamente com legislação aplicável e jurisprudência relevante.'
  },
  {
    id: 'edital',
    title: 'Revisar Edital',
    category: 'Jurídico',
    description: 'Revisão completa e detalhada de editais de licitação',
    prompt: `Realize uma revisão minuciosa e profissional do seguinte edital de licitação:

[Cole o texto do edital aqui]

📋 **ANÁLISE ESTRUTURAL:**
1. Conformidade normativa:
   - Lei 8.666/93 (Lei de Licitações)
   - Lei 14.133/21 (Nova Lei de Licitações)
   - Lei Complementar 123/06 (Estatuto da ME/EPP)
   - Decretos e normas complementares

2. Elementos obrigatórios:
   - Objeto claramente definido
   - Previsão orçamentária
   - Condições de habilitação
   - Critérios de julgamento
   - Prazos de execução
   - Garantias contratuais

⚖️ **ANÁLISE JURÍDICA:**
- Identificar cláusulas que podem gerar insegurança jurídica
- Verificar requisitos restritivos ou discriminatórios
- Analisar proporcionalidade das exigências
- Avaliar penalidades e sanções previstas
- Verificar hipóteses de inexigibilidade/dispensa

📊 **ANÁLISE TÉCNICA:**
- Clareza e objetividade dos requisitos técnicos
- Adequação dos prazos de execução
- Viabilidade das especificações
- Critérios de aceitabilidade de preços
- Condições de pagamento

✅ **CHECKLIST DE CONFORMIDADE:**
- Modalidade adequada ao objeto e valor
- Tratamento diferenciado ME/EPP
- Sustentabilidade ambiental
- Margem de preferência (quando aplicável)
- Possibilidade de subcontratação
- Critérios de desempate

🔍 **RECOMENDAÇÕES:**
Apresente sugestões de melhorias e correções necessárias, classificadas por prioridade:
- **CRÍTICAS**: Podem invalidar o edital
- **IMPORTANTES**: Devem ser corrigidas para evitar questionamentos
- **SUGESTÕES**: Melhorias de redação e clareza

Forneça a análise de forma estruturada, profissional e fundamentada.`
  },
  {
    id: 'comunicado',
    title: 'Criar Comunicado Interno',
    category: 'Comunicação',
    description: 'Redigir comunicado para servidores',
    prompt: 'Crie um comunicado interno sobre:\n\nAssunto: [Tema do comunicado]\nPúblico-alvo: [Destinatários]\nInformações principais: [Conteúdo]\nPrazo/Data: [Se aplicável]\n\nUse linguagem clara e objetiva.'
  }
];
