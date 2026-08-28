// AUTHOR : NANDNHAKUMAR SV
// DATE : 28/08/2026
// DESCRIPTION : Login page to login to the system
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userSignInStart, userSignInResponseResetStart } from '../../redux/login/login.action';
import { selectLoginLoading, selectLoginResponse } from '../../redux/login/login.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { useAppDispatch, useAppSelector } from '../../store';
import { inputClass, PrimaryButton } from '../../components/ui/Form';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { LogoSpinner } from '../../components/brand/LogoSpinner';
import { loginSchema, LoginFormData } from '../../helpers/login/loginValidation';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loginResponse = useAppSelector(selectLoginResponse);
  const loginLoading = useAppSelector(selectLoginLoading);

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

  const onSubmit = (data: LoginFormData) => {
    dispatch(userSignInStart({ email: data.email, password: data.password }));
  };

  useEffect(() => {
    return () => {
      dispatch(userSignInResponseResetStart());
    };
  }, [dispatch]);

  return (
    <div className="relative grid min-h-[100dvh] overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
      {loginLoading ? <LogoSpinner fullScreen label="Signing in…" size="lg" /> : null}

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
          <h2 className="mb-5 font-display text-xl font-semibold text-navy-900 sm:text-2xl">Sign in</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy-900">Email or username</span>
              <input type="text" autoComplete="username" className={inputClass} {...register('email')} />
              {errors.email ? <p className="mt-1 text-xs text-rose-700">{errors.email.message}</p> : null}
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy-900">Password</span>
              <input type="password" autoComplete="current-password" className={inputClass} {...register('password')} />
              {errors.password ? <p className="mt-1 text-xs text-rose-700">{errors.password.message}</p> : null}
            </label>
            <PrimaryButton type="submit" disabled={loginLoading} className="w-full">
              {loginLoading ? 'Signing in…' : 'Continue'}
            </PrimaryButton>
          </form>
        </div>
      </section>
    </div>
  );
}
export default LoginPage;
