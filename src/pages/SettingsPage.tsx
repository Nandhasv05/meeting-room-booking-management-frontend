// AUTHOR : NANDHAKUMAR S V
// DATE : 27/08/2026
// DESCRIPTION : Settings page to view and manage settings
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, type FieldProps } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, apiError, unwrap } from '../services/api';
import { celebrate } from '../components/ui/SuccessFx';
import { PageHeader, Spinner } from '../components/ui/Feedback';
import { Field as Labeled, GhostButton, inputClass, PrimaryButton } from '../components/ui/Form';
import { Card, CardHeader } from '../components/ui/Surface';

const MAIL_KEYS = ['smtp.host', 'smtp.port', 'smtp.user', 'smtp.password', 'smtp.from'] as const;
const PASSWORD_UNCHANGED = '********';

export function SettingsPage() {
  const qc = useQueryClient();
  const [testTo, setTestTo] = useState('nandhakumarsv@gmail.com');
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => unwrap<{ Key: string; Value: string; Description: string }[]>(api.get('/settings')),
  });
  const save = useMutation({
    mutationFn: (entries: { key: string; value: string }[]) => unwrap(api.patch('/settings', { entries })),
    onSuccess: () => {
      celebrate('Settings saved');
      void qc.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (e) => toast.error(apiError(e)),
  });
  const test = useMutation({
    mutationFn: (to: string) => unwrap(api.post('/settings/test-mail', { to })),
    onSuccess: () => toast.success('Test mail sent. Check inbox and Junk.'),
    onError: (e) => toast.error(apiError(e)),
  });
  if (isLoading || !data) return <Spinner />;
  const initial = Object.fromEntries(data.map((s) => [s.Key, s.Value]));
  const other = data.filter((s) => !MAIL_KEYS.includes(s.Key as (typeof MAIL_KEYS)[number]));
  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader
        title="System settings"
        description="Save one Gmail or Outlook mailbox that delivers invitations. Guests never enter a password."
      />
      <Formik
        enableReinitialize
        initialValues={initial}
        onSubmit={(values) => {
          const entries = Object.entries(values)
            .filter(([key, value]) => {
              if (key !== 'smtp.password') return true;
              const next = String(value ?? '').replace(/\s+/g, '');
              return next.length > 0 && next !== PASSWORD_UNCHANGED;
            })
            .map(([key, value]) => ({
              key,
              value: key === 'smtp.password' ? String(value ?? '').replace(/\s+/g, '') : String(value ?? ''),
            }));
          save.mutate(entries);
        }}
      >
        {({ values, dirty, setFieldValue, initialValues }) => (
          <Form className="space-y-4">
            <Card>
              <CardHeader
                title="Sending mailbox (once)"
                subtitle="This mailbox only delivers the message. On each booking, the logged-in user is the organizer and the invite list is the people who receive it."
              />
              <div className="mb-4 grid gap-2 rounded-xl border border-navy-800/10 bg-mist/40 px-3.5 py-3 text-sm text-navy-800/75">
                <p>
                  <span className="font-semibold text-navy-900">From</span> = you (the logged-in user). Replies go to
                  your mail ID.
                </p>
                <p>
                  <span className="font-semibold text-navy-900">To</span> = invitation mail IDs you add on the booking
                  form. Those people never sign in here.
                </p>
                <p>
                  The <strong>sending mail ID</strong> must be the Google account where you created the app password.
                  Changing the address without a new app password causes “Username and Password not accepted”.
                </p>
                <p>
                  Gmail host: <span className="font-mono text-navy-900">smtp.gmail.com</span> · Outlook host:{' '}
                  <span className="font-mono text-navy-900">smtp.office365.com</span> · Port 587
                </p>
              </div>
              <Labeled label="SMTP host" hint="Outlook: smtp.office365.com · Gmail: smtp.gmail.com">
                <Field name="smtp.host" className={inputClass} />
              </Labeled>
              <Labeled label="Port" hint="Use 587 for both Outlook and Gmail.">
                <Field name="smtp.port" className={inputClass} />
              </Labeled>
              <Labeled
                label="Sending mail ID"
                hint="Must match the Google account that created the app password — not a different Gmail."
              >
                <Field name="smtp.user">
                  {({ field }: FieldProps) => (
                    <input
                      {...field}
                      type="email"
                      className={inputClass}
                      placeholder="you@gmail.com"
                      onChange={(e) => {
                        const next = e.target.value;
                        void setFieldValue('smtp.user', next);
                        const saved = String(initialValues['smtp.user'] ?? '').trim().toLowerCase();
                        if (next.trim().toLowerCase() !== saved) {
                          void setFieldValue('smtp.password', '');
                        }
                      }}
                    />
                  )}
                </Field>
              </Labeled>
              <Labeled
                label="Sending mailbox password"
                hint={
                  values['smtp.password'] === PASSWORD_UNCHANGED
                    ? 'App password is already saved. Leave this as-is unless you generated a new one.'
                    : 'Paste the 16-character Google app password from the same account as Sending mail ID. Not your normal Gmail password.'
                }
              >
                <Field name="smtp.password" type="password" className={inputClass} autoComplete="new-password" />
              </Labeled>
              <Labeled label="From name" hint="Display name only. Example: Nandhakumar">
                <Field name="smtp.from" className={inputClass} />
              </Labeled>
              <div className="mb-4 rounded-xl bg-mist/50 px-3.5 py-3">
                <p className="mb-2 text-sm font-semibold text-navy-900">Send a test to any inbox</p>
                <p className="mb-2 text-xs text-navy-800/55">
                  Test uses the last saved mailbox ({String(initialValues['smtp.user'] || 'not saved')}). Save first if
                  you changed the mail ID or password.
                </p>
                <div className="flex flex-wrap gap-2">
                  <input
                    className={`${inputClass} max-w-sm`}
                    value={testTo}
                    onChange={(e) => setTestTo(e.target.value)}
                    placeholder="anyone@evolvclothing.com"
                  />
                  <GhostButton
                    type="button"
                    disabled={test.isPending || !values['smtp.user'] || !values['smtp.password']}
                    onClick={() => {
                      if (dirty) {
                        toast.error('Click Save sending mailbox first, then send the test.');
                        return;
                      }
                      if (!testTo.trim()) {
                        toast.error('Enter a mailbox to test.');
                        return;
                      }
                      test.mutate(testTo.trim());
                    }}
                  >
                    {test.isPending ? 'Sending…' : 'Send test mail'}
                  </GhostButton>
                </div>
              </div>
              <PrimaryButton type="submit" disabled={save.isPending}>
                Save sending mailbox
              </PrimaryButton>
            </Card>

            <Card>
              <CardHeader title="Other configuration" subtitle={`${other.length} keys`} />
              {other.map((s) => (
                <Labeled key={s.Key} label={s.Key} hint={s.Description || undefined}>
                  <Field name={s.Key} className={inputClass} />
                </Labeled>
              ))}
              <PrimaryButton type="submit" disabled={save.isPending}>
                Save settings
              </PrimaryButton>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
}
