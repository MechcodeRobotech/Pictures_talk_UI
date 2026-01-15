
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import LanguageSwitcher from './Common/Language';
import ThemeToggle from './Common/Theme';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useLanguage();

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
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} variant="header" />

        <LanguageSwitcher variant="header" />

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
