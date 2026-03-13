import React, { useEffect, useState } from 'react';
import { useAuth, useSignIn } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';

type ClerkAuthProps = {
  t: (key: string) => string;
};

const getClerkError = (error: unknown, fallback: string) => {
  const firstError =
    typeof error === 'object' &&
    error &&
    'errors' in error &&
    Array.isArray((error as { errors?: Array<{ message?: string; longMessage?: string; code?: string }> }).errors)
      ? (error as { errors?: Array<{ message?: string; longMessage?: string; code?: string }> }).errors?.[0]
      : null;

  return {
    code: firstError?.code,
    message: firstError?.longMessage || firstError?.message || fallback,
  };
};

const ClerkAuth: React.FC<ClerkAuthProps> = ({ t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthSubmitting, setIsOAuthSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();

  const isAuthReady = isLoaded && isAuthLoaded && !!signIn;
  const isBlockedBySession = isAuthLoaded && isSignedIn;
  const isBusy = isSubmitting || isOAuthSubmitting;
  const oauthRedirectUrl = `${window.location.origin}/#/sso-callback`;
  const oauthRedirectUrlComplete = `${window.location.origin}/#/home`;

  useEffect(() => {
    if (isSignedIn) {
      navigate('/home');
    }
  }, [isSignedIn, navigate]);

  const handleOAuth = async (strategy: 'oauth_google' | 'oauth_facebook' | 'oauth_line') => {
    if (!isLoaded || !signIn || !isAuthLoaded) return;
    if (isSignedIn) {
      navigate('/home');
      return;
    }

    setAuthError(null);
    setIsOAuthSubmitting(true);

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: oauthRedirectUrl,
        redirectUrlComplete: oauthRedirectUrlComplete,
      });
    } catch (error: unknown) {
      const { code, message } = getClerkError(error, 'Unable to start OAuth sign-in. Please try again.');
      if (message.toLowerCase().includes('session already exists')) {
        navigate('/home');
        return;
      }
      setAuthError(code ? `${message} (${code})` : message);
    } finally {
      setIsOAuthSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!isLoaded || !signIn || !isAuthLoaded) return;
        if (isSignedIn) {
          navigate('/home');
          return;
        }

        setAuthError(null);
        setIsSubmitting(true);

        try {
          const result = await signIn.create({
            identifier: email,
            password,
          });

          if (result.status === 'complete') {
            if (setActive) {
              await setActive({ session: result.createdSessionId });
            }
            navigate('/home');
          } else {
            setAuthError('Sign-in requires additional verification.');
          }
        } catch (error: unknown) {
          const { message } = getClerkError(error, 'Unable to sign in. Please try again.');
          if (message.toLowerCase().includes('session already exists')) {
            navigate('/home');
            return;
          }
          setAuthError(message);
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <div className="space-y-2">
        <label className="ml-1 block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t('email')}</label>
        <div className="group relative">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary">email</span>
          <input
            className="w-full rounded-2xl border border-slate-200/80 bg-white/80 py-4 pl-11 pr-4 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
            placeholder="name@company.com"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="ml-1 flex items-center justify-between">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t('password')}</label>
          <Link to="/forgot-pass" className="text-xs font-bold text-primary hover:underline">
            {t('forgot_pass')}
          </Link>
        </div>
        <div className="group relative">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary">lock</span>
          <input
            className="w-full rounded-2xl border border-slate-200/80 bg-white/80 py-4 pl-11 pr-4 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
            placeholder="••••••••"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-slate-950 py-4 text-lg font-black text-white shadow-[0_20px_36px_rgba(15,23,42,0.18)] transition-all active:scale-[0.98] hover:-translate-y-0.5 hover:bg-slate-900 disabled:opacity-60 dark:bg-primary dark:text-slate-950 dark:shadow-[0_20px_36px_rgba(248,175,36,0.18)]"
        disabled={!isAuthReady || isBusy || isBlockedBySession}
      >
        {isSubmitting ? `${t('login_btn')}...` : t('login_btn')}
      </button>

      {authError && <p className="text-center text-sm font-semibold text-red-500">{authError}</p>}

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="bg-transparent px-4 text-slate-300 dark:text-slate-500">{t('or_continue')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 py-3.5 text-sm font-bold text-slate-900 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/8"
          onClick={() => handleOAuth('oauth_google')}
          type="button"
          disabled={!isAuthReady || isBusy || isBlockedBySession}
        >
          <img className="h-5 w-5" src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
          {isOAuthSubmitting ? t('redirecting') : 'Google'}
        </button>
        <button
          className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 py-3.5 text-sm font-bold text-slate-900 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/8"
          onClick={() => handleOAuth('oauth_facebook')}
          type="button"
          disabled={!isAuthReady || isBusy || isBlockedBySession}
        >
          <img className="h-5 w-5" src="https://www.facebook.com/images/fb_icon_325x325.png" alt="Facebook" />
          {isOAuthSubmitting ? t('redirecting') : 'Facebook'}
        </button>
        <button
          className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 py-3.5 text-sm font-bold text-slate-900 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/8"
          onClick={() => handleOAuth('oauth_line')}
          type="button"
          disabled={!isAuthReady || isBusy || isBlockedBySession}
        >
          <img className="h-5 w-5" src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE" />
          {isOAuthSubmitting ? t('redirecting') : 'LINE'}
        </button>
      </div>
    </form>
  );
};

export default ClerkAuth;
