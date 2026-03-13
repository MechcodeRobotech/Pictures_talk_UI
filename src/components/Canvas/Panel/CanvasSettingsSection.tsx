import React from 'react';
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

const CanvasSettingsSection: React.FC<CanvasSettingsSectionProps> = ({
  theme,
  t,
  width: _width,
  height: _height,
  onDimensionChange: _onDimensionChange,
  backgroundColor,
  onBackgroundColorChange,
}) => {
  return (
    <div>
      <div
        className={`rounded-2xl border px-4 py-3 ${
          theme === 'dark' ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/70'
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {t('canvas_background_label')}
            </p>
            <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('canvas_background_desc')}
            </p>
          </div>
          <div
            className={`size-10 rounded-xl border p-1 ${
              theme === 'dark' ? 'border-white/10 bg-[#0b1220]' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="size-full rounded-lg" style={{ backgroundColor }} />
          </div>
        </div>

        <BackgroundColorPicker
          theme={theme}
          t={t}
          currentColor={backgroundColor}
          onColorChange={onBackgroundColorChange}
        />
      </div>
    </div>
  );
};

export default CanvasSettingsSection;
