
import React, { useState } from 'react';
import { RecentWorkItem } from '../types';
import { useLanguage } from '../LanguageContext';
import VideoButton from '../components/Home/VideoButton';
import AudioButton from '../components/Home/AudioButton';
import DragDropUpload from '../components/Home/DragDropUpload';
import UploadProgress from '../components/Home/UploadProgress';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const handleFileSelect = (file: File) => {
    setSelectedFileName(file.name);
    setUploadError(null);
  };
  const handleValidationError = (message?: string) => {
    setSelectedFileName(null);
    setUploadError(message ?? t('upload_failed'));
  };
  const handleClearFile = () => {
    setSelectedFileName(null);
    setUploadError(null);
  };
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
          <VideoButton
            label={t('video')}
            onFileSelect={handleFileSelect}
            onValidationError={handleValidationError}
          />
          <AudioButton label={t('audio')} />
        </div>

        <div className="max-w-md mx-auto relative z-10">
          <DragDropUpload
            helperText={t('drag_drop')}
            selectedFileName={selectedFileName}
            onFileSelect={handleFileSelect}
            onValidationError={handleValidationError}
            onClear={handleClearFile}
          />
          {uploadError && (
            <p className="mt-3 text-sm text-red-500" role="alert">
              {uploadError}
            </p>
          )}
          <UploadProgress percent={45} statusLabel={t('uploading')} />
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
