import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '');
  // Live site is https://apps.evolvclothing.com/Meeting/ — never use base `/` for production.
  const base = env.VITE_BASE || (mode === 'production' ? '/Meeting/' : '/');

  return {
    base,
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(root, 'src') },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: 'http://127.0.0.1:5000', changeOrigin: true },
        '/uploads': { target: 'http://127.0.0.1:5000', changeOrigin: true },
        '/socket.io': { target: 'http://127.0.0.1:5000', ws: true },
      },
    },
  };
});
