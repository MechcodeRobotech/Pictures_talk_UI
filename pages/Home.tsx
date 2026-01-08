
import React from 'react';
import { RecentWorkItem } from '../types';
import { useLanguage } from '../LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const recentWork: RecentWorkItem[] = [
    { id: '1', title: 'Q4 Strategy Meeting', date: 'Oct 24, 2023', duration: '45 mins', icon: 'graphic_eq', gradient: 'from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40' },
    { id: '2', title: 'Product Launch Brainstorm', date: 'Oct 22, 2023', duration: '1 hr 20m', icon: 'pie_chart', gradient: 'from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30' },
    { id: '3', title: 'Weekly Team Sync', date: 'Oct 20, 2023', duration: '30 mins', icon: 'people', gradient: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30' },
    { id: '4', title: 'Client Kickoff - Alpha', date: 'Oct 18, 2023', duration: '55 mins', icon: 'lightbulb', gradient: 'from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-secondary dark:text-white tracking-tight">{t('welcome_user')}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t('home_desc')}</p>
      </div>

      <section className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12 text-center mb-12 relative overflow-hidden group hover:border-primary/30 transition-all">
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-100 dark:bg-yellow-900/10 rounded-full -translate-x-10 -translate-y-10 opacity-50 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-50 dark:bg-blue-900/10 rounded-full translate-x-10 translate-y-10 opacity-50 blur-2xl"></div>
        
        <h3 className="text-2xl md:text-3xl font-bold text-secondary dark:text-white mb-10 relative z-10">{t('upload_title')}</h3>
        
        <div className="flex justify-center space-x-10 md:space-x-20 mb-12 relative z-10">
          <button className="flex flex-col items-center group/btn">
            <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-3 group-hover/btn:bg-primary group-hover/btn:scale-110 transition-all duration-300 shadow-sm">
              <span className="material-icons-round text-4xl text-primary group-hover/btn:text-white">play_arrow</span>
            </div>
            <span className="font-semibold text-secondary dark:text-slate-200">{t('video')}</span>
          </button>
          
          <button className="flex flex-col items-center group/btn">
            <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover/btn:bg-secondary group-hover/btn:scale-110 transition-all duration-300 shadow-sm">
              <span className="material-icons-round text-4xl text-secondary dark:text-blue-300 group-hover/btn:text-white">mic</span>
            </div>
            <span className="font-semibold text-secondary dark:text-slate-200">{t('audio')}</span>
          </button>
        </div>

        <div className="max-w-md mx-auto relative z-10">
          <label className="cursor-pointer">
            <div className="w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 hover:border-primary transition-all group/upload">
              <span className="material-icons-round text-slate-300 dark:text-slate-600 mb-3 text-4xl group-hover/upload:text-primary transition-colors">cloud_upload</span>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('drag_drop')}</p>
            </div>
            <input className="hidden" type="file" />
          </label>
          
          <div className="mt-8 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(248,175,36,0.5)]" 
              style={{ width: '45%' }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-3 tracking-wide">
            <span className="flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              {t('uploading')}
            </span>
            <span className="text-primary font-black">45%</span>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-xl font-bold text-secondary dark:text-white">{t('recent_work')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('recent_work_desc')}</p>
          </div>
          <button className="text-sm font-bold text-primary hover:text-primary-hover transition-colors flex items-center">
            {t('view_all')} <span className="material-icons-round ml-1 text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentWork.map((item) => (
            <div 
              key={item.id} 
              className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className={`h-32 rounded-xl bg-gradient-to-br ${item.gradient} mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform`}>
                <span className="material-icons-round text-secondary/20 dark:text-white/20 text-5xl">{item.icon}</span>
              </div>
              <h4 className="font-bold text-secondary dark:text-white text-base mb-2 truncate group-hover:text-primary transition-colors">{item.title}</h4>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
                <span className="material-icons-round text-[14px]">calendar_today</span>
                <span>{item.date}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                <span>{item.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
