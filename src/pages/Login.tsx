
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

interface LoginProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const Login: React.FC<LoginProps> = ({ isDarkMode, toggleTheme }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

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
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="material-icons-round">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-secondary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-icons-round text-lg">language</span>
              <span className="uppercase hidden xs:inline">{language === 'en' ? 'English' : 'ไทย'}</span>
              <span className="uppercase xs:hidden">{language}</span>
              <span className="material-icons-round text-base">expand_more</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-xl shadow-xl overflow-hidden z-50 animate-fadeIn">
                <button 
                  onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 ${language === 'en' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => { setLanguage('th'); setIsLangOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 ${language === 'th' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  ไทย
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-[460px] bg-white dark:bg-surface-dark shadow-2xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] p-8 sm:p-12 border border-white dark:border-white/5 relative overflow-hidden">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black mb-3 text-secondary dark:text-white tracking-tight leading-tight">{t('welcome_back')}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('login_desc')}</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{t('email')}</label>
              <div className="relative group">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">email</span>
                <input
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20 text-secondary dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                  placeholder="name@company.com"
                  type="email"
                  required
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
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary dark:bg-primary text-white dark:text-secondary font-black text-lg py-4 rounded-2xl shadow-xl shadow-secondary/10 dark:shadow-primary/20 transition-all transform active:scale-[0.98] hover:opacity-95"
            >
              {t('login_btn')}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
              <span className="px-4 bg-white dark:bg-surface-dark text-slate-300">{t('or_continue')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm font-bold text-secondary dark:text-white">
              <img className="w-5 h-5" src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
              Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm font-bold text-secondary dark:text-white">
              <img className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" />
              Microsoft
            </button>
          </div>

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
