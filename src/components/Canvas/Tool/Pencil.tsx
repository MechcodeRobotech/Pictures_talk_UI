import React, { useState } from 'react';
import { ShapeColorPicker } from '../../Common/ColorPicker';
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
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorPickerChange = (color: string) => {
    onColorChange(color);
    onAddColor(color);
    setShowColorPicker(false);
  };

  const handleAddColorClick = () => {
    setShowColorPicker(true);
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
        </div>
        {showColorPicker && (
          <ShapeColorPicker
            theme={theme}
            t={t}
            currentColor={activeColor}
            onColorChange={handleColorPickerChange}
          />
        )}
      </div>
    </div>
  );
};

export default PencilTool;
