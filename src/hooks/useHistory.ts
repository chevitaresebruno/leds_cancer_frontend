import { useState, useEffect, useCallback } from 'react';
import type { HistoryExam } from '@/types/history';
import { examService } from '@/services/examService';

/** Retorno do hook {@link useHistory}. */
interface UseHistoryReturn {
  /** Lista de exames carregada da API. */
  exams: HistoryExam[];
  /** `true` enquanto a requisição estiver em andamento. */
  isLoading: boolean;
  /** Mensagem de erro quando o carregamento falha, ou `null`. */
  error: string | null;
  /** Recarrega a lista de exames manualmente. */
  refresh: () => Promise<void>;
}

/**
 * Hook para buscar e manter o histórico de exames sincronizado com a API.
 *
 * Carrega todos os exames automaticamente ao montar o componente.
 * Expõe `refresh` para recargas manuais (ex: após atualizar um status).
 *
 * @returns {@link UseHistoryReturn}
 *
 * @example
 * ```tsx
 * const { exams, isLoading, error, refresh } = useHistory();
 * ```
 */
export function useHistory(): UseHistoryReturn {
  const [exams, setExams] = useState<HistoryExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await examService.list();
      setExams(data);
    } catch {
      setError('Não foi possível carregar o histórico de exames.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { exams, isLoading, error, refresh };
}
