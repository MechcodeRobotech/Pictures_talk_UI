import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';

type UploadProgressProps = {
  percent: number;
  statusLabel: string;
  fileName?: string | null;
};

const UploadProgress: React.FC<UploadProgressProps> = ({ percent, statusLabel, fileName }) => {
  const safePercent = Math.min(100, Math.max(0, percent));
  const navigate = useNavigate();
  const { t } = useLanguage();
  const storageKey = 'summaryResults';

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

  return (
    <>
      <div className="mt-8 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div
          className="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(248,175,36,0.5)]"
          style={{ width: `${safePercent}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-3 tracking-wide">
        <span className="flex items-center gap-1.5 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          {statusLabel}
        </span>
        <span className="text-primary font-black">{safePercent}%</span>
      </div>
      <button
        className="mt-6 w-full rounded-xl border border-black bg-black text-white font-semibold py-2.5 hover:bg-black/90 transition-colors"
        type="button"
        onClick={() => {
          const normalizedName = fileName?.trim() || t('untitled');
          const resultId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          saveSummaryResult(resultId, normalizedName);
          navigate(`/summary/${resultId}`, { state: { fileName: normalizedName } });
        }}
      >
        Export Audio File
      </button>
    </>
  );
};

export default UploadProgress;
