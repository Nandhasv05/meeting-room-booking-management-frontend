import axios, { type AxiosError } from 'axios';
import { store, setSession, clearSession } from '../store';
import type { ApiEnvelope } from '../types/api';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20_000,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiEnvelope<null>>) => {
    const original = error.config;
    if (!original || error.response?.status !== 401 || original.url?.includes('/auth/')) {
      return Promise.reject(error);
    }
    if (!refreshing) {
      refreshing = (async () => {
        const refreshToken = store.getState().auth.refreshToken;
        if (!refreshToken) return null;
        try {
          const { data } = await axios.post<ApiEnvelope<{ accessToken: string; refreshToken: string; user: never }>>(
            `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
            { refreshToken },
          );
          const next = data.data;
          store.dispatch(
            setSession({
              user: store.getState().auth.user,
              accessToken: next.accessToken,
              refreshToken: next.refreshToken,
            }),
          );
          return next.accessToken;
        } catch {
          store.dispatch(clearSession());
          return null;
        } finally {
          refreshing = null;
        }
      })();
    }
    const token = await refreshing;
    if (!token) return Promise.reject(error);
    original.headers.Authorization = `Bearer ${token}`;
    return api.request(original);
  },
);

export async function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const { data } = await promise;
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export function apiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const msg = (err.response?.data as ApiEnvelope<null> | undefined)?.message;
    return msg || err.message;
  }
  return err instanceof Error ? err.message : 'Request failed';
}
