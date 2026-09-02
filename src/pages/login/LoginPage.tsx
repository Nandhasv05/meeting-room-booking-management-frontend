// AUTHOR : NANDNHAKUMAR SV
// DATE : 28/08/2026
// DESCRIPTION : Login page to login to the system
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CalendarDays, DoorOpen, Eye, EyeOff, Monitor } from 'lucide-react';
import { userSignInStart, userSignInResponseResetStart } from '../../redux/login/login.action';
import { selectLoginLoading, selectLoginResponse } from '../../redux/login/login.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { useAppDispatch, useAppSelector } from '../../store';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { LogoSpinner } from '../../components/brand/LogoSpinner';
import { loginSchema, LoginFormData } from '../../helpers/login/loginValidation';
import { PORTAL_LOGIN_URL } from '../../redux/const';
import { goToPortalLogin, isLocalHost } from '../../components/portal/PortalSsoListener';

function clockLabel(now: Date) {
  return now.toLocaleString(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loginResponse = useAppSelector(selectLoginResponse);
  const loginLoading = useAppSelector(selectLoginLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const local = isLocalHost();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const resetLogin = useCallback(() => {
    dispatch(userSignInResponseResetStart());
  }, [dispatch]);

  useReduxResponse(loginResponse, resetLogin, () => {
    toast.success('Welcome back.');
    navigate('/');
  });

  useEffect(() => {
    if (!local) goToPortalLogin();
  }, [local]);

  useEffect(() => {
    if (!local) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearInterval(id);
      dispatch(userSignInResponseResetStart());
    };
  }, [dispatch, local]);

  if (!local) {
    return <LogoSpinner fullScreen light label="Opening EVOLV sign in…" size="lg" />;
  }

  const onSubmit = (data: LoginFormData) => {
    dispatch(userSignInStart({ email: data.email, password: data.password }));
  };

  const fieldClass =
    'w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-[15px] text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/70 focus:bg-white/[0.09] focus:ring-4 focus:ring-emerald-400/15';

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#07140c] text-white">
      {loginLoading ? <LogoSpinner fullScreen light label="Signing in…" size="lg" /> : null}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(47,122,78,0.38), transparent 55%),
            radial-gradient(ellipse 45% 40% at 100% 80%, rgba(18,35,21,0.7), transparent 50%),
            radial-gradient(ellipse 40% 35% at 0% 90%, rgba(47,122,78,0.18), transparent 45%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <BrandLogo variant="light" height={28} to={null} />
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40 sm:inline">
            Conference halls
          </span>
        </div>
        <p className="text-[11px] font-medium tabular-nums text-white/45">{clockLabel(now)}</p>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-5.5rem)] max-w-6xl flex-col items-center justify-center px-4 pb-10 sm:px-8">
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {[
            { icon: CalendarDays, label: 'Book a hall' },
            { icon: Monitor, label: 'Live displays' },
            { icon: DoorOpen, label: 'Internal LAN' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55"
            >
              <Icon size={12} />
              {label}
            </span>
          ))}
        </div>

        <div className="w-full max-w-[420px] animate-rise rounded-[28px] border border-white/12 bg-[#0c1c12]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">Staff access</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">Sign in</h1>
          <p className="mt-2 text-sm text-white/50">Use your directory username or email.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                Email or username
              </span>
              <input type="text" autoComplete="username" className={fieldClass} {...register('email')} />
              {errors.email ? <p className="mt-1.5 text-xs text-rose-300">{errors.email.message}</p> : null}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`${fieldClass} pr-12`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/45 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password ? <p className="mt-1.5 text-xs text-rose-300">{errors.password.message}</p> : null}
            </label>
            <button
              type="submit"
              disabled={loginLoading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-semibold text-[#07140c] shadow-[0_12px_30px_rgba(47,122,78,0.35)] transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {loginLoading ? 'Signing in…' : 'Enter halls'}
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-white/40">
            Company portal:{' '}
            <a href={PORTAL_LOGIN_URL} className="font-semibold text-emerald-300/80 underline-offset-2 hover:underline">
              EVOLV sign in
            </a>
          </p>
        </div>

        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/28">
          Internal LAN · evolv clothing
        </p>
      </main>
    </div>
  );
}
export default LoginPage;
