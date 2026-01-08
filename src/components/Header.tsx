
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 shrink-0 z-20">
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative group">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 rounded-full border-none bg-slate-100 dark:bg-black/20 text-sm focus:ring-2 focus:ring-primary/50 transition-all dark:text-white placeholder-slate-400"
            placeholder={t('search_placeholder')}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <span className="material-icons-round text-[24px] relative top-[1px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center space-x-1 text-sm font-medium text-slate-500 dark:text-slate-300 cursor-pointer hover:text-secondary dark:hover:text-white transition-colors"
          >
            <span className="material-icons-round text-[24px]">language</span>
            <span className="hidden xs:inline uppercase">{language === 'en' ? 'English' : 'ไทย'}</span>
            <span className="material-icons-round text-[24px]">expand_more</span>
          </button>
          
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
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

        <Link
          to="/login"
          className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-secondary dark:text-white px-5 py-2 rounded-full font-bold text-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          {t('login_signin')}
        </Link>
      </div>
    </header>
  );
};

export default Header;
