import React from 'react';
import { Theme } from '../../../types';

interface DimensionsSectionProps {
  theme: Theme;
  t: (key: string) => string;
  width: number;
  height: number;
  onDimensionChange: (width: number, height: number) => void;
}

const DimensionsSection: React.FC<DimensionsSectionProps> = ({ theme, t, width, height, onDimensionChange }) => {
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value && value > 0) {
      onDimensionChange(value, height);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value && value > 0) {
      onDimensionChange(width, value);
    }
  };

  return (
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
            type="number"
            value={width}
            onChange={handleWidthChange}
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
            type="number"
            value={height}
            onChange={handleHeightChange}
            className="bg-transparent border-none outline-none text-sm font-bold text-primary w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default DimensionsSection;
