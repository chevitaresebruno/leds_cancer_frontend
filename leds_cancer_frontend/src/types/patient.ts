import type { ExamStatus } from './dashboard';

/** Status possíveis de um paciente. */
export type PatientStatus = 'ativo' | 'inativo';

/** Resumo de um exame aninhado dentro de um paciente. */
export interface PatientExam {
  id: string;
  /** Data do exame no formato `"dd/MM/yyyy"`. */
  date: string;
  /** Label da técnica (ex: `"Mamografia Digital"`). */
  type: string;
  status: ExamStatus;
  /** Nome do radiologista ou `"Aguardando atribuição"`. */
  radiologist: string;
}

/** Representa um paciente cadastrado no sistema. */
export interface Patient {
  id: string;
  name: string;
  /** Data de nascimento no formato `"dd/MM/yyyy"`. */
  birthDate: string;
  /** Idade calculada em anos completos. */
  age: number;
  /** CPF no formato `"000.000.000-00"`. */
  cpf: string;
  phone: string;
  email: string;
  status: PatientStatus;
  /** Data do exame mais recente no formato `"dd/MM/yyyy"`, ou `null`. */
  lastExam: string | null;
  /** Quantidade total de exames do paciente. */
  totalExams: number;
  /** Lista de exames. Populada apenas no endpoint de detalhe. */
  exams: PatientExam[];
}
