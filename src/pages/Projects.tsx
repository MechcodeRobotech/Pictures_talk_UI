
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    handleCloseModal();
    // เมื่อสร้างเสร็จให้นำทางไปหน้า Canvas ทันที
    navigate('/canvas');
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-fadeIn relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-secondary dark:text-white tracking-tight">{t('all_projects')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('projects_desc')}</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-primary hover:bg-primary-hover text-secondary font-bold py-3 px-6 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95"
        >
          <span className="material-icons-round">add</span>
          {t('new_project')}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark text-sm font-bold whitespace-nowrap">
          <span className="text-slate-400 font-normal">{t('sort_by')}:</span> Date <span className="material-icons-round text-sm">keyboard_arrow_down</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark text-sm font-bold whitespace-nowrap">
          <span className="text-slate-400 font-normal">{t('view_mode')}:</span> Grid <span className="material-icons-round text-sm">grid_view</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-4">
          <span className="material-icons-round text-4xl text-slate-300">folder_open</span>
        </div>
        <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">{t('no_projects')}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center max-w-xs">{t('no_projects_desc')}</p>
        <button onClick={handleOpenModal} className="text-primary font-bold hover:underline">{t('get_started')}</button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-secondary/40 dark:bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={handleCloseModal}
          ></div>

          <div className="relative w-full max-w-2xl bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl border border-white dark:border-white/5 overflow-hidden animate-fadeIn transform">
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-secondary dark:text-white">{t('create_new_project')}</h2>
                <button onClick={handleCloseModal} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors">
                  <span className="material-icons-round">close</span>
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleCreateProject}>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{t('project_name_label')}</label>
                  <input type="text" required placeholder={t('project_name_placeholder')} className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 dark:bg-black/20 text-secondary dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{t('description_label')}</label>
                  <textarea rows={3} className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 dark:bg-black/20 text-secondary dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 transition-all outline-none resize-none"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{t('upload_title')}</label>
                  <div className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 dark:bg-black/10 hover:border-primary transition-all cursor-pointer group">
                    <span className="material-icons-round text-slate-300 dark:text-slate-600 mb-2 text-3xl group-hover:text-primary transition-colors">cloud_upload</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('drag_drop')}</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={handleCloseModal} className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all">{t('cancel')}</button>
                  <button type="submit" className="flex-[1.5] py-4 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-secondary font-black shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]">{t('create')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
