// AUTHOR : NANDHAKUMAR S V
// DATE : 27/08/2026
// DESCRIPTION : Settings page to view and manage settings
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { celebrate } from '../../components/ui/SuccessFx';
import { PageHeader, Spinner } from '../../components/ui/Feedback';
import { Field as Labeled, GhostButton, inputClass, PrimaryButton } from '../../components/ui/Form';
import { Card, CardHeader } from '../../components/ui/Surface';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchSettingsStart,
  saveSettingsResponseResetStart,
  saveSettingsStart,
  testMailResponseResetStart,
  testMailStart,
} from '../../redux/settings/settings.action';
import {
  selectSaveSettingsLoading,
  selectSaveSettingsResponse,
  selectSettings,
  selectSettingsLoading,
  selectTestMailLoading,
  selectTestMailResponse,
} from '../../redux/settings/settings.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';

const MAIL_KEYS = ['smtp.host', 'smtp.port', 'smtp.user', 'smtp.password', 'smtp.from'] as const;
const PASSWORD_UNCHANGED = '********';

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const [testTo, setTestTo] = useState('nandhakumarsv@gmail.com');
  const data = useAppSelector(selectSettings) as { Key: string; Value: string; Description: string }[] | undefined;
  const isLoading = useAppSelector(selectSettingsLoading);
  const saving = useAppSelector(selectSaveSettingsLoading);
  const testing = useAppSelector(selectTestMailLoading);
  const saveResponse = useAppSelector(selectSaveSettingsResponse);
  const testResponse = useAppSelector(selectTestMailResponse);

  const { register, handleSubmit, watch, setValue, reset, formState } = useForm<Record<string, string>>({
    defaultValues: {} as Record<string, string>,
  });

  useEffect(() => {
    dispatch(fetchSettingsStart());
  }, [dispatch]);

  useEffect(() => {
    if (!data) return;
    reset(Object.fromEntries(data.map((s) => [s.Key, s.Value])));
  }, [data, reset]);

  const resetSave = useCallback(() => dispatch(saveSettingsResponseResetStart()), [dispatch]);
  const resetTest = useCallback(() => dispatch(testMailResponseResetStart()), [dispatch]);
  useReduxResponse(saveResponse, resetSave, () => {
    celebrate('Settings saved');
    dispatch(fetchSettingsStart());
  });
  useReduxResponse(testResponse, resetTest, () => {
    toast.success('Test mail sent. Check inbox and Junk.');
  });

  const values = watch();
  const savedUser = String(data?.find((s) => s.Key === 'smtp.user')?.Value ?? '');

  if (isLoading || !data) return <Spinner />;
  const other = data.filter((s) => !MAIL_KEYS.includes(s.Key as (typeof MAIL_KEYS)[number]));
  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader
        title="System settings"
        description="Save one Gmail or Outlook mailbox that delivers invitations. Guests never enter a password."
      />
      <form
        className="space-y-4"
        onSubmit={handleSubmit((formValues) => {
          const entries = Object.entries(formValues)
            .filter(([key, value]) => {
              if (key !== 'smtp.password') return true;
              const next = String(value ?? '').replace(/\s+/g, '');
              return next.length > 0 && next !== PASSWORD_UNCHANGED;
            })
            .map(([key, value]) => ({
              key,
              value: key === 'smtp.password' ? String(value ?? '').replace(/\s+/g, '') : String(value ?? ''),
            }));
          dispatch(saveSettingsStart({ entries }));
        })}
      >
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
            <input className={inputClass} {...register('smtp.host')} />
          </Labeled>
          <Labeled label="Port" hint="Use 587 for both Outlook and Gmail.">
            <input className={inputClass} {...register('smtp.port')} />
          </Labeled>
          <Labeled
            label="Sending mail ID"
            hint="Must match the Google account that created the app password — not a different Gmail."
          >
            <input
              type="email"
              className={inputClass}
              placeholder="you@gmail.com"
              {...register('smtp.user')}
              onChange={(e) => {
                const next = e.target.value;
                (setValue as (name: string, value: string, opts?: { shouldDirty?: boolean }) => void)(
                  'smtp.user',
                  next,
                  { shouldDirty: true },
                );
                if (next.trim().toLowerCase() !== savedUser.trim().toLowerCase()) {
                  (setValue as (name: string, value: string, opts?: { shouldDirty?: boolean }) => void)(
                    'smtp.password',
                    '',
                    { shouldDirty: true },
                  );
                }
              }}
            />
          </Labeled>
          <Labeled
            label="Sending mailbox password"
            hint={
              values['smtp.password'] === PASSWORD_UNCHANGED
                ? 'App password is already saved. Leave this as-is unless you generated a new one.'
                : 'Paste the 16-character Google app password from the same account as Sending mail ID. Not your normal Gmail password.'
            }
          >
            <input type="password" className={inputClass} autoComplete="new-password" {...register('smtp.password')} />
          </Labeled>
          <Labeled label="From name" hint="Display name only. Example: Nandhakumar">
            <input className={inputClass} {...register('smtp.from')} />
          </Labeled>
          <div className="mb-4 rounded-xl bg-mist/50 px-3.5 py-3">
            <p className="mb-2 text-sm font-semibold text-navy-900">Send a test to any inbox</p>
            <p className="mb-2 text-xs text-navy-800/55">
              Test uses the last saved mailbox ({savedUser || 'not saved'}). Save first if you changed the mail ID or
              password.
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
                disabled={testing || !values['smtp.user'] || !values['smtp.password']}
                onClick={() => {
                  if (formState.isDirty) {
                    toast.error('Click Save sending mailbox first, then send the test.');
                    return;
                  }
                  if (!testTo.trim()) {
                    toast.error('Enter a mailbox to test.');
                    return;
                  }
                  dispatch(testMailStart({ to: testTo.trim() }));
                }}
              >
                {testing ? 'Sending…' : 'Send test mail'}
              </GhostButton>
            </div>
          </div>
          <PrimaryButton type="submit" disabled={saving}>
            Save sending mailbox
          </PrimaryButton>
        </Card>

        <Card>
          <CardHeader title="Other configuration" subtitle={`${other.length} keys`} />
          {other.map((s) => (
            <Labeled key={s.Key} label={s.Key} hint={s.Description || undefined}>
              <input className={inputClass} {...register(s.Key)} />
            </Labeled>
          ))}
          <PrimaryButton type="submit" disabled={saving}>
            Save settings
          </PrimaryButton>
        </Card>
      </form>
    </div>
  );
}
