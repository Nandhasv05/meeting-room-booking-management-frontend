export function isAdminRole(code?: string | null) {
  return String(code ?? '').toUpperCase() === 'ADMINISTRATOR';
}
