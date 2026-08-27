export function isOpsDashboardRole(code?: string | null) {
  return code === 'ADMINISTRATOR' || code === 'HALL_MANAGER' || code === 'FACILITY_MANAGER';
}

export function isAdminRole(code?: string | null) {
  return code === 'ADMINISTRATOR';
}
