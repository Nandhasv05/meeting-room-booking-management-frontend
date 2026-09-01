// AUTHOR : NANDHAKUMAR S V
// DATE : 01/09/2026
// DESCRIPTION : Shared contact book — same list for every login
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, Pencil, Trash2, Upload, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { EmptyState, PageHeader, Spinner } from '../../components/ui/Feedback';
import { Field, GhostButton, inputClass, Offcanvas, PrimaryButton } from '../../components/ui/Form';
import { DataTable, SearchField, Toolbar, type Column } from '../../components/ui/Surface';
import { useAuth } from '../../hooks/useAuth';
import { apiError } from '../../services/api';
import {
  exportContactsCsv,
  importContacts,
  listContacts,
  migrateLocalContacts,
  parseContactFile,
  removeContact,
  upsertContact,
  type SavedContact,
} from '../../helpers/contact/contactStore';
import { initialsOf } from '../../components/booking/EmployeePicker';

export function ContactsPage() {
  const { user, isAuthenticated } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<SavedContact[]>([]);
  const [panel, setPanel] = useState(false);
  const [editing, setEditing] = useState<SavedContact | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      await migrateLocalContacts();
      setContacts(await listContacts());
    } catch (err) {
      toast.error(apiError(err));
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setContacts([]);
      setLoading(false);
      return;
    }
    void reload();
  }, [isAuthenticated, user?.id, reload]);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return contacts.filter((c) => `${c.name} ${c.email} ${c.phone ?? ''}`.toLowerCase().includes(query));
  }, [contacts, q]);

  const openNew = () => {
    setEditing(null);
    setName('');
    setEmail('');
    setPhone('');
    setPanel(true);
  };

  const openEdit = (contact: SavedContact) => {
    setEditing(contact);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone ?? '');
    setPanel(true);
  };

  const save = async () => {
    const nextEmail = email.trim().toLowerCase();
    const nextName = name.trim() || nextEmail.split('@')[0];
    const clash = contacts.find((c) => {
      if (editing && c.id === editing.id) return false;
      return (
        c.email.trim().toLowerCase() === nextEmail ||
        c.name.trim().toLowerCase() === nextName.toLowerCase()
      );
    });
    if (clash) {
      toast.error(
        clash.email.trim().toLowerCase() === nextEmail
          ? 'This email is already in the contact book.'
          : 'A contact with this name already exists.',
      );
      return;
    }
    setSaving(true);
    try {
      await upsertContact({ id: editing?.id, name, email, phone });
      toast.success(editing ? 'Contact updated' : 'Contact added');
      setPanel(false);
      setContacts(await listContacts());
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const importFile = async (file: File) => {
    const parsed = parseContactFile(await file.text());
    if (!parsed.length) {
      toast.error('No contacts found in that file');
      return;
    }
    try {
      const result = await importContacts(parsed);
      setContacts(await listContacts());
      toast.success(
        result.skipped
          ? `Imported ${result.added} new, skipped ${result.skipped} duplicate${result.skipped === 1 ? '' : 's'}`
          : `Imported ${result.added} new, updated ${result.updated}`,
      );
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const columns: Column<SavedContact>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (c) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
            {initialsOf(c.name)}
          </span>
          <div>
            <p className="font-semibold text-navy-900">{c.name}</p>
            <p className="text-xs text-navy-800/45">{c.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (c) => c.phone || '—' },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (c) => (
        <div className="flex justify-end gap-1">
          <GhostButton type="button" className="!px-2.5 !py-1.5" onClick={() => openEdit(c)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </GhostButton>
          <GhostButton
            type="button"
            className="!px-2.5 !py-1.5"
            onClick={async () => {
              try {
                await removeContact(c.id);
                setContacts(await listContacts());
                toast.success('Contact removed');
              } catch (err) {
                toast.error(apiError(err));
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </GhostButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Toolbar>
        <SearchField value={q} onChange={setQ} placeholder="Search name or email" />
        <div className="ml-auto flex flex-wrap gap-2">
          <GhostButton type="button" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Import
          </GhostButton>
          <GhostButton type="button" disabled={!contacts.length} onClick={() => exportContactsCsv(contacts)}>
            <Download className="h-4 w-4" />
            Export
          </GhostButton>
          <PrimaryButton type="button" onClick={openNew}>
            <UserPlus className="h-4 w-4" />
            New contact
          </PrimaryButton>
        </div>
      </Toolbar>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.txt,.vcf,text/csv,text/vcard"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) void importFile(file);
        }}
      />

      {loading ? (
        <Spinner />
      ) : !rows.length ? (
        <EmptyState
          title={contacts.length ? 'No matches' : 'No contacts yet'}
          hint="Use New contact, or Import a CSV with Name,Email. This list is the same for every login."
        />
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(c) => c.id || c.email} />
      )}

      <Offcanvas
        open={panel}
        title={editing ? 'Edit contact' : 'New contact'}
        subtitle="Saved here for every Meeting Hall login, not just this browser."
        onClose={() => setPanel(false)}
        footer={
          <div className="flex justify-end gap-2">
            <GhostButton type="button" onClick={() => setPanel(false)}>
              Cancel
            </GhostButton>
            <PrimaryButton type="button" onClick={() => void save()} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add contact'}
            </PrimaryButton>
          </div>
        }
      >
        <Field label="Name">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Email" hint="Invite emails are sent here. Duplicate emails are merged.">
          <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
        </Field>
        <Field label="Phone">
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
        </Field>
      </Offcanvas>
    </div>
  );
}

export default ContactsPage;
