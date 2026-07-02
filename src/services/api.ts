import axios from 'axios';

/**
 * Instância Axios compartilhada por todos os services.
 *
 * A `baseURL` é lida de `VITE_API_URL` no `.env`; faz fallback para
 * `http://localhost:8000/api` em desenvolvimento.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Interceptor de request: injeta o Bearer token em todas as chamadas.
 * O token é lido do `localStorage` a cada requisição para refletir
 * renovações sem precisar recriar a instância.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor de response: renovação automática do access token.
 *
 * Quando a API retorna 401, tenta usar o refresh token para obter
 * um novo access token e reenvia a requisição original.
 * Se o refresh também falhar, limpa os tokens e redireciona para `/`.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'}/auth/token/refresh/`,
            { refresh: refreshToken },
          );
          localStorage.setItem('access_token', data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/';
        }
      }
    }

    return Promise.reject(error as Error);
  },
);
