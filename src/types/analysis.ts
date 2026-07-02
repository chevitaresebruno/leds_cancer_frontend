/** Lado da mama examinada. */
export type BreastSide = 'esquerda' | 'direita' | 'bilateral';

/** Técnica de mamografia utilizada no exame. */
export type ExamTechnique = 'digital' | '3d_tomossintese' | 'contraste';

/**
 * Categoria BI-RADS do laudo de mamografia.
 *
 * - `0` — Avaliação adicional necessária
 * - `1` — Negativo
 * - `2` — Achado benigno
 * - `3` — Achado provavelmente benigno
 * - `4a/4b/4c` — Achado suspeito (baixa/intermediária/alta suspeição)
 * - `5` — Achado altamente sugestivo de malignidade
 * - `6` — Malignidade comprovada por biópsia
 */
export type BiradCategory = '0' | '1' | '2' | '3' | '4a' | '4b' | '4c' | '5' | '6';

/**
 * Estado do formulário de nova análise (stepper de 3 passos).
 *
 * - Step 0 — Selecionar Paciente
 * - Step 1 — Enviar Imagem
 * - Step 2 — Dados do Exame
 */
export interface NewAnalysisFormData {
  // ── Step 0 — Paciente ──────────────────────────────────────────────
  /** ID do paciente selecionado (string para compatibilidade com o Autocomplete). */
  patientId: string;

  // ── Step 1 — Imagem ────────────────────────────────────────────────
  /** Arquivo de imagem selecionado para upload. `null` antes do upload. */
  imageFile: File | null;
  /** URL de preview gerada via `URL.createObjectURL`. `null` antes do upload. */
  imagePreviewUrl: string | null;

  // ── Step 2 — Dados do exame ────────────────────────────────────────
  /** Data do exame no formato `"yyyy-MM-dd"` (compatível com `input[type=date]`). */
  examDate: string;
  /** Técnica utilizada. Vazio enquanto não selecionado. */
  technique: ExamTechnique | '';
  /** Lado examinado. Vazio enquanto não selecionado. */
  breastSide: BreastSide | '';
  /** Histórico clínico e observações livres (opcional). */
  clinicalHistory: string;
  /** Nome do médico solicitante (obrigatório). */
  requestingPhysician: string;
}

/** Índice do passo ativo no stepper de nova análise. */
export type NewAnalysisStep = 0 | 1 | 2;
