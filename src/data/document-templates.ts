export interface DocumentTemplate {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  template: string;
  campos: string[];
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'oficio-padrao',
    tipo: 'oficio',
    titulo: 'Ofício Padrão',
    descricao: 'Modelo padrão de ofício para comunicação externa',
    template: `OFÍCIO Nº [NUMERO]/[ANO]

Brasília, [DATA]

A Sua Senhoria o(a) Senhor(a)
[DESTINATARIO]
[CARGO]
[ORGAO]

Assunto: [ASSUNTO]

Senhor(a) [CARGO],

[CORPO]

Atenciosamente,

_______________________________
[NOME_REMETENTE]
[CARGO_REMETENTE]
[ORGAO_REMETENTE]`,
    campos: ['NUMERO', 'ANO', 'DATA', 'DESTINATARIO', 'CARGO', 'ORGAO', 'ASSUNTO', 'CORPO', 'NOME_REMETENTE', 'CARGO_REMETENTE', 'ORGAO_REMETENTE']
  },
  {
    id: 'memorando-interno',
    tipo: 'memorando',
    titulo: 'Memorando Interno',
    descricao: 'Comunicação interna entre setores do mesmo órgão',
    template: `MEMORANDO Nº [NUMERO]/[ANO] - [SIGLA_SETOR]

PARA: [DESTINATARIO] - [SETOR_DESTINO]
DE: [REMETENTE] - [SETOR_ORIGEM]
ASSUNTO: [ASSUNTO]

[CORPO]

Brasília, [DATA]

_______________________________
[NOME_REMETENTE]
[CARGO_REMETENTE]`,
    campos: ['NUMERO', 'ANO', 'SIGLA_SETOR', 'DESTINATARIO', 'SETOR_DESTINO', 'REMETENTE', 'SETOR_ORIGEM', 'ASSUNTO', 'CORPO', 'DATA', 'NOME_REMETENTE', 'CARGO_REMETENTE']
  },
  {
    id: 'parecer-tecnico',
    tipo: 'parecer',
    titulo: 'Parecer Técnico',
    descricao: 'Análise técnica fundamentada com conclusão',
    template: `PARECER TÉCNICO Nº [NUMERO]/[ANO]

REFERÊNCIA: [PROCESSO_OU_DOCUMENTO]

I - DO ASSUNTO

[ASSUNTO]

II - ANÁLISE

[ANALISE]

III - FUNDAMENTAÇÃO LEGAL

[FUNDAMENTACAO]

IV - CONCLUSÃO

[CONCLUSAO]

V - PROPOSTA DE ENCAMINHAMENTO

[PROPOSTA]

Brasília, [DATA]

_______________________________
[NOME]
[CARGO]
[MATRICULA]`,
    campos: ['NUMERO', 'ANO', 'PROCESSO_OU_DOCUMENTO', 'ASSUNTO', 'ANALISE', 'FUNDAMENTACAO', 'CONCLUSAO', 'PROPOSTA', 'DATA', 'NOME', 'CARGO', 'MATRICULA']
  },
  {
    id: 'despacho-administrativo',
    tipo: 'despacho',
    titulo: 'Despacho Administrativo',
    descricao: 'Decisão ou encaminhamento em processo administrativo',
    template: `DESPACHO Nº [NUMERO]/[ANO]

PROCESSO/DOCUMENTO: [PROCESSO]

[CONTEUDO]

Brasília, [DATA]

_______________________________
[NOME]
[CARGO]
De acordo.
_______________________________
[NOME_SUPERIOR]
[CARGO_SUPERIOR]`,
    campos: ['NUMERO', 'ANO', 'PROCESSO', 'CONTEUDO', 'DATA', 'NOME', 'CARGO', 'NOME_SUPERIOR', 'CARGO_SUPERIOR']
  },
  {
    id: 'portaria',
    tipo: 'portaria',
    titulo: 'Portaria',
    descricao: 'Ato normativo de autoridade administrativa',
    template: `PORTARIA Nº [NUMERO], DE [DATA_COMPLETA]

O [AUTORIDADE], no uso de suas atribuições legais e regimentais, e tendo em vista o disposto [FUNDAMENTACAO_LEGAL],

RESOLVE:

Art. 1º [ARTIGO_1]

Art. 2º [ARTIGO_2]

Art. 3º Esta Portaria entra em vigor na data de sua publicação.

[LOCAL], [DATA]

_______________________________
[NOME]
[CARGO]`,
    campos: ['NUMERO', 'DATA_COMPLETA', 'AUTORIDADE', 'FUNDAMENTACAO_LEGAL', 'ARTIGO_1', 'ARTIGO_2', 'LOCAL', 'DATA', 'NOME', 'CARGO']
  },
  {
    id: 'ata-reuniao',
    tipo: 'ata',
    titulo: 'Ata de Reunião',
    descricao: 'Registro formal de reunião administrativa',
    template: `ATA DA [NUMERO]ª REUNIÃO [TIPO_REUNIAO]

Data: [DATA]
Horário: [HORARIO_INICIO] às [HORARIO_FIM]
Local: [LOCAL]

PARTICIPANTES:
[LISTA_PARTICIPANTES]

PAUTA:
[PAUTA]

DESENVOLVIMENTO:
[DESENVOLVIMENTO]

DELIBERAÇÕES:
[DELIBERACOES]

ENCERRAMENTO:
Nada mais havendo a tratar, foi encerrada a reunião, da qual se lavrou a presente ata que, após lida e aprovada, será assinada por todos os presentes.

Brasília, [DATA]

ASSINATURAS:
_______________________________
[NOME_1] - [CARGO_1]

_______________________________
[NOME_2] - [CARGO_2]`,
    campos: ['NUMERO', 'TIPO_REUNIAO', 'DATA', 'HORARIO_INICIO', 'HORARIO_FIM', 'LOCAL', 'LISTA_PARTICIPANTES', 'PAUTA', 'DESENVOLVIMENTO', 'DELIBERACOES', 'NOME_1', 'CARGO_1', 'NOME_2', 'CARGO_2']
  },
  {
    id: 'relatorio-atividades',
    tipo: 'relatorio',
    titulo: 'Relatório de Atividades',
    descricao: 'Relatório periódico de atividades desenvolvidas',
    template: `RELATÓRIO DE ATIVIDADES
Período: [PERIODO]

1. INTRODUÇÃO
[INTRODUCAO]

2. ATIVIDADES DESENVOLVIDAS
[ATIVIDADES]

3. RESULTADOS ALCANÇADOS
[RESULTADOS]

4. DIFICULDADES ENCONTRADAS
[DIFICULDADES]

5. PROVIDÊNCIAS ADOTADAS
[PROVIDENCIAS]

6. CONCLUSÃO
[CONCLUSAO]

Brasília, [DATA]

_______________________________
[NOME]
[CARGO]`,
    campos: ['PERIODO', 'INTRODUCAO', 'ATIVIDADES', 'RESULTADOS', 'DIFICULDADES', 'PROVIDENCIAS', 'CONCLUSAO', 'DATA', 'NOME', 'CARGO']
  },
  {
    id: 'termo-referencia',
    tipo: 'termo',
    titulo: 'Termo de Referência',
    descricao: 'Documento técnico para contratações',
    template: `TERMO DE REFERÊNCIA

1. OBJETO
[OBJETO]

2. JUSTIFICATIVA
[JUSTIFICATIVA]

3. FUNDAMENTAÇÃO LEGAL
[FUNDAMENTACAO]

4. ESPECIFICAÇÕES TÉCNICAS
[ESPECIFICACOES]

5. QUANTITATIVOS E PRAZOS
[QUANTITATIVOS]

6. VALOR ESTIMADO
[VALOR]

7. CRITÉRIOS DE ACEITAÇÃO
[CRITERIOS]

8. OBRIGAÇÕES DA CONTRATADA
[OBRIGACOES_CONTRATADA]

9. OBRIGAÇÕES DA CONTRATANTE
[OBRIGACOES_CONTRATANTE]

10. FISCALIZAÇÃO
[FISCALIZACAO]

Brasília, [DATA]

_______________________________
[NOME]
[CARGO]`,
    campos: ['OBJETO', 'JUSTIFICATIVA', 'FUNDAMENTACAO', 'ESPECIFICACOES', 'QUANTITATIVOS', 'VALOR', 'CRITERIOS', 'OBRIGACOES_CONTRATADA', 'OBRIGACOES_CONTRATANTE', 'FISCALIZACAO', 'DATA', 'NOME', 'CARGO']
  }
];

export function getTemplateByType(tipo: string): DocumentTemplate | undefined {
  return documentTemplates.find(t => t.tipo === tipo);
}

export function getTemplateById(id: string): DocumentTemplate | undefined {
  return documentTemplates.find(t => t.id === id);
}

export function getAllTemplates(): DocumentTemplate[] {
  return documentTemplates;
}

export function getTemplatesByType(tipo: string): DocumentTemplate[] {
  return documentTemplates.filter(t => t.tipo === tipo);
}
