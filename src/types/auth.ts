/** Papéis disponíveis para usuários do sistema. */
export type UserRole = 'medico' | 'tecnico' | 'administrador';

/** Representa um usuário autenticado no sistema. */
export interface User {
  /** ID do usuário (string para consistência no frontend). */
  id: string;
  /** Nome completo (`first_name + last_name` ou `username` como fallback). */
  fullName: string;
  /** E-mail único do usuário. */
  email: string;
  /** CRM ou identificação profissional. String vazia quando não informado. */
  crm: string;
  /** Papel do usuário no sistema. */
  role: UserRole;
}

/** Dados enviados no formulário de login. */
export interface LoginFormData {
  /** E-mail ou CRM do usuário. */
  identifier: string;
  password: string;
}

/** Dados enviados no formulário de cadastro. */
export interface RegisterFormData {
  fullName: string;
  email: string;
  /** CRM ou identificação profissional. */
  crm: string;
  /** Papel desejado. Vazio enquanto não selecionado. */
  role: UserRole | '';
  password: string;
  confirmPassword: string;
}

/**
 * Mapa de erros de formulário indexado por nome de campo.
 * Usado para exibir mensagens de erro inline nos inputs.
 */
export interface FormErrors {
  [K: string]: string | undefined;
}
