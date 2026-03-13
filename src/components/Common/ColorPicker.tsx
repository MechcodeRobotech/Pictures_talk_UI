import React from 'react';
import ColorPicker from '@rc-component/color-picker';
import '@rc-component/color-picker/assets/index.css';
import { Theme } from '../../../types';

interface CommonColorPickerProps {
  theme: Theme;
  t: (key: string) => string;
  currentColor: string;
  onColorChange: (color: string) => void;
  label: string;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef',
];

const CommonColorPicker: React.FC<CommonColorPickerProps> = ({
  theme,
  t,
  currentColor,
  onColorChange,
  label,
}) => {
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const [pendingColor, setPendingColor] = React.useState<string | null>(null);
  const [customColors, setCustomColors] = React.useState<string[]>([]);
  const pickerRef = React.useRef<HTMLDivElement | null>(null);

  const handlePickerChange = (color: any) => {
    setPendingColor(color.toHexString());
  };

  const handleConfirmColor = () => {
    if (!pendingColor) return;
    onColorChange(pendingColor);
    if (!customColors.includes(pendingColor)) {
      setCustomColors(prev => [...prev, pendingColor]);
    }
    setIsPickerOpen(false);
  };

  const isColorSelected = (color: string) => {
    return currentColor.toLowerCase() === color.toLowerCase();
  };

  React.useEffect(() => {
    if (isPickerOpen && pendingColor === null) {
      setPendingColor(currentColor);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPickerOpen, currentColor, pendingColor]);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className={`flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border shadow-sm transition-colors ${
              isPickerOpen
                ? 'ring-2 ring-primary/50'
                : theme === 'dark'
                  ? 'border-white/20 hover:border-white/40'
                  : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="size-full" style={{ backgroundColor: currentColor }}></div>
          </button>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className={`truncate text-[12px] font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              {label}
            </span>
            <button
              type="button"
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className={`truncate text-left font-mono text-[10px] transition-colors hover:text-primary ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              {currentColor.toUpperCase()}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsPickerOpen(!isPickerOpen)}
          className={`shrink-0 rounded-lg p-1.5 transition-all ${
            isPickerOpen
              ? 'bg-primary/20 text-primary'
              : theme === 'dark'
                ? 'bg-black/30 text-gray-400 hover:bg-black/50 hover:text-gray-300'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isPickerOpen ? 'close' : 'expand_more'}
          </span>
        </button>
      </div>

      {!isPickerOpen && (
        <div className="grid grid-cols-7 gap-1.5">
          {PRESET_COLORS.slice(0, 6).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              className={`size-6 rounded-md border transition-all hover:scale-105 flex-shrink-0 ${
                isColorSelected(color)
                  ? 'border-primary ring-2 ring-primary/30'
                  : theme === 'dark'
                    ? 'border-white/10 hover:border-white/30'
                    : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          {customColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              className={`size-6 rounded-md border transition-all hover:scale-105 flex-shrink-0 ${
                isColorSelected(color)
                  ? 'border-primary ring-2 ring-primary/30'
                  : theme === 'dark'
                    ? 'border-white/10 hover:border-white/30'
                    : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className={`flex size-6 flex-shrink-0 items-center justify-center rounded-md border transition-all hover:scale-105 ${
              theme === 'dark'
                ? 'border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10'
                : 'border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-gray-500">add</span>
          </button>
        </div>
      )}

      {isPickerOpen && (
        <div
          ref={pickerRef}
          className={`relative overflow-hidden rounded-xl border shadow-xl ${
            theme === 'dark' ? 'bg-black/50 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="p-2.5">
            <div className="space-y-2.5">
              <ColorPicker value={pendingColor ?? currentColor} onChange={handlePickerChange} disabledAlpha />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={(pendingColor ?? currentColor).toUpperCase()}
                  onChange={(event) => setPendingColor(event.target.value)}
                  placeholder="#FFFFFF"
                  className={`flex-1 rounded-lg border px-2.5 py-2 text-[11px] font-mono ${
                    theme === 'dark'
                      ? 'border-white/10 bg-black/40 text-gray-200 placeholder:text-gray-500 focus:border-primary/50'
                      : 'border-gray-200 bg-white text-gray-700 placeholder:text-gray-400 focus:border-primary/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleConfirmColor}
                  className="shrink-0 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-navy transition-opacity hover:opacity-90"
                >
                  {t('apply')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const BackgroundColorPicker: React.FC<Omit<CommonColorPickerProps, 'label'>> = (props) => (
  <CommonColorPicker {...props} label={props.t('background')} />
);

export const TextColorPicker: React.FC<Omit<CommonColorPickerProps, 'label'>> = (props) => (
  <CommonColorPicker {...props} label={props.t('text_color')} />
);

export const ShapeColorPicker: React.FC<Omit<CommonColorPickerProps, 'label'>> = (props) => (
  <CommonColorPicker {...props} label={props.t('shape_color')} />
);
