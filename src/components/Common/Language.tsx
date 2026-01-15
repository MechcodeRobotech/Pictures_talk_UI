import React, { useState } from 'react';
import { useLanguage } from '../../LanguageContext';

type LanguageSwitcherVariant = 'header' | 'login';

interface LanguageSwitcherProps {
  variant?: LanguageSwitcherVariant;
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'header', className }) => {
  const { language, setLanguage } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const isHeader = variant === 'header';

  const buttonClassName = isHeader
    ? 'flex items-center space-x-1 text-sm font-medium text-slate-500 dark:text-slate-300 cursor-pointer hover:text-secondary dark:hover:text-white transition-colors'
    : 'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-secondary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors';

  const menuClassName = isHeader
    ? 'absolute right-0 mt-2 w-32 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden animate-fadeIn'
    : 'absolute right-0 mt-2 w-32 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-xl shadow-xl overflow-hidden z-50 animate-fadeIn';

  const menuItemClassName = (lang: 'en' | 'th') =>
    `w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 ${
      language === lang ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400'
    }`;

  return (
    <div className={`relative ${className ?? ''}`.trim()}>
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
        className={buttonClassName}
      >
        <span className={`material-icons-round ${isHeader ? 'text-[24px]' : 'text-lg'}`}>language</span>
        {isHeader ? (
          <span className="hidden xs:inline uppercase">{language === 'en' ? 'English' : 'ไทย'}</span>
        ) : (
          <>
            <span className="uppercase hidden xs:inline">{language === 'en' ? 'English' : 'ไทย'}</span>
            <span className="uppercase xs:hidden">{language}</span>
          </>
        )}
        <span className={`material-icons-round ${isHeader ? 'text-[24px]' : 'text-base'}`}>expand_more</span>
      </button>

      {isLangOpen && (
        <div className={menuClassName}>
          <button
            onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
            className={menuItemClassName('en')}
          >
            English
          </button>
          <button
            onClick={() => { setLanguage('th'); setIsLangOpen(false); }}
            className={menuItemClassName('th')}
          >
            ไทย
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
