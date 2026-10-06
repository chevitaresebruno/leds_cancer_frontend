import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, LoginFormData, RegisterFormData } from '@/types/auth';
import { api } from '@/services/api';

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Interface do contexto de autenticação exposto pelo {@link AuthProvider}. */
interface AuthContextType {
  /** Usuário autenticado, ou `null` quando não há sessão ativa. */
  user: User | null;
  /** `true` quando há um usuário autenticado. */
  isAuthenticated: boolean;
  /** `true` enquanto a sessão está sendo restaurada do localStorage. */
  isLoading: boolean;
  /** Autentica o usuário por e-mail ou CRM. */
  login: (data: LoginFormData) => Promise<void>;
  /** Realiza o cadastro do usuário (conta fica pendente de aprovação). */
  register: (data: RegisterFormData) => Promise<void>;
  /** Encerra a sessão e limpa os tokens do localStorage. */
  logout: () => void;
  /** Atualiza campos do usuário no estado local sem refazer o fetch. */
  updateUser: (data: Partial<Pick<User, 'fullName' | 'email' | 'crm'>>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook para acessar o contexto de autenticação.
 *
 * @throws {Error} Se usado fora de um {@link AuthProvider}.
 *
 * @example
 * ```tsx
 * const { user, login, logout } = useAuth();
 * ```
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ─── Helpers de token ─────────────────────────────────────────────────────────

/** Persiste os tokens JWT no localStorage. */
function saveTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

/** Remove os tokens JWT do localStorage. */
function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Provedor de autenticação.
 *
 * Ao montar, tenta restaurar a sessão buscando `GET /auth/me/` com o
 * access token armazenado. Se falhar, limpa os tokens silenciosamente.
 *
 * Deve envolver toda a aplicação (ou ao menos as rotas protegidas).
 */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao montar, recupera o usuário logado caso ainda haja token válido
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .get<ApiUser>('/auth/me/')
      .then(({ data }) => setUser(mapUser(data)))
      .catch(() => clearTokens())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (data: LoginFormData) => {
    const response = await api.post<{
      access: string;
      refresh: string;
      user: ApiUser;
    }>('/auth/token/', {
      identifier: data.identifier,
      password: data.password,
    });

    saveTokens(response.data.access, response.data.refresh);
    setUser(mapUser(response.data.user));
  }, []);

  const register = useCallback(async (data: RegisterFormData) => {
    await api.post('/auth/register/', {
      full_name: data.fullName,
      email: data.email,
      crm: data.crm,
      role: data.role,
      password: data.password,
      confirm_password: data.confirmPassword,
    });
    // Cadastro realizado — aguarda aprovação do admin, não faz login automático
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const updateUser = useCallback(
    (data: Partial<Pick<User, 'fullName' | 'email' | 'crm'>>) => {
      setUser((prev) => (prev ? { ...prev, ...data } : prev));
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Mapeamento API → tipo do frontend ────────────────────────────────────────

/** Formato do usuário retornado pela API (snake_case). */
interface ApiUser {
  id: number | string;
  full_name: string;
  email: string;
  crm: string | null;
  role: string;
}

/**
 * Converte o usuário do formato da API para o formato do frontend.
 * O `id` é normalizado para string; `crm` nulo vira string vazia.
 */
function mapUser(apiUser: ApiUser): User {
  return {
    id: String(apiUser.id),
    fullName: apiUser.full_name,
    email: apiUser.email,
    crm: apiUser.crm ?? '',
    role: apiUser.role as User['role'],
  };
}
