import React from 'react';

type UploadProgressProps = {
  percent: number;
  statusLabel: string;
};

const UploadProgress: React.FC<UploadProgressProps> = ({ percent, statusLabel }) => {
  const safePercent = Math.min(100, Math.max(0, percent));

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
      >
        Export Audio File
      </button>
    </>
  );
};

export default UploadProgress;
