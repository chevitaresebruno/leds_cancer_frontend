// ─── Datas ────────────────────────────────────────────────────────────────────

/**
 * Converte data no formato brasileiro para ISO 8601.
 *
 * @param br - Data no formato `"dd/MM/yyyy"`.
 * @returns Data no formato `"yyyy-MM-dd"` (usado em `input[type=date]`).
 *
 * @example
 * brDateToIso('15/06/2026') // → '2026-06-15'
 */
export function brDateToIso(br: string): string {
  if (!br) return '';
  const [d, m, y] = br.split('/');
  return `${y}-${m}-${d}`;
}

/**
 * Converte data ISO 8601 para formato brasileiro.
 *
 * @param iso - Data no formato `"yyyy-MM-dd"`.
 * @returns Data no formato `"dd/MM/yyyy"` (exibição e API).
 *
 * @example
 * isoDateToBr('2026-06-15') // → '15/06/2026'
 */
export function isoDateToBr(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Formata data brasileira para exibição amigável por extenso.
 *
 * @param br - Data no formato `"dd/MM/yyyy"`.
 * @returns String por extenso. Retorna `"—"` para entrada vazia.
 *
 * @example
 * formatDateLong('15/06/2026') // → '15 de junho de 2026'
 */
export function formatDateLong(br: string): string {
  if (!br) return '—';
  const [d, m, y] = br.split('/').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

/**
 * Converte string de data brasileira (com ou sem horário) para objeto `Date`.
 *
 * @param str - Data no formato `"dd/MM/yyyy"` ou `"dd/MM/yyyy HH:mm"`.
 * @returns Objeto `Date` correspondente.
 *
 * @example
 * parseBrDate('15/06/2026 14:30') // → Date(2026, 5, 15, 14, 30)
 */
export function parseBrDate(str: string): Date {
  const [datePart, timePart] = str.split(' ');
  const [d, m, y] = datePart.split('/').map(Number);
  if (timePart) {
    const [h, min] = timePart.split(':').map(Number);
    return new Date(y, m - 1, d, h, min);
  }
  return new Date(y, m - 1, d);
}

// ─── CPF ──────────────────────────────────────────────────────────────────────

/**
 * Aplica máscara de CPF durante a digitação.
 *
 * @param value - String com dígitos ou CPF parcialmente formatado.
 * @returns CPF formatado no padrão `"000.000.000-00"`.
 *
 * @example
 * formatCpf('12345678900') // → '123.456.789-00'
 */
export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Remove a máscara de CPF, retornando somente os dígitos.
 *
 * @param value - CPF formatado ou parcial.
 * @returns String com apenas os dígitos numéricos.
 *
 * @example
 * unformatCpf('123.456.789-00') // → '12345678900'
 */
export function unformatCpf(value: string): string {
  return value.replace(/\D/g, '');
}

// ─── Telefone ─────────────────────────────────────────────────────────────────

/**
 * Aplica máscara de telefone durante a digitação.
 * Suporta celular (11 dígitos) e fixo (10 dígitos).
 *
 * @param value - String com dígitos ou telefone parcialmente formatado.
 * @returns Telefone formatado: `"(11) 98765-4321"` ou `"(11) 3456-7890"`.
 *
 * @example
 * formatPhone('11987654321') // → '(11) 98765-4321'
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
