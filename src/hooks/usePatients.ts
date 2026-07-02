import { useState, useEffect, useCallback } from 'react';
import type { Patient } from '@/types/patient';
import { patientService } from '@/services/patientService';

/** Retorno do hook {@link usePatients}. */
interface UsePatientsReturn {
  /** Lista de pacientes carregada da API. */
  patients: Patient[];
  /** `true` enquanto a requisição estiver em andamento. */
  isLoading: boolean;
  /** Mensagem de erro quando o carregamento falha, ou `null`. */
  error: string | null;
  /** Recarrega a lista de pacientes manualmente. */
  refresh: () => Promise<void>;
}

/**
 * Hook para buscar e manter a lista de pacientes sincronizada com a API.
 *
 * Carrega os pacientes automaticamente ao montar o componente.
 * Expõe `refresh` para recargas manuais (ex: após criar um paciente).
 *
 * @returns {@link UsePatientsReturn}
 *
 * @example
 * ```tsx
 * const { patients, isLoading, error, refresh } = usePatients();
 * ```
 */
export function usePatients(): UsePatientsReturn {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientService.list();
      setPatients(data);
    } catch {
      setError('Não foi possível carregar os pacientes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { patients, isLoading, error, refresh };
}
