import React, { useEffect, useState } from 'react';
import { Theme } from '../../../types';

interface DimensionsSectionProps {
  theme: Theme;
  t: (key: string) => string;
  width: number;
  height: number;
  onDimensionChange: (width: number, height: number) => void;
}

const PRESET_SIZES = [
  { label: 'Square', meta: '1:1', w: 600, h: 600 },
  { label: 'Presentation', meta: '16:9', w: 960, h: 540 },
  { label: 'Classic', meta: '4:3', w: 800, h: 600 },
  { label: 'Story', meta: '9:16', w: 540, h: 960 },
];

const DimensionsSection: React.FC<DimensionsSectionProps> = ({ theme, t, width, height, onDimensionChange }) => {
  const [isRatioLocked, setIsRatioLocked] = useState(true);
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    if (width > 0 && height > 0) {
      setRatio(width / height);
    }
  }, [width, height]);

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!value || value <= 0) return;
    if (isRatioLocked && ratio) {
      onDimensionChange(value, Math.round(value / ratio));
      return;
    }
    onDimensionChange(value, height);
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!value || value <= 0) return;
    if (isRatioLocked && ratio) {
      onDimensionChange(Math.round(value * ratio), value);
      return;
    }
    onDimensionChange(width, value);
  };

  const currentRatio = width && height ? `${(width / height).toFixed(2)}:1` : '-';

  return (
    <div className="space-y-3.5">
      <div className={`rounded-2xl border ${
        theme === 'dark' ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/70'
      }`}>
        <div className={`grid grid-cols-2 divide-x ${theme === 'dark' ? 'divide-white/8' : 'divide-slate-200'}`}>
          <label className="px-4 py-3">
            <span className={`mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {t('width_short')}
            </span>
            <div className="flex items-end gap-2">
              <input
                type="number"
                value={width}
                onChange={handleWidthChange}
                className={`w-full bg-transparent text-2xl font-semibold outline-none ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              />
              <span className={`pb-1 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>px</span>
            </div>
          </label>

          <label className="px-4 py-3">
            <span className={`mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {t('height_short')}
            </span>
            <div className="flex items-end gap-2">
              <input
                type="number"
                value={height}
                onChange={handleHeightChange}
                className={`w-full bg-transparent text-2xl font-semibold outline-none ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              />
              <span className={`pb-1 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>px</span>
            </div>
          </label>
        </div>
      </div>

      <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
        theme === 'dark' ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/70'
      }`}>
        <button
          type="button"
          onClick={() => setIsRatioLocked((current) => !current)}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            isRatioLocked
              ? 'bg-primary/14 text-primary'
              : theme === 'dark'
                ? 'text-slate-400 hover:bg-white/[0.05]'
                : 'text-slate-600 hover:bg-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">{isRatioLocked ? 'lock' : 'lock_open'}</span>
          {t('aspect_ratio')}
        </button>

        <span className={`rounded-xl px-3 py-2 text-sm font-medium ${
          theme === 'dark' ? 'bg-[#0b1220] text-slate-300' : 'bg-white text-slate-600'
        }`}>
          {currentRatio}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PRESET_SIZES.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              onDimensionChange(preset.w, preset.h);
              setRatio(preset.w / preset.h);
            }}
            className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
              theme === 'dark'
                ? 'border-white/8 bg-white/[0.02] hover:bg-white/[0.05]'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <span className={`block text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {preset.label}
            </span>
            <span className={`mt-1 block text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {preset.meta} • {preset.w} × {preset.h}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DimensionsSection;
