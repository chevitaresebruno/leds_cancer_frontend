import type { ExamStatus } from './dashboard';

/** Representa um exame no histórico de exames da aplicação. */
export interface HistoryExam {
  id: string;
  patientId: string;
  patientName: string;
  /** Data/hora no formato `"dd/MM/yyyy HH:MM"`. */
  datetime: string;
  /** Label da técnica (ex: `"Mamografia Digital"`). */
  examType: string;
  status: ExamStatus;
  /** Nome do radiologista ou `"Aguardando atribuição"`. */
  radiologist: string;
  /** Lado examinado (opcional — não retornado no endpoint de listagem resumida). */
  breastSide?: string;
  /** Nome do médico solicitante (opcional). */
  requestingPhysician?: string;
  /** Histórico clínico e observações (opcional). */
  clinicalHistory?: string;
}
