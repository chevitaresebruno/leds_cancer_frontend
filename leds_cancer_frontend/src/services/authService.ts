import { api } from './api';

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Representa um médico ou técnico retornado pelo endpoint de autocomplete. */
export interface Physician {
  /** ID do usuário no banco. */
  id: number;
  /** Nome completo (`first_name + last_name` ou `username` como fallback). */
  full_name: string;
  /** CRM ou identificação profissional. `null` quando não informado. */
  crm: string | null;
  /** Papel do usuário: `"medico"` ou `"tecnico"`. */
  role: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Service de autenticação e dados de usuário.
 *
 * Responsável pelas chamadas à API relacionadas a autenticação e
 * usuários que não estão no fluxo de login (ex: listagem de médicos).
 */
export const authService = {
  /**
   * Busca todos os médicos e técnicos ativos para o autocomplete.
   *
   * Chama `GET /api/auth/users/` que retorna usuários com `role` igual
   * a `medico` ou `tecnico` e `is_active=True`.
   *
   * @returns Lista de {@link Physician}.
   */
  listPhysicians: async (): Promise<Physician[]> => {
    const { data } = await api.get<Physician[]>('/auth/users/');
    return data;
  },
};
