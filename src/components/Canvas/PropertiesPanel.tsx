import React, { useState } from 'react';
import { Theme } from '../../types';
import AppearanceSection from './Panel/AppearanceSection';
import CanvasSettingsSection from './Panel/CanvasSettingsSection';
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
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    objectStyle: !hasSelection,
    typography: !hasSelection,
  });

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const groups = [
    {
      id: 'canvas',
      title: t('canvas_panel_canvas'),
      helper: t('canvas_panel_canvas_desc'),
      sections: [
        {
          id: 'canvasSettings',
          title: t('canvas_panel_canvas'),
          icon: 'dashboard_customize',
          content: (
            <CanvasSettingsSection
              theme={theme}
              t={t}
              width={canvasWidth}
              height={canvasHeight}
              onDimensionChange={onDimensionChange}
              backgroundColor={backgroundColor}
              onBackgroundColorChange={onBackgroundColorChange}
            />
          ),
        },
      ],
    },
    {
      id: 'selection',
      title: t('canvas_panel_selection'),
      helper: hasSelection ? t('canvas_panel_selection_desc') : t('canvas_properties_hint'),
      sections: [
        {
          id: 'objectStyle',
          title: t('canvas_object_label'),
          icon: 'format_paint',
          disabled: !hasSelection,
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
          ),
        },
        {
          id: 'typography',
          title: t('typography'),
          icon: 'text_fields',
          disabled: !hasSelection,
          content: (
            <TypographySection
              theme={theme}
              t={t}
              canvasRef={canvasRef}
              selectionFontData={selectionFontData}
            />
          ),
        },
      ],
    },
  ];

  return (
    <aside
      className={`hidden w-full max-w-[360px] shrink-0 flex-col overflow-hidden rounded-[30px] border backdrop-blur-xl md:flex ${
        theme === 'dark'
          ? 'border-white/10 bg-[#0f172a]/74 shadow-[0_20px_48px_rgba(2,6,23,0.34)]'
          : 'border-slate-200/80 bg-white/92 shadow-[0_20px_40px_rgba(15,23,42,0.08)]'
      }`}
    >
      <div className={`border-b px-5 py-5 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200/80'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('properties')}
            </p>
            <h3 className={`mt-2 text-lg font-semibold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {hasSelection ? t('canvas_panel_selection') : t('canvas_panel_canvas')}
            </h3>
            <p className={`mt-1 text-sm leading-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {hasSelection ? t('canvas_panel_selection_desc') : t('canvas_panel_canvas_desc')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl p-2 transition-colors ${
              theme === 'dark'
                ? 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <section
              key={group.id}
              className={`rounded-[24px] border p-3 ${
                theme === 'dark' ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50/80'
              }`}
            >
              <div className="px-2 pb-2">
                <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  {group.title}
                </p>
                <p className={`mt-1 text-xs leading-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {group.helper}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {group.sections.map((section) => {
                  const isCollapsed = collapsedSections[section.id];
                  const isDisabled = Boolean(section.disabled);
                  const isCanvasGroup = group.id === 'canvas';

                  return (
                    <div
                      key={section.id}
                      className={`overflow-hidden rounded-[18px] border ${
                        theme === 'dark' ? 'border-white/8 bg-[#0b1220]/52' : 'border-slate-200/80 bg-white/92'
                      } ${isDisabled ? 'opacity-60' : ''}`}
                    >
                      {!isCanvasGroup && (
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                            theme === 'dark' ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className={`material-symbols-outlined text-[18px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              {section.icon}
                            </span>
                            <span className={`truncate text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                              {section.title}
                            </span>
                          </div>
                          <span className={`material-symbols-outlined text-[18px] transition-transform ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} ${isCollapsed ? '-rotate-90' : ''}`}>
                            expand_more
                          </span>
                        </button>
                      )}

                      {(!isCollapsed || isCanvasGroup) && (
                        <div className={`px-4 pb-4 ${isCanvasGroup ? 'pt-4' : 'pt-0.5'}`}>
                          {isDisabled ? (
                            <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                              theme === 'dark' ? 'border-white/8 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
                            }`}>
                              {t('canvas_selection_desc')}
                            </div>
                          ) : (
                            section.content
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
