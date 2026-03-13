import React from 'react';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
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
  const { isLoaded } = useAuth();

  return (
    <>
      <SignedIn>
        <Navigate to="/home" replace />
      </SignedIn>

      {!isLoaded && (
        <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-slate-300 border-t-primary animate-spin" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading authentication...</p>
        </div>
      )}

      <SignedOut>
        <div className="min-h-screen w-full flex flex-col animate-fadeIn transition-colors duration-300 relative overflow-hidden">
          <Header isDarkMode={!!isDarkMode} toggleTheme={toggleTheme ?? (() => {})} />

          <main className="flex-1 px-4 pb-8 pt-6 md:px-8 md:pt-8">
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="app-panel-strong rounded-[32px] p-7 md:p-10 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-primary/18 via-transparent to-sky-400/12" aria-hidden="true" />
                <div className="relative z-10 max-w-xl">
                  <span className="app-kicker">{t('home_badge')}</span>
                  <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
                    {t('welcome_back')}
                  </h1>
                  <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
                    {t('login_desc')}
                  </p>

                  <div className="mt-8 grid gap-3">
                    {[t('login_feature_one'), t('login_feature_two'), t('login_feature_three')].map((item) => (
                      <div key={item} className="app-stat-card flex items-start gap-3 p-4">
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-primary dark:text-slate-950">
                          <span className="material-symbols-outlined text-[20px]">done</span>
                        </div>
                        <p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-[28px] border border-white/60 bg-white/60 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
                    <div className="grid grid-cols-3 gap-3 text-left">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t('home_metric_speed')}</p>
                        <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">10x</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t('home_metric_canvas')}</p>
                        <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">1</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t('home_metric_bilingual')}</p>
                        <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="app-panel-strong rounded-[32px] p-7 sm:p-8 md:p-10">
                <div className="mb-8">
                  <span className="app-kicker">{t('login_signin')}</span>
                  <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t('welcome_back')}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{t('login_desc')}</p>
                </div>

                <ClerkAuth t={t} />

                <div className="mt-10 border-t border-slate-200/70 pt-6 text-center dark:border-white/10">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {t('no_account')}
                    <Link to="/signup" className="ml-2 font-black text-slate-900 underline decoration-primary decoration-2 underline-offset-4 dark:text-primary">
                      {t('signup_free')}
                    </Link>
                  </p>
                </div>
              </section>
            </div>
          </main>

          <footer className="px-4 pb-8 text-center md:px-8">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">{t('privacy')}</a>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">{t('terms')}</a>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">{t('help')}</a>
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-600">
              {t('footer_note')}
            </p>
          </footer>
        </div>
      </SignedOut>
    </>
  );
};

export default Login;
