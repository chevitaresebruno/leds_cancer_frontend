import { useState, useEffect } from 'react';
import { authService, type Physician } from '@/services/authService';

/** Retorno do hook {@link usePhysicians}. */
interface UsePhysiciansReturn {
  /** Lista de médicos e técnicos ativos. */
  physicians: Physician[];
  /** `true` enquanto a requisição estiver em andamento. */
  isLoading: boolean;
}

/**
 * Hook para buscar a lista de médicos/técnicos ativos da API.
 *
 * Carrega os dados uma única vez ao montar o componente.
 * Usado pelo {@link PhysicianAutocomplete} para popular as sugestões
 * do campo "Médico Solicitante" com dados reais do banco.
 *
 * Em caso de erro de rede, retorna lista vazia silenciosamente —
 * o campo continua funcionando em modo `freeSolo`.
 *
 * @returns {@link UsePhysiciansReturn}
 */
export function usePhysicians(): UsePhysiciansReturn {
  const [physicians, setPhysicians] = useState<Physician[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService
      .listPhysicians()
      .then(setPhysicians)
      .catch(() => setPhysicians([]))
      .finally(() => setIsLoading(false));
  }, []);

  return { physicians, isLoading };
}
