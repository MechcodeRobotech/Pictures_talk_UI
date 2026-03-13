import React from 'react';
import { BackgroundColorPicker, TextColorPicker, ShapeColorPicker } from '../../Common/ColorPicker';
import { Theme } from '../../../types';

interface AppearanceSectionProps {
  theme: Theme;
  t: (key: string) => string;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  textColor?: string | null;
  onTextColorChange?: (color: string) => void;
  strokeColor?: string | null;
  onStrokeChange?: (options: { color?: string; width?: number }) => void;
  onShapeFillChange?: (color: string) => void;
  hasSelection?: boolean;
}

const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  theme,
  t,
  backgroundColor,
  onBackgroundColorChange,
  textColor,
  onTextColorChange,
  strokeColor,
  onStrokeChange,
  onShapeFillChange,
  hasSelection = false,
}) => {
  return (
    <div className="space-y-3">
      {!hasSelection && (
        <div className={`rounded-2xl border px-4 py-3 ${
          theme === 'dark' ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/70'
        }`}>
          <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {t('canvas_background_label')}
          </p>
          <BackgroundColorPicker
            theme={theme}
            t={t}
            currentColor={backgroundColor}
            onColorChange={onBackgroundColorChange}
          />
        </div>
      )}

      {hasSelection && (
        <div className="space-y-3">
          {onTextColorChange && (
            <div className={`rounded-2xl border px-4 py-3 ${
              theme === 'dark' ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/70'
            }`}>
              <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {t('text_color')}
              </p>
              <TextColorPicker
                theme={theme}
                t={t}
                currentColor={textColor ?? (theme === 'dark' ? '#ffffff' : '#000000')}
                onColorChange={onTextColorChange}
              />
            </div>
          )}

          {onShapeFillChange && (
            <div className={`rounded-2xl border px-4 py-3 ${
              theme === 'dark' ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/70'
            }`}>
              <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {t('shape_color')}
              </p>
              <ShapeColorPicker
                theme={theme}
                t={t}
                currentColor={strokeColor ?? (theme === 'dark' ? '#ffffff' : '#000000')}
                onColorChange={onShapeFillChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppearanceSection;
