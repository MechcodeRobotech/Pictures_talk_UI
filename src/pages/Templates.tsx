
import React, { useState } from 'react';
import { TemplateItem } from '../types';
import { useLanguage } from '../LanguageContext';

const Templates: React.FC = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('filter_all');

  const filters = [
    { key: 'filter_all', label: t('filter_all') },
    { key: 'filter_brainstorming', label: t('filter_brainstorming') },
    { key: 'filter_weekly', label: t('filter_weekly') },
    { key: 'filter_strategy', label: t('filter_strategy') },
    { key: 'filter_client', label: t('filter_client') },
    { key: 'filter_agile', label: t('filter_agile') }
  ];

  const templates: TemplateItem[] = [
    { id: '1', name: t('tpl_mindmap'), description: t('tpl_mindmap_desc'), usageCount: '1.2k', image: 'https://picsum.photos/seed/map/400/300', isPopular: true },
    { id: '2', name: t('tpl_kanban'), description: t('tpl_kanban_desc'), usageCount: '850', image: 'https://picsum.photos/seed/board/400/300' },
    { id: '3', name: t('tpl_swot'), description: t('tpl_swot_desc'), usageCount: '2.1k', image: 'https://picsum.photos/seed/swot/400/300', isNew: true },
    { id: '4', name: t('tpl_timeline'), description: t('tpl_timeline_desc'), usageCount: '900', image: 'https://picsum.photos/seed/time/400/300' },
    { id: '5', name: t('tpl_executive'), description: t('tpl_executive_desc'), usageCount: '3k', image: 'https://picsum.photos/seed/exec/400/300' },
    { id: '6', name: t('tpl_roadmap'), description: t('tpl_roadmap_desc'), usageCount: '1.1k', image: 'https://picsum.photos/seed/road/400/300' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto animate-fadeIn">
      <div className="flex flex-col gap-3 mb-10">
        <h1 className="text-4xl font-black leading-tight tracking-tight text-secondary dark:text-white">{t('template_gallery')}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">{t('template_page_desc')}</p>
      </div>

      <div className="sticky top-0 z-10 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md mb-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex h-10 shrink-0 items-center justify-center px-6 rounded-full transition-all text-sm font-bold shadow-sm ${
                activeFilter === filter.key 
                  ? 'bg-secondary text-white dark:bg-primary dark:text-secondary' 
                  : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 hover:border-primary'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
        {templates.map(tpl => (
          <div key={tpl.id} className="group flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-transparent dark:hover:border-primary/20">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={tpl.image} alt={tpl.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button className="bg-white dark:bg-primary text-secondary dark:text-secondary font-black py-3 px-8 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {t('use_template')}
                </button>
              </div>
              <div className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-500">
                <span className="material-icons-round text-xl">favorite</span>
              </div>
            </div>
            
            <div className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="text-secondary dark:text-white text-lg font-bold truncate">{tpl.name}</h3>
                <div className="flex gap-1">
                   {tpl.isPopular && <span className="text-[10px] font-black uppercase tracking-wider text-secondary bg-primary px-2 py-0.5 rounded-full">{t('popular')}</span>}
                   {tpl.isNew && <span className="text-[10px] font-black uppercase tracking-wider text-white bg-green-500 px-2 py-0.5 rounded-full">{t('new_badge')}</span>}
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1">{tpl.description}</p>
              <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs font-bold">
                <span className="material-icons-round text-sm">visibility</span>
                <span>{tpl.usageCount} {t('uses')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
