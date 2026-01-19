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
      <BackgroundColorPicker
        theme={theme}
        t={t}
        currentColor={backgroundColor}
        onColorChange={onBackgroundColorChange}
      />

      {onTextColorChange && (
        <TextColorPicker
          theme={theme}
          t={t}
          currentColor={textColor ?? (theme === 'dark' ? '#ffffff' : '#000000')}
          onColorChange={onTextColorChange}
        />
      )}

      {onShapeFillChange && (
        <ShapeColorPicker
          theme={theme}
          t={t}
          currentColor={strokeColor ?? (theme === 'dark' ? '#ffffff' : '#000000')}
          onColorChange={onShapeFillChange}
        />
      )}
    </div>
  );
};

export default AppearanceSection;
