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
    ? 'inline-flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all bg-white/72 text-slate-700 border-white/70 shadow-[0_12px_24px_rgba(15,23,42,0.08)] hover:text-slate-900 hover:shadow-[0_16px_28px_rgba(15,23,42,0.12)] dark:bg-white/5 dark:text-slate-100 dark:border-white/10'
    : 'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors';

  const menuClassName = isHeader
    ? 'absolute right-0 mt-2 w-36 bg-white/95 border border-white/80 dark:bg-slate-950/90 dark:border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.18)] overflow-hidden animate-fadeIn backdrop-blur-xl'
    : 'absolute right-0 mt-2 w-32 bg-white/95 dark:bg-slate-950/90 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-fadeIn';

  const menuItemClassName = (lang: 'en' | 'th') =>
    `w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-white/5 ${
      language === lang ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300'
    }`;

  return (
    <div className={`relative ${className ?? ''}`.trim()}>
      <button type="button" onClick={() => setIsLangOpen((prev) => !prev)} className={buttonClassName}>
        <span className={`material-icons-round ${isHeader ? 'text-[20px]' : 'text-lg'}`}>language</span>
        {isHeader ? (
          <span className="hidden xs:inline uppercase">{language === 'en' ? 'English' : 'ไทย'}</span>
        ) : (
          <>
            <span className="uppercase hidden xs:inline">{language === 'en' ? 'English' : 'ไทย'}</span>
            <span className="uppercase xs:hidden">{language}</span>
          </>
        )}
        <span className={`material-icons-round transition-transform ${isHeader ? 'text-[20px]' : 'text-base'} ${isLangOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isLangOpen && (
        <div className={menuClassName}>
          <button type="button" onClick={() => { setLanguage('en'); setIsLangOpen(false); }} className={menuItemClassName('en')}>
            English
          </button>
          <button type="button" onClick={() => { setLanguage('th'); setIsLangOpen(false); }} className={menuItemClassName('th')}>
            ไทย
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
