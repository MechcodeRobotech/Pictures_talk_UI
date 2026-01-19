import React, { useState, useEffect } from 'react';
import { Theme } from '../../../types';

interface DimensionsSectionProps {
  theme: Theme;
  t: (key: string) => string;
  width: number;
  height: number;
  onDimensionChange: (width: number, height: number) => void;
}

const DimensionsSection: React.FC<DimensionsSectionProps> = ({ theme, t, width, height, onDimensionChange }) => {
  const [isRatioLocked, setIsRatioLocked] = useState(true);
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    if (width > 0 && height > 0) {
      setRatio(width / height);
    }
  }, []);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value && value > 0) {
      if (isRatioLocked && ratio) {
        onDimensionChange(value, Math.round(value / ratio));
      } else {
        onDimensionChange(value, height);
      }
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value && value > 0) {
      if (isRatioLocked && ratio) {
        onDimensionChange(Math.round(value * ratio), value);
      } else {
        onDimensionChange(width, value);
      }
    }
  };

  const handleBlur = () => {
    if (width <= 0 || height <= 0) {
      onDimensionChange(800, 600);
    }
  };

  const currentRatio = width && height ? `${(width / height).toFixed(2)}:1` : '-';

  return (
    <div className="space-y-2.5 sm:space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div
          className={`flex flex-col gap-1.5 p-2.5 sm:p-3 rounded-xl border transition-all group ${
            theme === 'dark'
              ? 'bg-black/30 border-white/5 focus-within:border-primary/50 focus-within:bg-black/50'
              : 'bg-gray-50 border-gray-200 focus-within:border-primary/50 focus-within:bg-white'
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 truncate">{t('width_short')}</span>
            <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              open_in_full
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <input
              type="number"
              value={width}
              onChange={handleWidthChange}
              onBlur={handleBlur}
              className="bg-transparent border-none outline-none text-base sm:text-lg font-bold text-primary w-full"
            />
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium shrink-0">px</span>
          </div>
        </div>
        <div
          className={`flex flex-col gap-1.5 p-2.5 sm:p-3 rounded-xl border transition-all group ${
            theme === 'dark'
              ? 'bg-black/30 border-white/5 focus-within:border-primary/50 focus-within:bg-black/50'
              : 'bg-gray-50 border-gray-200 focus-within:border-primary/50 focus-within:bg-white'
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 truncate">{t('height_short')}</span>
            <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              close_fullscreen
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <input
              type="number"
              value={height}
              onChange={handleHeightChange}
              onBlur={handleBlur}
              className="bg-transparent border-none outline-none text-base sm:text-lg font-bold text-primary w-full"
            />
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium shrink-0">px</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsRatioLocked(!isRatioLocked)}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
            isRatioLocked
              ? 'bg-primary/20 text-primary'
              : theme === 'dark'
                ? 'bg-black/30 text-gray-400 hover:bg-black/50'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px] shrink-0">
            {isRatioLocked ? 'link' : 'link_off'}
          </span>
          <span className="text-[10px] sm:text-xs font-medium truncate">{t('aspect_ratio') || 'Aspect Ratio'}</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-black/10 min-w-0">
          <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-gray-400 shrink-0">aspect_ratio</span>
          <span className="text-[10px] sm:text-xs font-mono text-gray-500 truncate">{currentRatio}</span>
        </div>
      </div>

      {/* Preset sizes */}
      <div className="flex gap-1.5 sm:gap-2 pt-1">
        {[
          { label: '1:1', w: 600, h: 600 },
          { label: '16:9', w: 960, h: 540 },
          { label: '4:3', w: 800, h: 600 },
          { label: '9:16', w: 540, h: 960 },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              onDimensionChange(preset.w, preset.h);
              setRatio(preset.w / preset.h);
            }}
            className={`flex-1 px-1.5 sm:px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
              theme === 'dark'
                ? 'bg-black/30 text-gray-400 hover:bg-black/50 hover:text-gray-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DimensionsSection;
