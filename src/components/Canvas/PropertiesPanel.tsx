import React from 'react';
import { Theme } from '../../types';

interface PropertiesPanelProps {
  theme: Theme;
  t: (key: string) => string;
  isOpen: boolean;
  onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  theme,
  t,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      className={`w-72 backdrop-blur-xl border rounded-3xl shadow-2xl hidden lg:flex flex-col z-10 shrink-0 transition-all animate-fadeIn ${
        theme === 'dark' ? 'bg-[#1a1a1a]/80 border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className={`font-bold text-base tracking-tight ${theme === 'dark' ? 'text-white' : 'text-navy'}`}>
          {t('properties')}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="p-6 flex flex-col gap-8 overflow-y-auto">
        <div className="space-y-4">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{t('dimensions')}</span>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`flex flex-col gap-1.5 p-3 rounded-2xl border transition-colors ${
                theme === 'dark'
                  ? 'bg-black/40 border-white/10 focus-within:border-primary'
                  : 'bg-gray-50 border-gray-200 focus-within:border-primary'
              }`}
            >
              <span className="text-[10px] text-gray-400 font-bold">{t('width_short')}</span>
              <input
                type="text"
                defaultValue="900"
                className="bg-transparent border-none outline-none text-sm font-bold text-primary w-full"
              />
            </div>
            <div
              className={`flex flex-col gap-1.5 p-3 rounded-2xl border transition-colors ${
                theme === 'dark'
                  ? 'bg-black/40 border-white/10 focus-within:border-primary'
                  : 'bg-gray-50 border-gray-200 focus-within:border-primary'
              }`}
            >
              <span className="text-[10px] text-gray-400 font-bold">{t('height_short')}</span>
              <input
                type="text"
                defaultValue="506"
                className="bg-transparent border-none outline-none text-sm font-bold text-primary w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{t('appearance')}</span>
          <div className="space-y-4">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gray-800 border border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
                  <div className="size-full bg-gradient-to-br from-blue-600 to-indigo-900"></div>
                </div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('fill')}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono bg-black/20 px-2 py-1 rounded">#1E40AF</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-transparent border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <div className="size-5 rounded-full border-2 border-primary"></div>
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('stroke')}
                  </span>
                  <span className="text-[10px] text-gray-500">2px • Solid</span>
                </div>
              </div>
              <button
                type="button"
                className="size-8 rounded-lg bg-gray-700 border border-white/10 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px] text-white">edit</span>
              </button>
            </div>
          </div>
        </div>

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
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <button
          type="button"
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            theme === 'dark'
              ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              : 'bg-gray-100 text-gray-600 hover:text-navy hover:bg-gray-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          Need Help?
        </button>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
