
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import ClerkAuth from '../components/Login/ClerkAuth';
import LanguageSwitcher from '../components/Common/Language';
import ThemeToggle from '../components/Common/Theme';

interface LoginProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const Login: React.FC<LoginProps> = ({ isDarkMode, toggleTheme }) => {
  const { t } = useLanguage();

  // กำหนด URL โลโก้สำหรับแต่ละธีม
  const logoLight = "https://static.wixstatic.com/media/b69b08_d3e4b97f3ace4015866b1f2738fafdf0~mv2.png/v1/fill/w_352,h_113,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo_Secondary_onWhite_Secondary_onWhite.png";
  const logoDark = "https://static.wixstatic.com/media/b69b08_d3e4b97f3ace4015866b1f2738fafdf0~mv2.png/v1/fill/w_352,h_113,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo_Secondary_onWhite_Secondary_onWhite.png";

  return (
    <div className="min-h-screen w-full flex flex-col bg-background-light dark:bg-background-dark animate-fadeIn transition-colors duration-300">
      <header className="w-full px-6 py-8 md:px-12 flex justify-between items-center absolute top-0 z-50">
        <Link to="/" className="flex items-center group">
          <div className="h-10 md:h-14 w-auto flex items-center overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
             <img 
                src={isDarkMode ? logoDark : logoLight} 
                alt="Pictures Talk" 
                className={`h-full w-auto object-contain transition-all ${isDarkMode ? 'brightness-200 grayscale-0' : ''}`}
              />
          </div>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle */}
          <ThemeToggle isDarkMode={!!isDarkMode} toggleTheme={toggleTheme ?? (() => {})} variant="login" />

          {/* Language Switcher */}
          <LanguageSwitcher variant="login" />
        </div>
      </header>

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
              <a href="#" className="ml-2 font-black text-secondary dark:text-primary hover:underline underline-offset-4">{t('signup_free')}</a>
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
  );
};

export default Login;
