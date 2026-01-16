
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

  return (
    <>
      <SignedIn>
        <Navigate to="/home" replace />
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen w-full flex flex-col bg-background-light dark:bg-background-dark animate-fadeIn transition-colors duration-300">
          <Header isDarkMode={!!isDarkMode} toggleTheme={toggleTheme ?? (() => {})} />

          <main className="flex-grow flex items-center justify-center p-4 pt-24">
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

          <footer className="py-10 text-center">
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
