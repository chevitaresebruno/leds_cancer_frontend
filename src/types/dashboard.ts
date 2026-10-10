/** Status possíveis de um exame de mamografia. */
export type ExamStatus = 'pendente' | 'em_analise' | 'concluido' | 'cancelado' | 'não enviado';

/** Dados de um card de estatística no dashboard. */
export interface StatCardData {
  id: string;
  title: string;
  /** Valor numérico ou textual exibido em destaque. */
  value: string | number;
  subtitle: string;
  /** Cor do card baseada na paleta do MUI. */
  color: 'primary' | 'secondary' | 'warning' | 'success' | 'error';
}

/** Resumo de um exame recente exibido no feed do dashboard. */
export interface RecentExam {
  id: string;
  patientName: string;
  /** Data/hora no formato `"dd/MM/yyyy HH:MM"`. */
  datetime: string;
  /** Label da técnica (ex: `"Mamografia Digital"`). */
  examType: string;
  status: ExamStatus;
}

/** Item de navegação do menu lateral. */
export interface NavItem {
  id: string;
  label: string;
  path: string;
}
