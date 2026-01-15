import React, { useEffect, useState } from 'react';
import { useAuth, useSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

type ClerkAuthProps = {
  t: (key: string) => string;
};

const ClerkAuth: React.FC<ClerkAuthProps> = ({ t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthSubmitting, setIsOAuthSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/');
    }
  }, [isSignedIn, navigate]);

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!isLoaded || !signIn) return;
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
            navigate('/');
          } else {
            setAuthError('Sign-in requires additional verification.');
          }
        } catch (error: unknown) {
          const message =
            (typeof error === 'object' &&
              error &&
              'errors' in error &&
              Array.isArray((error as { errors?: Array<{ message?: string }> }).errors) &&
              (error as { errors?: Array<{ message?: string }> }).errors?.[0]?.message) ||
            'Unable to sign in. Please try again.';
          setAuthError(message);
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <div className="space-y-2">
        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{t('email')}</label>
        <div className="relative group">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">email</span>
          <input
            className="w-full pl-11 pr-4 py-4 rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20 text-secondary dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
            placeholder="name@company.com"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t('password')}</label>
          <a href="#" className="text-xs font-bold text-primary hover:underline">{t('forgot_pass')}</a>
        </div>
        <div className="relative group">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">lock</span>
          <input
            className="w-full pl-11 pr-4 py-4 rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20 text-secondary dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
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
        className="w-full bg-secondary dark:bg-primary text-white dark:text-secondary font-black text-lg py-4 rounded-2xl shadow-xl shadow-secondary/10 dark:shadow-primary/20 transition-all transform active:scale-[0.98] hover:opacity-95 disabled:opacity-60"
        disabled={!isLoaded || isSubmitting || isOAuthSubmitting || !signIn}
      >
        {isSubmitting ? `${t('login_btn')}...` : t('login_btn')}
      </button>
      {authError && (
        <p className="text-sm font-semibold text-red-500 text-center">{authError}</p>
      )}

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100 dark:border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
          <span className="px-4 bg-white dark:bg-surface-dark text-slate-300">{t('or_continue')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          className="flex items-center justify-center gap-3 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm font-bold text-secondary dark:text-white disabled:opacity-60"
          onClick={async () => {
            if (!isLoaded || !signIn) return;
            setIsOAuthSubmitting(true);
            await signIn.authenticateWithRedirect({
              strategy: 'oauth_google',
              redirectUrl: '/sso-callback',
              redirectUrlComplete: '/',
            });
          }}
          type="button"
          disabled={!isLoaded || !signIn || isOAuthSubmitting || isSubmitting}
        >
          <img className="w-5 h-5" src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
          {isOAuthSubmitting ? 'Redirecting...' : 'Google'}
        </button>
        <button
          className="flex items-center justify-center gap-3 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm font-bold text-secondary dark:text-white disabled:opacity-60"
          onClick={async () => {
            if (!isLoaded || !signIn) return;
            setIsOAuthSubmitting(true);
            await signIn.authenticateWithRedirect({
              strategy: 'oauth_facebook',
              redirectUrl: '/sso-callback',
              redirectUrlComplete: '/',
            });
          }}
          type="button"
          disabled={!isLoaded || !signIn || isOAuthSubmitting || isSubmitting}
        >
          <img className="w-5 h-5" src="https://www.facebook.com/images/fb_icon_325x325.png" alt="Facebook" />
          {isOAuthSubmitting ? 'Redirecting...' : 'Facebook'}
        </button>
        <button
          className="flex items-center justify-center gap-3 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm font-bold text-secondary dark:text-white disabled:opacity-60"
          onClick={async () => {
            if (!isLoaded || !signIn) return;
            setIsOAuthSubmitting(true);
            await signIn.authenticateWithRedirect({
              strategy: 'oauth_line',
              redirectUrl: '/sso-callback',
              redirectUrlComplete: '/',
            });
          }}
          type="button"
          disabled={!isLoaded || !signIn || isOAuthSubmitting || isSubmitting}
        >
          <img className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE" />
          {isOAuthSubmitting ? 'Redirecting...' : 'LINE'}
        </button>
      </div>
    </form>
  );
};

export default ClerkAuth;
