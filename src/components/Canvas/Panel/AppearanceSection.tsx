import React from 'react';
import { BackgroundColorPicker, TextColorPicker, ShapeColorPicker } from '../../Common/ColorPicker';
import { Theme } from '../../../types';
import type { CanvasStageHandle } from '../CanvasStage';

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
  canvasRef?: React.RefObject<CanvasStageHandle>;
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
  canvasRef,
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
          {canvasRef && (
            <div className={`rounded-2xl border px-4 py-3 ${
              theme === 'dark' ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/70'
            }`}>
              <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Layer
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => canvasRef.current?.bringSelectionForward()}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/[0.05] text-slate-200 hover:bg-white/[0.09]'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Bring Forward
                </button>
                <button
                  type="button"
                  onClick={() => canvasRef.current?.sendSelectionBackward()}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/[0.05] text-slate-200 hover:bg-white/[0.09]'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Send Backward
                </button>
                <button
                  type="button"
                  onClick={() => canvasRef.current?.bringSelectionToFront()}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/[0.05] text-slate-200 hover:bg-white/[0.09]'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  To Front
                </button>
                <button
                  type="button"
                  onClick={() => canvasRef.current?.sendSelectionToBack()}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/[0.05] text-slate-200 hover:bg-white/[0.09]'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  To Back
                </button>
              </div>
            </div>
          )}

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
