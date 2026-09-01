import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { store, setSession, clearSession } from '../store';
import type { ApiEnvelope } from '../types/api';
import { API_CRYPTO_KEY, API_URL } from '../redux/const';
import { encryptDataV2, decryptData, isDecryptFailure } from '../redux/_common/enode-decode';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipCrypto?: boolean;
    cryptoApplied?: boolean;
  }
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 20_000,
});

function liveApiUrl(): string {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname || '';
    if (path === '/Meeting' || path.startsWith('/Meeting/')) return '/Meeting/api';
  }
  return API_URL;
}

function shouldSkipCrypto(config: AxiosRequestConfig): boolean {
  if (config.skipCrypto) return true;
  if (config.responseType === 'blob' || config.responseType === 'arraybuffer') return true;
  const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
  return url.includes('/reports/export');
}

function requestPayload(config: InternalAxiosRequestConfig): object | FormData {
  const method = (config.method || 'get').toLowerCase();
  const source = method === 'get' || method === 'head' ? config.params : config.data;
  if (source == null) return {};
  if (typeof FormData !== 'undefined' && source instanceof FormData) return source;
  if (typeof source === 'object') return source as object;
  return {};
}

function encryptRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (config.cryptoApplied || shouldSkipCrypto(config)) return config;
  const payload = requestPayload(config);
  if (typeof FormData !== 'undefined' && payload instanceof FormData) return config;
  const requestToken = encryptDataV2(payload, API_CRYPTO_KEY);
  config.cryptoApplied = true;
  const method = (config.method || 'get').toLowerCase();
  if (method === 'get' || method === 'head') {
    config.params = { requestToken };
  } else {
    config.data = { requestToken };
  }
  return config;
}

function decryptEnvelope(body: unknown): ApiEnvelope<unknown> | null {
  if (!body || typeof body !== 'object') return null;
  const envelope = body as { success?: boolean; message?: string; response?: unknown; data?: unknown };
  if (typeof envelope.response !== 'string') {
    if ('success' in envelope && 'data' in envelope) {
      return envelope as ApiEnvelope<unknown>;
    }
    return null;
  }
  const decoded = decryptData(envelope.response, API_CRYPTO_KEY);
  if (isDecryptFailure(decoded)) return null;
  return {
    success: Boolean(envelope.success),
    message: envelope.message ?? '',
    data: decoded?.data ?? null,
  };
}

api.interceptors.request.use((config) => {
  config.baseURL = liveApiUrl();
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return encryptRequest(config);
});

let refreshing: Promise<string | null> | null = null;

async function refreshSession(): Promise<string | null> {
  const refreshToken = store.getState().auth.refreshToken;
  if (!refreshToken) return null;
  const requestToken = encryptDataV2({ refreshToken }, API_CRYPTO_KEY);
  const { data } = await axios.post(`${liveApiUrl()}/auth/refresh`, { requestToken });
  const next = decryptEnvelope(data)?.data as { accessToken: string; refreshToken: string } | null;
  if (!next?.accessToken) {
    store.dispatch(clearSession());
    return null;
  }
  store.dispatch(
    setSession({
      user: store.getState().auth.user,
      accessToken: next.accessToken,
      refreshToken: next.refreshToken,
    }),
  );
  return next.accessToken;
}

api.interceptors.response.use(
  (res) => {
    if (shouldSkipCrypto(res.config)) return res;
    const unwrapped = decryptEnvelope(res.data);
    if (!unwrapped) {
      return Promise.reject(new Error('Failed to decrypt API response'));
    }
    res.data = unwrapped;
    return res;
  },
  async (error: AxiosError<ApiEnvelope<null> & { response?: string }>) => {
    if (error.response?.data && typeof error.response.data === 'object') {
      const unwrapped = decryptEnvelope(error.response.data);
      if (unwrapped) error.response.data = unwrapped as ApiEnvelope<null>;
    }
    const original = error.config;
    if (!original || error.response?.status !== 401 || original.url?.includes('/auth/')) {
      return Promise.reject(error);
    }
    if (!refreshing) {
      refreshing = refreshSession().finally(() => {
        refreshing = null;
      });
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
