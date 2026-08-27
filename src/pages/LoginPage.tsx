import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, apiError, unwrap } from '../services/api';
import { setSession, useAppDispatch } from '../store';
import type { AuthUser } from '../types/api';
import { GhostButton, inputClass, PrimaryButton } from '../components/ui/Form';
import { BrandLogo } from '../components/brand/BrandLogo';
import { LogoSpinner } from '../components/brand/LogoSpinner';
import { useState } from 'react';

const schema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Required'),
  password: Yup.string().required('Required'),
});

const TEST_USERS = [
  { label: 'Admin', email: 'admin@evoloclothing.com' },
  { label: 'Manager', email: 'manager@evlovcolthing.com' },
  { label: 'Nandhakumar', email: 'nandhakumar@evolvclothing.com' },
] as const;

const TEST_PASSWORD = 'password#1';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [booting, setBooting] = useState(false);

  const signIn = async (email: string, password: string) => {
    setBooting(true);
    try {
      const data = await unwrap<{ user: AuthUser; accessToken: string; refreshToken: string }>(
        api.post('/auth/login', { email, password }),
      );
      dispatch(setSession(data));
      toast.success('Welcome back.');
      navigate('/');
    } finally {
      setBooting(false);
    }
  };

  return (
    <div className="relative grid min-h-[100dvh] overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
      {booting ? <LogoSpinner fullScreen label="Signing in…" size="lg" /> : null}

      <section className="relative hidden min-h-[100dvh] lg:block">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 70% 50% at 18% 18%, rgba(47,122,78,0.35), transparent 55%),
              radial-gradient(ellipse 60% 45% at 88% 78%, rgba(18,35,21,0.45), transparent 50%),
              linear-gradient(145deg, #0f2015 0%, #122315 50%, #1a3322 100%)
            `,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="animate-rise">
            <BrandLogo variant="light" height={40} to={null} />
          </div>
          <div className="max-w-md animate-rise" style={{ animationDelay: '100ms' }}>
            <p className="font-display text-3xl font-semibold leading-snug text-white xl:text-4xl">
              Book the room.
              <br />
              Own the hour.
            </p>
            <p className="mt-4 text-sm text-white/55 xl:text-base">
              Campus conference halls, approvals, and live displays — one internal system.
            </p>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/30">
            Internal LAN · evolv clothing
          </p>
        </div>
      </section>

      <section className="relative flex items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(47,122,78,0.12), transparent 55%), linear-gradient(180deg,#f6f8f7,#e8f0eb)',
          }}
        />
        <div className="relative w-full max-w-md animate-rise rounded-3xl border border-navy-800/10 bg-white/90 p-6 shadow-lift backdrop-blur sm:p-8">
          <div className="mb-5 lg:hidden">
            <BrandLogo height={32} to={null} />
          </div>
          <h2 className="font-display text-xl font-semibold text-navy-900 sm:text-2xl">Sign in</h2>
          <p className="mb-5 mt-1.5 text-sm text-navy-800/60">
            Test password: <code className="text-brand-500">password#1</code>
          </p>

          <div className="mb-5 flex flex-wrap gap-2">
            {TEST_USERS.map((u) => (
              <GhostButton
                key={u.email}
                type="button"
                onClick={() => {
                  void signIn(u.email, TEST_PASSWORD).catch((err) => toast.error(apiError(err)));
                }}
              >
                {u.label}
              </GhostButton>
            ))}
          </div>

          <Formik
            initialValues={{ email: 'admin@evoloclothing.com', password: TEST_PASSWORD }}
            validationSchema={schema}
            onSubmit={async (values, helpers) => {
              try {
                await signIn(values.email, values.password);
              } catch (err) {
                toast.error(apiError(err));
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-3.5">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-navy-900">Email</span>
                  <Field name="email" type="email" className={inputClass} />
                  {touched.email && errors.email ? (
                    <p className="mt-1 text-xs text-rose-700">{errors.email}</p>
                  ) : null}
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-navy-900">Password</span>
                  <Field name="password" type="password" className={inputClass} />
                  {touched.password && errors.password ? (
                    <p className="mt-1 text-xs text-rose-700">{errors.password}</p>
                  ) : null}
                </label>
                <PrimaryButton type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Signing in…' : 'Continue'}
                </PrimaryButton>
                <div className="space-y-1 pt-1 text-xs text-navy-800/50">
                  {TEST_USERS.map((u) => (
                    <button
                      key={u.email}
                      type="button"
                      className="block text-left transition hover:text-brand-400"
                      onClick={() => {
                        void setFieldValue('email', u.email);
                        void setFieldValue('password', TEST_PASSWORD);
                      }}
                    >
                      {u.email}
                    </button>
                  ))}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </div>
  );
}
