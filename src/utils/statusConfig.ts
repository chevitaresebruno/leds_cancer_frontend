import type { ExamStatus } from '@/types/dashboard';
import type { PatientStatus } from '@/types/patient';

/**
 * Mapeamento de status de exame para label e cor do componente `Chip` do MUI.
 *
 * Centraliza a configuração visual de status para evitar duplicação
 * em múltiplos componentes que exibem badges de status.
 *
 * @example
 * ```tsx
 * const { label, color } = EXAM_STATUS_CONFIG[exam.status];
 * <Chip label={label} color={color} />
 * ```
 */
export const EXAM_STATUS_CONFIG: Record<
  ExamStatus,
  { label: string; color: 'default' | 'primary' | 'warning' | 'success' | 'error' }
> = {
  pendente: { label: 'Pendente', color: 'warning' },
  em_analise: { label: 'Em Análise', color: 'primary' },
  concluido: { label: 'Concluído', color: 'success' },
  cancelado: { label: 'Cancelado', color: 'error' },
  "não enviado": { label: 'Não Enviado', color: 'error' },
};

/**
 * Mapeamento de status de paciente para label e cor do componente `Chip` do MUI.
 *
 * @example
 * ```tsx
 * const { label, color } = PATIENT_STATUS_CONFIG[patient.status];
 * <Chip label={label} color={color} size="small" />
 * ```
 */
export const PATIENT_STATUS_CONFIG: Record<
  PatientStatus,
  { label: string; color: 'success' | 'default' }
> = {
  ativo: { label: 'Ativo', color: 'success' },
  inativo: { label: 'Inativo', color: 'default' },
};

/**
 * Mapeamento de role (papel do usuário) para label em português.
 *
 * Usado em componentes de perfil e listagem de usuários.
 *
 * @example
 * ```tsx
 * ROLE_LABEL[user.role] // → 'Médico(a)'
 * ```
 */
export const ROLE_LABEL: Record<string, string> = {
  medico: 'Médico(a)',
  tecnico: 'Técnico(a)',
  administrador: 'Administrador(a)',
};
