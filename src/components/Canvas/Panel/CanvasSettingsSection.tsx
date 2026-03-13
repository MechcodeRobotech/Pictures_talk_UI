import React, { useEffect, useMemo, useState } from 'react';
import { Theme } from '../../../types';
import { BackgroundColorPicker } from '../../Common/ColorPicker';

interface CanvasSettingsSectionProps {
  theme: Theme;
  t: (key: string) => string;
  width: number;
  height: number;
  onDimensionChange: (width: number, height: number) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
}

interface PresetSize {
  key: string;
  ratioKey: string;
  w: number;
  h: number;
}

const PRESET_SIZES: PresetSize[] = [
  { key: 'canvas_preset_square', ratioKey: 'canvas_ratio_square', w: 600, h: 600 },
  { key: 'canvas_preset_presentation', ratioKey: 'canvas_ratio_wide', w: 960, h: 540 },
  { key: 'canvas_preset_classic', ratioKey: 'canvas_ratio_classic', w: 800, h: 600 },
  { key: 'canvas_preset_story', ratioKey: 'canvas_ratio_story', w: 540, h: 960 },
];

const getGreatestCommonDivisor = (a: number, b: number): number => {
  if (!b) return a;
  return getGreatestCommonDivisor(b, a % b);
};

const getRatioLabel = (width: number, height: number): string => {
  if (width <= 0 || height <= 0) return '-';

  const divisor = getGreatestCommonDivisor(width, height);
  return `${width / divisor}:${height / divisor}`;
};

const CanvasSettingsSection: React.FC<CanvasSettingsSectionProps> = ({
  theme,
  t,
  width,
  height,
  onDimensionChange,
  backgroundColor,
  onBackgroundColorChange,
}) => {
  const [isRatioLocked, setIsRatioLocked] = useState<boolean>(true);
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    if (width > 0 && height > 0) {
      setRatio(width / height);
    }
  }, [width, height]);

  const activePreset = useMemo(
    () => PRESET_SIZES.find((preset) => preset.w === width && preset.h === height)?.key ?? null,
    [width, height],
  );

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

  const ratioLabel = getRatioLabel(width, height);

  return (
    <div className="space-y-4">
      <div
        className={`rounded-[20px] border px-3.5 py-3.5 ${
          theme === 'dark'
            ? 'border-white/10 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
            : 'border-slate-200/90 bg-slate-50/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {t('canvas_dimensions_label')}
            </p>
            <p className={`mt-1 max-w-[190px] text-[12px] leading-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('canvas_size_custom')}
            </p>
          </div>
          <div
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
              theme === 'dark' ? 'bg-[#0b1220] text-slate-300' : 'bg-white text-slate-600 shadow-sm'
            }`}
          >
            {width} x {height}
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          <label
            className={`rounded-[16px] border px-3 py-2.5 transition-colors ${
              theme === 'dark'
                ? 'border-white/8 bg-[#0b1220]/80 hover:border-white/12'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span
              className={`block text-[10px] font-semibold uppercase tracking-[0.14em] ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {t('width_short')}
            </span>
            <div className="mt-1.5 flex items-end gap-1">
              <input
                type="number"
                min={1}
                value={width}
                onChange={handleWidthChange}
                className={`min-w-0 flex-1 bg-transparent text-[20px] leading-none font-semibold tracking-[-0.02em] outline-none ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              />
              <span className={`shrink-0 pb-0.5 text-[11px] font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                px
              </span>
            </div>
          </label>

          <label
            className={`rounded-[16px] border px-3 py-2.5 transition-colors ${
              theme === 'dark'
                ? 'border-white/8 bg-[#0b1220]/80 hover:border-white/12'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span
              className={`block text-[10px] font-semibold uppercase tracking-[0.14em] ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {t('height_short')}
            </span>
            <div className="mt-1.5 flex items-end gap-1">
              <input
                type="number"
                min={1}
                value={height}
                onChange={handleHeightChange}
                className={`min-w-0 flex-1 bg-transparent text-[20px] leading-none font-semibold tracking-[-0.02em] outline-none ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              />
              <span className={`shrink-0 pb-0.5 text-[11px] font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                px
              </span>
            </div>
          </label>
        </div>

        <div
          className={`mt-2.5 rounded-[16px] border px-3 py-2.5 ${
            theme === 'dark' ? 'border-white/8 bg-[#0b1220]/65' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between gap-2.5">
            <div className="min-w-0">
              <p className={`text-[13px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {t('aspect_ratio')}
              </p>
              <p className={`mt-0.5 text-[11px] leading-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                {isRatioLocked ? t('canvas_ratio_locked') : t('canvas_ratio_unlocked')}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${
                  theme === 'dark' ? 'bg-white/[0.05] text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {ratioLabel}
              </span>
              <button
                type="button"
                onClick={() => setIsRatioLocked((current) => !current)}
                aria-pressed={isRatioLocked}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-all ${
                  isRatioLocked
                    ? 'bg-primary/14 text-primary ring-1 ring-primary/20'
                    : theme === 'dark'
                      ? 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.07]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{isRatioLocked ? 'lock' : 'lock_open'}</span>
                {t('canvas_ratio_lock_action')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2.5">
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            {t('canvas_size_presets')}
          </p>
          <p className={`mt-1 text-[12px] leading-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('canvas_size_presets_desc')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {PRESET_SIZES.map((preset) => {
            const isActive = activePreset === preset.key;

            return (
              <button
                key={preset.key}
                type="button"
                onClick={() => {
                  onDimensionChange(preset.w, preset.h);
                  setRatio(preset.w / preset.h);
                }}
                className={`rounded-[16px] border px-3 py-2.5 text-left transition-all ${
                  isActive
                    ? 'border-primary/30 bg-primary/[0.08] shadow-[0_6px_18px_rgba(248,175,36,0.08)]'
                    : theme === 'dark'
                      ? 'border-white/8 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.04]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`block text-[13px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      {t(preset.key)}
                    </span>
                    <span className={`mt-0.5 block text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t(preset.ratioKey)}
                    </span>
                  </div>
                  {isActive && <span className="material-symbols-outlined text-[16px] text-primary">check</span>}
                </div>
                <span className={`mt-3 block text-[12px] font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  {preset.w} x {preset.h}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`rounded-[20px] border px-3.5 py-3.5 ${
          theme === 'dark'
            ? 'border-white/10 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
            : 'border-slate-200/90 bg-slate-50/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]'
        }`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {t('canvas_background_label')}
            </p>
            <p className={`mt-1 max-w-[190px] text-[12px] leading-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('canvas_background_desc')}
            </p>
          </div>
          <div
            className={`size-9 rounded-[14px] border ${
              theme === 'dark' ? 'border-white/10 bg-[#0b1220]' : 'border-slate-200 bg-white'
            } p-1 shadow-sm`}
          >
            <div className="size-full rounded-[10px]" style={{ backgroundColor }} />
          </div>
        </div>

        <div
          className={`rounded-[16px] border px-2.5 py-2.5 ${
            theme === 'dark' ? 'border-white/8 bg-[#0b1220]/65' : 'border-slate-200 bg-white'
          }`}
        >
          <BackgroundColorPicker
            theme={theme}
            t={t}
            currentColor={backgroundColor}
            onColorChange={onBackgroundColorChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasSettingsSection;
