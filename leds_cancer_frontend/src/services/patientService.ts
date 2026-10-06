import { api } from './api';
import type { Patient, PatientExam } from '@/types/patient';
import type { ExamStatus } from '@/types/dashboard';

// ─── Tipos da API (snake_case) ────────────────────────────────────────────────

/** Formato bruto retornado pelo backend para um paciente. */
interface ApiPatient {
  id: number;
  name: string;
  /** Data no formato `dd/MM/yyyy`. */
  birth_date: string;
  age: number;
  cpf: string;
  phone: string;
  email: string;
  status: string;
  last_exam: string | null;
  total_exams: number;
  exams?: ApiPatientExam[];
}

/** Formato bruto de um exame aninhado dentro de um paciente. */
interface ApiPatientExam {
  id: number | string;
  date: string;
  type: string;
  status: string;
  radiologist: string;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

/**
 * Converte o formato snake_case da API para o formato camelCase do frontend.
 * O `id` é normalizado para `string` para consistência com o restante da app.
 *
 * @param p - Objeto no formato da API.
 * @returns Objeto no formato {@link Patient}.
 */
function mapPatient(p: ApiPatient): Patient {
  return {
    id: String(p.id),
    name: p.name,
    birthDate: p.birth_date,
    age: p.age,
    cpf: p.cpf,
    phone: p.phone,
    email: p.email,
    status: p.status as Patient['status'],
    lastExam: p.last_exam,
    totalExams: p.total_exams,
    exams: (p.exams ?? []).map((e) => ({
      id: String(e.id),
      date: e.date,
      type: e.type,
      status: e.status as ExamStatus,
      radiologist: e.radiologist,
    } satisfies PatientExam)),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** Service de pacientes — todas as chamadas a `/api/patients/`. */
export const patientService = {
  /**
   * Lista todos os pacientes com busca opcional.
   *
   * @param search - Termo de busca por nome, CPF ou e-mail.
   * @returns Lista de {@link Patient}.
   */
  list: async (search?: string): Promise<Patient[]> => {
    const { data } = await api.get<ApiPatient[]>('/patients/', {
      params: search ? { search } : {},
    });
    return data.map(mapPatient);
  },

  /**
   * Retorna o detalhe de um paciente incluindo seus exames.
   *
   * @param id - ID do paciente.
   * @returns Objeto {@link Patient} com campo `exams` preenchido.
   */
  getById: async (id: string): Promise<Patient> => {
    const { data } = await api.get<ApiPatient>(`/patients/${id}/`);
    return mapPatient(data);
  },

  /**
   * Cria um novo paciente.
   *
   * @param data - Campos do paciente em snake_case.
   */
  create: (data: Record<string, unknown>) =>
    api.post<ApiPatient>('/patients/', data),

  /**
   * Atualiza parcialmente um paciente existente.
   *
   * @param id - ID do paciente.
   * @param data - Campos a atualizar em snake_case.
   */
  update: (id: string, data: Record<string, unknown>) =>
    api.patch<ApiPatient>(`/patients/${id}/`, data),

  /**
   * Remove um paciente pelo ID.
   *
   * @param id - ID do paciente.
   */
  remove: (id: string) =>
    api.delete(`/patients/${id}/`),
};
