import React from 'react';
import { useLanguage } from '../../LanguageContext';

const ResultsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-[1400px] mx-auto animate-fadeIn">
      <nav className="flex items-center space-x-2 text-sm text-slate-400 dark:text-slate-500 mb-2">
        <span className="hover:text-secondary dark:hover:text-white cursor-pointer">{t('home')}</span>
        <span className="material-icons-round text-base">chevron_right</span>
        <span className="hover:text-secondary dark:hover:text-white cursor-pointer">{t('summary')}</span>
        <span className="material-icons-round text-base">chevron_right</span>
        <span className="font-medium text-secondary dark:text-white">{t('results')}</span>
      </nav>
      <h2 className="text-2xl md:text-3xl font-bold text-secondary dark:text-white">{t('results')}</h2>
    </div>
  );
};

export default ResultsPage;
