import React, { useRef, useState } from 'react';
import { Theme } from '../../../types';

const STROKE_WIDTHS_PX = [2, 4, 6, 8];

interface PencilToolProps {
  theme: Theme;
  t: (key: string) => string;
  colors: string[];
  activeColor: string;
  activeStroke: number;
  onColorChange: (color: string) => void;
  onStrokeChange: (stroke: number) => void;
  onAddColor: (color: string) => void;
}

const PencilTool: React.FC<PencilToolProps> = ({
  theme,
  t,
  colors,
  activeColor,
  activeStroke,
  onColorChange,
  onStrokeChange,
  onAddColor,
}) => {
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingColor, setPendingColor] = useState<string | null>(null);

  const handleAddColorClick = () => {
    colorInputRef.current?.click();
  };

  const handleColorInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!value) return;
    setPendingColor(value);
    event.target.value = '';
  };

  const handleConfirmColor = () => {
    if (pendingColor) {
      onAddColor(pendingColor);
      onColorChange(pendingColor);
      setPendingColor(null);
    }
  };

  const handleCancelColor = () => {
    setPendingColor(null);
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase">{t('stroke')}</div>
        <div
          className={`h-9 rounded-lg border flex items-center justify-between px-3 ${
            theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-gray-100 border-gray-200'
          }`}
        >
          {STROKE_WIDTHS_PX.map((size) => {
            const previewSize = size * 2 + 2;
            const isActive = activeStroke === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => onStrokeChange(size)}
                className={`rounded-full transition-transform hover:scale-125 ${
                  isActive ? 'bg-primary' : 'bg-gray-400 hover:bg-primary'
                }`}
                style={{ width: previewSize, height: previewSize }}
                aria-label={`${t('stroke')} ${size}`}
              />
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <span className="text-xs font-semibold text-gray-500 uppercase">{t('color')}</span>
        <div className="flex gap-2.5">
          {colors.map((color, index) => {
            const isActive = activeColor.toLowerCase() === color.toLowerCase();
            return (
              <button
                key={`${color}-${index}`}
                type="button"
                onClick={() => onColorChange(color)}
                style={{ backgroundColor: color }}
                className={`size-7 rounded-full transition-transform hover:scale-110 shadow-sm ${
                  isActive
                    ? `ring-2 ring-primary ring-offset-2 ${
                        theme === 'dark' ? 'ring-offset-[#1f1f1f]' : 'ring-offset-white'
                      }`
                    : ''
                }`}
                aria-label={t('color')}
              />
            );
          })}
          <button
            type="button"
            onClick={handleAddColorClick}
            className={`size-7 rounded-full border flex items-center justify-center text-sm font-semibold transition-transform hover:scale-110 ${
              theme === 'dark' ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-500'
            }`}
            aria-label={t('add_color')}
            title={t('add_color')}
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
          <input
            ref={colorInputRef}
            type="color"
            className="hidden"
            onChange={handleColorInputChange}
          />
        </div>
        {pendingColor && (
          <div className={`mt-3 p-3 rounded-lg border ${
            theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="size-8 rounded-full shadow-sm"
                style={{ backgroundColor: pendingColor }}
              />
              <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {pendingColor}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmColor}
                className="flex-1 py-2 px-3 rounded-lg bg-primary text-navy text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {t('confirm')}
              </button>
              <button
                type="button"
                onClick={handleCancelColor}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-opacity ${
                  theme === 'dark' 
                    ? 'border-white/10 text-gray-300 hover:bg-white/5' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PencilTool;
