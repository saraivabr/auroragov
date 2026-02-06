export interface DiagnosticoGeral {
  risco_impugnacao: "Baixo" | "Médio" | "Alto";
  risco_nulidade: "Baixo" | "Médio" | "Alto";
  resumo_executivo: string;
  principais_problemas: string[];
}

export interface PontoCritico {
  item: string;
  problema: string;
  base_legal: string;
  risco_juridico: "Baixo" | "Médio" | "Alto";
  sugestao_ajuste: string;
}

export interface PontoDefensavel {
  item: string;
  clausula: string;
  base_legal: string;
  jurisprudencia: string;
  argumento_tecnico: string;
}

export interface ChecklistItem {
  item: string;
  status: "conforme" | "atencao" | "nao_conforme";
  observacao: string;
  base_legal?: string;
}

export interface ScoreSection {
  secao: string;
  risco: "Baixo" | "Médio" | "Alto";
  pontuacao: number;
  justificativa: string;
}

export interface ScoreImpugnacao {
  sections: ScoreSection[];
  score_total: number;
  risco_geral: string;
}

export interface AuditoriaEdital {
  diagnostico_geral: DiagnosticoGeral;
  pontos_criticos: PontoCritico[];
  pontos_defensaveis: PontoDefensavel[];
  checklist: ChecklistItem[];
  score_impugnacao: ScoreImpugnacao;
}
