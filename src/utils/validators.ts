import { unformatCpf } from './formatters';

// ─── Primitivos ───────────────────────────────────────────────────────────────

/**
 * Valida se um campo obrigatório foi preenchido.
 *
 * @param value - Valor a validar.
 * @param label - Nome do campo para a mensagem de erro.
 * @returns Mensagem de erro ou `undefined` se válido.
 */
export function validateRequired(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label} é obrigatório.`;
}

/**
 * Valida formato de e-mail.
 *
 * @param value - E-mail a validar.
 * @returns Mensagem de erro ou `undefined` se válido.
 */
export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'E-mail é obrigatório.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'E-mail inválido.';
}

/**
 * Valida requisitos mínimos de senha (mínimo 8 caracteres).
 *
 * @param value - Senha a validar.
 * @returns Mensagem de erro ou `undefined` se válido.
 */
export function validatePassword(value: string): string | undefined {
  if (!value) return 'Senha é obrigatória.';
  if (value.length < 8) return 'A senha deve ter no mínimo 8 caracteres.';
}

/**
 * Valida se a confirmação de senha corresponde à senha original.
 *
 * @param password - Senha original.
 * @param confirm - Confirmação de senha.
 * @returns Mensagem de erro ou `undefined` se válido.
 */
export function validateConfirmPassword(password: string, confirm: string): string | undefined {
  if (!confirm) return 'Confirmação de senha é obrigatória.';
  if (password !== confirm) return 'As senhas não coincidem.';
}

// ─── CPF ──────────────────────────────────────────────────────────────────────

/**
 * Valida CPF com cálculo dos dígitos verificadores.
 *
 * Rejeita sequências de dígitos iguais (ex: `111.111.111-11`).
 *
 * @param value - CPF formatado ou apenas dígitos.
 * @returns Mensagem de erro ou `undefined` se válido.
 */
export function validateCpf(value: string): string | undefined {
  const digits = unformatCpf(value);
  if (!digits) return 'CPF é obrigatório.';
  if (digits.length !== 11) return 'CPF deve ter 11 dígitos.';
  if (/^(\d)\1+$/.test(digits)) return 'CPF inválido.';

  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(digits[i]) * (len + 1 - i);
    const rem = (sum * 10) % 11;
    return rem === 10 || rem === 11 ? 0 : rem;
  };
  if (calc(9) !== Number(digits[9]) || calc(10) !== Number(digits[10])) return 'CPF inválido.';
}

// ─── Telefone ─────────────────────────────────────────────────────────────────

/**
 * Valida formato de telefone brasileiro (10 ou 11 dígitos).
 * Campo opcional — retorna `undefined` para valor vazio.
 *
 * @param value - Telefone formatado ou apenas dígitos.
 * @returns Mensagem de erro ou `undefined` se válido ou vazio.
 */
export function validatePhone(value: string): string | undefined {
  if (!value) return;
  const digits = value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 11) return 'Telefone inválido.';
}
