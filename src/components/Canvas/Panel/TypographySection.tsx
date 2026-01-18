import React from 'react';
import { Theme } from '../../../types';

interface TypographySectionProps {
  theme: Theme;
  t: (key: string) => string;
}

const TypographySection: React.FC<TypographySectionProps> = ({ theme, t }) => (
  <div className="space-y-4">
    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{t('typography')}</span>
    <div className="space-y-3">
      <div
        className={`w-full rounded-2xl px-4 py-3 flex justify-between items-center cursor-pointer border transition-all ${
          theme === 'dark'
            ? 'bg-black/40 border-white/10 text-white hover:bg-black/60'
            : 'bg-gray-50 border-gray-200 text-navy hover:bg-gray-100'
        }`}
      >
        <span className="text-sm font-bold tracking-tight">Inter</span>
        <span className="material-symbols-outlined text-[20px] text-gray-500">expand_more</span>
      </div>
      <div className="flex gap-2">
        <div
          className={`flex-1 rounded-2xl px-4 py-3 flex justify-between items-center cursor-pointer border transition-all ${
            theme === 'dark'
              ? 'bg-black/40 border-white/10 text-white hover:bg-black/60'
              : 'bg-gray-50 border-gray-200 text-navy hover:bg-gray-100'
          }`}
        >
          <span className="text-sm">{t('regular')}</span>
        </div>
        <div
          className={`w-20 rounded-2xl px-4 py-3 flex justify-center items-center cursor-pointer border transition-all ${
            theme === 'dark'
              ? 'bg-black/40 border-white/10 text-white hover:bg-black/60'
              : 'bg-gray-50 border-gray-200 text-navy hover:bg-gray-100'
          }`}
        >
          <span className="text-sm font-bold">16</span>
        </div>
      </div>
      <div
        className={`flex p-1.5 rounded-2xl border w-full justify-between ${
          theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <button type="button" className="flex-1 py-2 bg-primary rounded-xl text-navy shadow-lg transition-transform active:scale-95">
          <span className="material-symbols-outlined text-[20px] filled">format_align_left</span>
        </button>
        <button
          type="button"
          className="flex-1 py-2 hover:bg-white/5 rounded-xl text-gray-500 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">format_align_center</span>
        </button>
        <button
          type="button"
          className="flex-1 py-2 hover:bg-white/5 rounded-xl text-gray-500 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">format_align_right</span>
        </button>
      </div>
    </div>
  </div>
);

export default TypographySection;
