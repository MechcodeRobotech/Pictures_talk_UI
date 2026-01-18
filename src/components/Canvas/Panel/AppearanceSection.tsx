import React from 'react';
import { Theme } from '../../../types';

interface AppearanceSectionProps {
  theme: Theme;
  t: (key: string) => string;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#ffffff',
  '#f3f4f6',
  '#e5e7eb',
  '#1e1e1e',
  '#1f2937',
  '#374151',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
];

const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  theme,
  t,
  backgroundColor,
  onBackgroundColorChange,
}) => {
  const handleColorChange = (color: string) => {
    onBackgroundColorChange(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBackgroundColorChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{t('appearance')}</span>
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl border border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
              <div className="size-full" style={{ backgroundColor }}></div>
            </div>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('fill')}
            </span>
          </div>
          <div className="grid grid-cols-8 gap-1.5">
            {PRESET_COLORS.map((color, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleColorChange(color)}
                className={`size-8 rounded-lg border-2 transition-all ${
                  backgroundColor.toLowerCase() === color.toLowerCase()
                    ? 'border-primary ring-2 ring-primary/30 scale-105'
                    : theme === 'dark'
                      ? 'border-white/10 hover:border-white/30'
                      : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <div
            className={`flex items-center gap-3 p-3 rounded-xl border ${
              theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <input
              type="color"
              value={backgroundColor}
              onChange={handleCustomColorChange}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
            />
            <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {backgroundColor.toUpperCase()}
            </span>
          </div>
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
  );
};

export default AppearanceSection;
