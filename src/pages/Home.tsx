
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecentWorkItem } from '../types';
import { useLanguage } from '../LanguageContext';
import VideoButton from '../components/Home/VideoButton';
import AudioButton from '../components/Home/AudioButton';
import DragDropUpload from '../components/Home/DragDropUpload';
import UploadProgress from '../components/Home/UploadProgress';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const storageKey = 'summaryResults';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  const saveSummaryResult = (resultId: string, name: string) => {
    try {
      const raw = localStorage.getItem(storageKey);
      const existing = raw ? (JSON.parse(raw) as { id: string; name: string; createdAt: number }[]) : [];
      const next = [
        { id: resultId, name, createdAt: Date.now() },
        ...existing.filter((item) => item.id !== resultId),
      ].slice(0, 12);
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Ignore storage errors to avoid blocking navigation.
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setSelectedFileName(file.name);
    setUploadError(null);
    setUploadPercent(0);
  };
  const handleValidationError = (message?: string) => {
    setSelectedFile(null);
    setSelectedFileName(null);
    setUploadError(message ?? t('upload_failed'));
    setUploadPercent(0);
  };
  const handleClearFile = () => {
    setSelectedFile(null);
    setSelectedFileName(null);
    setUploadError(null);
    setUploadPercent(0);
  };
  const handleExport = async (file: File) => {
    if (isExporting) return;
    setIsExporting(true);
    setUploadError(null);
    setUploadPercent(0);

    try {
      const data = await new Promise<{ meeting_id?: number }>((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name); // Use filename as title
        formData.append('user_id', '1'); // TODO: replace with authenticated user id.
        formData.append('custom_language', 'th'); // Set language to Thai for Fireflies processing

        const xhr = new XMLHttpRequest();
        const uploadUrl = apiBaseUrl
          ? new URL('/api/fireflies/upload-video', apiBaseUrl).toString()
          : '/api/fireflies/upload-video';
        xhr.open('POST', uploadUrl);

        xhr.upload.addEventListener('progress', (event) => {
          if (!event.lengthComputable) return;
          const nextPercent = Math.round((event.loaded / event.total) * 100);
          setUploadPercent(nextPercent);
        });

        xhr.addEventListener('load', () => {
          const ok = xhr.status >= 200 && xhr.status < 300;
          if (!ok) {
            let detail = xhr.statusText || 'Upload failed';
            try {
              const payload = xhr.responseText ? JSON.parse(xhr.responseText) : null;
              if (payload && typeof payload === 'object') {
                detail =
                  (payload.message as string) ||
                  (payload.error as string) ||
                  (payload.detail as string) ||
                  detail;
              }
            } catch {
              // Keep existing detail if response isn't JSON.
            }
            if (xhr.status === 404 || xhr.status === 405) {
              detail = `Upload API not available (HTTP ${xhr.status}). Set VITE_API_BASE_URL to your backend.`;
            }
            reject(new Error(detail));
            return;
          }
          setUploadPercent(100);
          try {
            const payload = xhr.responseText ? JSON.parse(xhr.responseText) : {};
            resolve(payload as { meeting_id?: number });
          } catch (error) {
            reject(error);
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.send(formData);
      });

      const meetingId = data.meeting_id;
      const normalizedName = file.name.trim() || t('untitled');
      const resultId = meetingId ? String(meetingId) : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      saveSummaryResult(resultId, normalizedName);
      navigate(`/summary/${resultId}`, { state: { fileName: normalizedName, meetingId } });
    } catch (error) {
      const message = error instanceof Error ? error.message : t('upload_failed');
      setUploadError(message);
      setUploadPercent(0);
    } finally {
      setIsExporting(false);
    }
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
          <AudioButton
            label={t('audio')}
            onFileSelect={handleFileSelect}
            onValidationError={handleValidationError}
          />
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
          <UploadProgress
            percent={selectedFile ? uploadPercent : 0}
            statusLabel={uploadPercent === 100 ? t('ready') : t('not_ready')}
            file={selectedFile}
            fileName={selectedFileName}
            isExporting={isExporting}
            onExport={handleExport}
          />
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
