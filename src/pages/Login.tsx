
import React from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import ClerkAuth from '../components/Login/ClerkAuth';
import Header from '../components/Common/Header';

interface LoginProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const Login: React.FC<LoginProps> = ({ isDarkMode, toggleTheme }) => {
  const { t } = useLanguage();
  const backgroundStyle = {
    background: isDarkMode
      ? 'radial-gradient(circle at 10% 0%, rgba(247, 176, 37, 0.22), transparent 50%), radial-gradient(circle at 90% 20%, rgba(77, 122, 182, 0.22), transparent 45%), linear-gradient(180deg, #0b1016 0%, #111926 100%)'
      : 'radial-gradient(circle at 10% 0%, rgba(247, 176, 37, 0.25), transparent 50%), radial-gradient(circle at 90% 20%, rgba(27, 99, 171, 0.16), transparent 45%), linear-gradient(180deg, #f7f6f2 0%, #f2f6fb 100%)',
  } as React.CSSProperties;

  return (
    <>
      <SignedIn>
        <Navigate to="/home" replace />
      </SignedIn>
      <SignedOut>
        <div
          className="min-h-screen w-full flex flex-col animate-fadeIn transition-colors duration-300 relative overflow-hidden"
          style={backgroundStyle}
        >
          <div
            className={`absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl ${
              isDarkMode ? 'bg-amber-400/20' : 'bg-amber-300/60'
            }`}
            aria-hidden="true"
          />
          <div
            className={`absolute -right-10 top-10 h-[360px] w-[360px] rounded-full blur-3xl ${
              isDarkMode ? 'bg-sky-400/20' : 'bg-sky-300/60'
            }`}
            aria-hidden="true"
          />
          <div
            className={`absolute -left-20 bottom-[-140px] h-[320px] w-[320px] rounded-full blur-3xl ${
              isDarkMode ? 'bg-slate-600/20' : 'bg-indigo-200/60'
            }`}
            aria-hidden="true"
          />

          <Header isDarkMode={!!isDarkMode} toggleTheme={toggleTheme ?? (() => {})} />

          <main className="flex-grow flex items-center justify-center p-4 pt-24 relative z-10">
            <div className="w-full max-w-[460px] bg-white dark:bg-surface-dark shadow-2xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] p-8 sm:p-12 border border-white dark:border-white/5 relative overflow-hidden">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black mb-3 text-secondary dark:text-white tracking-tight leading-tight">{t('welcome_back')}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('login_desc')}</p>
              </div>

              <ClerkAuth t={t} />

              <div className="mt-12 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {t('no_account')}
                  <Link to="/signup" className="ml-2 font-black text-secondary dark:text-primary hover:underline underline-offset-4">
                    {t('signup_free')}
                  </Link>
                </p>
              </div>
            </div>
          </main>

          <footer className="py-10 text-center relative z-10">
            <div className="flex justify-center items-center gap-8 text-xs font-bold text-slate-400">
              <a href="#" className="hover:text-secondary dark:hover:text-slate-300 transition-colors">{t('privacy')}</a>
              <span className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></span>
              <a href="#" className="hover:text-secondary dark:hover:text-slate-300 transition-colors">{t('terms')}</a>
              <span className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></span>
              <a href="#" className="hover:text-secondary dark:hover:text-slate-300 transition-colors">{t('help')}</a>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-slate-300 dark:text-slate-800 font-bold">© 2024 Pictures Talk AI.</p>
          </footer>
        </div>
      </SignedOut>
    </>
  );
};

export default Login;
