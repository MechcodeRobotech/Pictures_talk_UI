import React, { useState } from 'react';
import { Theme } from '../../types';
import AppearanceSection from './Panel/AppearanceSection';
import DimensionsSection from './Panel/DimensionsSection';
import TypographySection from './Panel/TypographySection';
import type { CanvasStageHandle } from './CanvasStage';

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
  strokeColor: string;
  strokeWidth: number;
  hasSelection: boolean;
  onStrokeChange: (options: { color?: string; width?: number }) => void;
  onShapeFillChange: (color: string) => void;
  canvasRef: React.RefObject<CanvasStageHandle>;
  selectionFontData?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    textAlign?: string;
  } | null;
  textColor?: string | null;
  onTextColorChange?: (color: string) => void;
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
  strokeColor,
  strokeWidth,
  hasSelection,
  onStrokeChange,
  onShapeFillChange,
  canvasRef,
  selectionFontData,
  textColor,
  onTextColorChange,
}) => {
  if (!isOpen) return null;

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'dimensions',
      title: t('dimensions'),
      icon: 'straighten',
      content: (
        <DimensionsSection
          theme={theme}
          t={t}
          width={canvasWidth}
          height={canvasHeight}
          onDimensionChange={onDimensionChange}
        />
      )
    },
    {
      id: 'appearance',
      title: t('appearance'),
      icon: 'palette',
      content: (
        <AppearanceSection
          theme={theme}
          t={t}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={onBackgroundColorChange}
          textColor={textColor}
          onTextColorChange={onTextColorChange}
          strokeColor={strokeColor}
          onStrokeChange={onStrokeChange}
          onShapeFillChange={onShapeFillChange}
          hasSelection={hasSelection}
        />
      )
    },
    {
      id: 'typography',
      title: t('typography'),
      icon: 'text_fields',
      content: (
        <TypographySection
          theme={theme}
          t={t}
          canvasRef={canvasRef}
          selectionFontData={selectionFontData}
        />
      )
    }
  ];

  return (
    <aside
      className={`w-full min-w-[280px] max-w-xs md:max-w-sm lg:max-w-md backdrop-blur-xl border rounded-3xl shadow-2xl hidden md:flex flex-col z-10 shrink-0 transition-all animate-fadeIn ${
        theme === 'dark' ? 'bg-[#1a1a1a]/80 border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-primary shrink-0">tune</span>
          <h3 className={`font-bold text-sm sm:text-base tracking-tight truncate ${theme === 'dark' ? 'text-white' : 'text-navy'}`}>
            {t('properties')}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-white/5 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto">
        {sections.map((section, index) => (
          <div key={section.id} className={index !== sections.length - 1 ? 'border-b border-white/5' : ''}>
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between transition-colors gap-2 ${
                theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-gray-500 shrink-0">{section.icon}</span>
                <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider sm:tracking-widest truncate ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {section.title}
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-[18px] sm:text-[20px] text-gray-400 transition-transform shrink-0 ${
                  collapsedSections[section.id] ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>

            {!collapsedSections[section.id] && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default PropertiesPanel;
