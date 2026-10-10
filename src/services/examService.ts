import { api } from './api';
import type { HistoryExam } from '@/types/history';
import type { RecentExam } from '@/types/dashboard';
import type { ExamStats } from '@/contexts/ExamContext';

// ─── Tipos da API (snake_case) ────────────────────────────────────────────────

/** Formato bruto de um exame retornado pelo backend. */
interface ApiExam {
  id: number;
  patient_id: number;
  patient_name: string;
  /** Data/hora no formato `dd/MM/yyyy HH:MM`. */
  datetime: string;
  exam_type: string;
  status: string;
  radiologist: string;
  breast_side?: string;
  requesting_physician?: string;
  clinical_history?: string;
}

/** Formato bruto de um exame recente (dashboard feed). */
interface ApiRecentExam {
  id: number;
  patient_name: string;
  datetime: string;
  exam_type: string;
  status: string;
}

/** Formato bruto das estatísticas do dashboard. */
interface ApiDashboardStats {
  today_patients: number;
  pending_exams: number;
  monthly_diagnostics: number;
  concluded_today: number;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

/**
 * Converte exame do formato da API para {@link HistoryExam}.
 *
 * @param e - Objeto no formato da API.
 */
function mapExam(e: ApiExam): HistoryExam {
  return {
    id: String(e.id),
    patientId: String(e.patient_id),
    patientName: e.patient_name,
    datetime: e.datetime,
    examType: e.exam_type,
    status: e.status as HistoryExam['status'],
    radiologist: e.radiologist,
    breastSide: e.breast_side,
    requestingPhysician: e.requesting_physician,
    clinicalHistory: e.clinical_history,
  };
}

/**
 * Converte exame recente do formato da API para {@link RecentExam}.
 *
 * @param e - Objeto no formato da API.
 */
function mapRecentExam(e: ApiRecentExam): RecentExam {
  return {
    id: String(e.id),
    patientName: e.patient_name,
    datetime: e.datetime,
    examType: e.exam_type,
    status: e.status as RecentExam['status'],
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** Service de exames — todas as chamadas a `/api/exams/` e `/api/dashboard/`. */
export const examService = {
  /**
   * Lista exames com filtros opcionais.
   *
   * @param params - Filtros opcionais: `search`, `status`, `patient`.
   * @returns Lista de {@link HistoryExam}.
   */
  list: async (params?: { search?: string; status?: string; patient?: string | number }) => {
    const { data } = await api.get<ApiExam[]>('/exams/', { params });
    return data.map(mapExam);
  },

  /**
   * Retorna os N exames mais recentes para o feed do dashboard.
   *
   * @param limit - Quantidade máxima de resultados. Padrão: 20.
   * @returns Lista de {@link RecentExam}.
   */
  recent: async (limit = 20) => {
    const { data } = await api.get<ApiRecentExam[]>('/exams/recent/', { params: { limit } });
    return data.map(mapRecentExam);
  },

  /**
   * Retorna o detalhe de um exame pelo ID.
   *
   * @param id - ID do exame.
   * @returns Objeto {@link HistoryExam}.
   */
  getById: async (id: string | number) => {
    const { data } = await api.get<ApiExam>(`/exams/${id}/`);
    return mapExam(data);
  },

  /**
   * Busca os contadores para os cards do dashboard.
   *
   * @returns Objeto {@link ExamStats} com os quatro contadores.
   */
  stats: async (): Promise<ExamStats> => {
    const { data } = await api.get<ApiDashboardStats>('/dashboard/stats/');
    return {
      todayPatients: data.today_patients,
      pendingExams: data.pending_exams,
      monthlyDiagnostics: data.monthly_diagnostics,
      concludedToday: data.concluded_today,
    };
  },

  /**
   * Cria um novo exame com upload de imagem.
   *
   * @param formData - FormData com todos os campos + `image_file`.
   * @returns Objeto {@link HistoryExam} criado.
   */
  create: async (formData: FormData) => {
    const { data } = await api.post<ApiExam>('/exams/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapExam(data);
  },

  /**
   * Atualiza o status de um exame.
   *
   * @param id - ID do exame.
   * @param status - Novo valor de status (ver `ExamStatus`).
   * @returns Objeto {@link HistoryExam} atualizado.
   */
  updateStatus: async (id: string | number, status: string) => {
    const { data } = await api.patch<ApiExam>(`/exams/${id}/`, { status });
    return mapExam(data);
  },

  /**
   * Remove um exame pelo ID.
   *
   * @param id - ID do exame.
   */
  remove: (id: string | number) => api.delete(`/exams/${id}/`),

  download: (id: string) => api.get(`/exams/${id}/download/`, { headers: { Accept: "application/pdf" } })
};
