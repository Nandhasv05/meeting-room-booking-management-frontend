/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_SOCKET_PATH?: string;
  readonly VITE_API_CRYPTO_KEY: string;
  readonly VITE_BASE?: string;
  readonly VITE_PORTAL_HOME_URL?: string;
  readonly VITE_PORTAL_LOGIN_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
