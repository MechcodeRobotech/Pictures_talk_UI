import React from 'react';
import { Theme } from '../../types';
import AppearanceSection from './Panel/AppearanceSection';
import DimensionsSection from './Panel/DimensionsSection';
import TypographySection from './Panel/TypographySection';

interface PropertiesPanelProps {
  theme: Theme;
  t: (key: string) => string;
  isOpen: boolean;
  onClose: () => void;
  canvasWidth: number;
  canvasHeight: number;
  onDimensionChange: (width: number, height: number) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  theme,
  t,
  isOpen,
  onClose,
  canvasWidth,
  canvasHeight,
  onDimensionChange,
  backgroundColor,
  onBackgroundColorChange,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      className={`w-72 backdrop-blur-xl border rounded-3xl shadow-2xl hidden lg:flex flex-col z-10 shrink-0 transition-all animate-fadeIn ${
        theme === 'dark' ? 'bg-[#1a1a1a]/80 border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className={`font-bold text-base tracking-tight ${theme === 'dark' ? 'text-white' : 'text-navy'}`}>
          {t('properties')}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="p-6 flex flex-col gap-8 overflow-y-auto">
        <DimensionsSection
          theme={theme}
          t={t}
          width={canvasWidth}
          height={canvasHeight}
          onDimensionChange={onDimensionChange}
        />
        <AppearanceSection
          theme={theme}
          t={t}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={onBackgroundColorChange}
        />
        <TypographySection theme={theme} t={t} />
      </div>
    </aside>
  );
};

export default PropertiesPanel;
