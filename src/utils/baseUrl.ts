/** Vite BASE_URL is `/` locally and `/Meeting/` on production. */
export function appBasename(): string {
  const base = String(import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  return base || '/';
}

export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${String(path).replace(/^\/+/, '')}`;
}
