import { makeApiCall } from '../../redux/_common/api.utils';

export type SavedContact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
};

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function fromApi(row: Record<string, unknown>): SavedContact {
  return {
    id: String(row.Id ?? row.id ?? ''),
    name: String(row.Name ?? row.name ?? ''),
    email: String(row.Email ?? row.email ?? ''),
    phone: String(row.Phone ?? row.phone ?? '') || '',
    createdAt: row.CreatedAt ? String(row.CreatedAt) : undefined,
  };
}

function unwrap(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && 'data' in (payload as object)) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

export function collectLocalContacts(): SavedContact[] {
  const rows: SavedContact[] = [];
  const seen = new Set<string>();
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key?.startsWith('mh-contacts:')) continue;
      const parsed = JSON.parse(localStorage.getItem(key) || '[]') as SavedContact[];
      if (!Array.isArray(parsed)) continue;
      for (const item of parsed) {
        const email = String(item.email ?? '').trim().toLowerCase();
        if (!looksLikeEmail(email) || seen.has(email)) continue;
        seen.add(email);
        rows.push({
          id: item.id,
          name: String(item.name ?? '').trim() || email.split('@')[0],
          email,
          phone: String(item.phone ?? '').trim(),
        });
      }
    }
  } catch {
    return rows;
  }
  return rows;
}

export function clearLocalContacts() {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith('mh-contacts:')) keys.push(key);
  }
  keys.forEach((key) => localStorage.removeItem(key));
}

export async function listContacts(q = ''): Promise<SavedContact[]> {
  const res = await makeApiCall('/contacts', { q });
  const data = unwrap(res.data);
  const rows = Array.isArray(data) ? data : [];
  const unique = new Map<string, SavedContact>();
  for (const row of rows) {
    const contact = fromApi(row as Record<string, unknown>);
    const email = contact.email.trim().toLowerCase();
    if (!email || unique.has(email)) continue;
    unique.set(email, contact);
  }
  return [...unique.values()];
}

export async function upsertContact(input: { name: string; email: string; phone?: string; id?: string }) {
  const email = input.email.trim().toLowerCase();
  if (!looksLikeEmail(email)) throw new Error('Enter a valid email');
  const body = { name: input.name.trim() || email.split('@')[0], email, phone: input.phone?.trim() || '' };
  const res = input.id
    ? await makeApiCall(`/contacts/${encodeURIComponent(input.id)}/update`, body)
    : await makeApiCall('/contacts/create', body);
  const data = unwrap(res.data);
  return fromApi((data && typeof data === 'object' ? data : body) as Record<string, unknown>);
}

export async function removeContact(id: string) {
  await makeApiCall(`/contacts/${encodeURIComponent(id)}/delete`, {});
}

export async function importContacts(rows: Array<{ name: string; email: string; phone?: string }>) {
  const contacts = rows
    .map((row) => ({
      name: row.name.trim(),
      email: row.email.trim().toLowerCase(),
      phone: row.phone?.trim() || '',
    }))
    .filter((row) => looksLikeEmail(row.email));
  if (!contacts.length) return { added: 0, updated: 0, skipped: 0, total: 0 };
  const res = await makeApiCall('/contacts/import', { contacts });
  const data = unwrap(res.data) as { added?: number; updated?: number; total?: number } | null;
  return {
    added: Number(data?.added ?? 0),
    updated: Number(data?.updated ?? 0),
    total: Number(data?.total ?? contacts.length),
  };
}

export async function migrateLocalContacts() {
  const local = collectLocalContacts();
  if (!local.length) return;
  try {
    await importContacts(local);
    clearLocalContacts();
  } catch {
    /* keep local copy if SQL is not ready */
  }
}

export function parseContactFile(text: string): Array<{ name: string; email: string }> {
  const rows: Array<{ name: string; email: string }> = [];
  const seen = new Set<string>();
  const vcardBlocks = text.split(/BEGIN:VCARD/i);
  if (vcardBlocks.length > 1) {
    for (const block of vcardBlocks) {
      const name = block.match(/FN[:;]([^\r\n]+)/i)?.[1]?.trim() ?? '';
      const email = block.match(/EMAIL[^:]*:([^\r\n]+)/i)?.[1]?.trim() ?? '';
      if (!looksLikeEmail(email) || seen.has(email.toLowerCase())) continue;
      seen.add(email.toLowerCase());
      rows.push({ name: name || email.split('@')[0], email });
    }
    return rows;
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || /^name\s*,\s*email/i.test(line)) continue;
    const parts = line.split(/[,;\t]/).map((part) => part.trim().replace(/^"|"$/g, ''));
    const email = parts.find((part) => looksLikeEmail(part)) ?? '';
    if (!email || seen.has(email.toLowerCase())) continue;
    seen.add(email.toLowerCase());
    const name = parts.find((part) => part && part !== email) || email.split('@')[0];
    rows.push({ name, email });
  }
  return rows;
}

export function exportContactsCsv(contacts: Array<{ name: string; email: string; phone?: string }>) {
  const lines = [
    'Name,Email,Phone',
    ...contacts.map((c) => `"${c.name.replaceAll('"', '""')}",${c.email},${c.phone ?? ''}`),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contacts.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/** @deprecated browser-only helper kept so old imports do not crash */
export function loadContacts(_userId?: string): SavedContact[] {
  return [];
}
