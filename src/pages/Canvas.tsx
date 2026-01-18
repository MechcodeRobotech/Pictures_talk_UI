import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { Tool, Lang, Theme } from '../types';
import Header from '../components/Common/Header';
import Sidebar from '../components/Common/Sidebar';
import ToolSidebar from '../components/Canvas/ToolSidebar';
import CanvasStage from '../components/Canvas/CanvasStage';
import PropertiesPanel from '../components/Canvas/PropertiesPanel';
import IconsTool from '../components/Canvas/Tool/Icons';
import ImagesTool from '../components/Canvas/Tool/Images';
import { TRANSLATIONS, COLORS } from './constants';

interface CanvasProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ isDarkMode, toggleTheme }) => {
  const { language: globalLang } = useLanguage();
  
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [showProperties, setShowProperties] = useState(true);
  const [popupPos, setPopupPos] = useState({ top: 0, arrowTop: 0, left: 88 });
  
  const popupRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const toolRefs = useRef<{ [key in Tool]?: HTMLButtonElement | null }>({});

  const theme: Theme = isDarkMode ? 'dark' : 'light';
  const lang: Lang = globalLang as Lang;

  const t = useCallback((key: string) => {
    return TRANSLATIONS[key]?.[lang] || key;
  }, [lang]);

  useEffect(() => {
    if (activeTool && toolRefs.current[activeTool]) {
      const button = toolRefs.current[activeTool];
      if (!button) return;

      const updatePosition = () => {
        const rect = button.getBoundingClientRect();
        const iconCenterY = rect.top + rect.height / 2;
        const sidebarRect = sidebarRef.current?.getBoundingClientRect();
        
        const popupHeight = popupRef.current?.offsetHeight || 380;
        const margin = 16;
        const headerHeight = 72;
        const windowHeight = window.innerHeight;

        let top = iconCenterY - (popupHeight / 2);

        if (top < headerHeight) {
          top = headerHeight;
        }

        if (top + popupHeight > windowHeight - margin) {
          top = windowHeight - popupHeight - margin;
        }

        let arrowTop = iconCenterY - top - 8;

        const arrowPadding = 24;
        if (arrowTop < arrowPadding) arrowTop = arrowPadding;
        if (arrowTop > popupHeight - arrowPadding - 16) arrowTop = popupHeight - arrowPadding - 16;

        const left = sidebarRect ? sidebarRect.right + 12 : 88;

        setPopupPos({ top, arrowTop, left });
      };

      updatePosition();
      const timeoutId = setTimeout(updatePosition, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [activeTool]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setActiveTool(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', () => setActiveTool(null));
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', () => setActiveTool(null));
    };
  }, []);

  const toolsList = [
    { id: Tool.Canvas, icon: 'draw', title: 'canvas_tool_title', desc: 'canvas_tool_desc' },
    { id: Tool.Select, icon: 'near_me', title: 'select_title', desc: 'select_desc' },
    { id: Tool.Shapes, icon: 'shapes', title: 'shapes_title', desc: 'shapes_desc' },
    { id: Tool.Connect, icon: 'cable', title: 'connect_title', desc: 'connect_desc' },
    { id: Tool.Pencil, icon: 'edit', title: 'pencil_title', desc: 'pencil_desc' },
    { id: Tool.Text, icon: 'text_fields', title: 'text_title', desc: 'text_desc' },
    { id: Tool.Icons, icon: 'category', title: 'icons_title', desc: 'icons_desc' },
    { id: Tool.Images, icon: 'add_photo_alternate', title: 'images_title', desc: 'images_desc' },
    { id: Tool.Templates, icon: 'grid_view', title: 'templates_title', desc: 'templates_desc' },
  ];

  const handleToolToggle = (tool: Tool) => {
    setActiveTool((current) => (current === tool ? null : tool));
  };

  const renderPopupContent = () => {
    if (!activeTool) return null;
    const tool = toolsList.find(t => t.id === activeTool);
    if (!tool) return null;

    return (
      <div 
        ref={popupRef}
        className={`fixed z-[100] pointer-events-auto w-80 backdrop-blur-md border rounded-2xl shadow-2xl p-5 flex flex-col gap-4 animate-fadeIn ${
          theme === 'dark' ? 'bg-[#252525]/95 border-white/10' : 'bg-white/95 border-gray-200'
        }`} 
        style={{ left: `${popupPos.left}px`, top: `${popupPos.top}px` }}
      >
        <div 
          className={`absolute size-4 border-l border-b rotate-45 transition-all duration-300 ${
            theme === 'dark' ? 'bg-[#252525] border-white/10' : 'bg-white border-gray-200'
          }`}
          style={{ top: `${popupPos.arrowTop}px`, left: '-8px' }}
        ></div>
        
        <div className="flex items-start gap-3 pb-3 border-b border-white/10">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-navy shrink-0">
            <span className="material-symbols-outlined filled text-[22px]">{tool.icon}</span>
          </div>
          <div>
            <h3 className={`font-bold text-base leading-tight ${theme === 'dark' ? 'text-white' : 'text-navy'}`}>{t(tool.title)}</h3>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{t('properties')}</p>
          </div>
        </div>
        
        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {t(tool.desc)}
        </p>

        {activeTool === Tool.Pencil && (
          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase">{t('stroke')}</div>
              <div className={`h-9 rounded-lg border flex items-center justify-between px-3 ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                {[1, 2, 3, 4].map(s => <div key={s} className={`w-${s+1} h-${s+1} bg-gray-400 rounded-full cursor-pointer hover:bg-primary transition-transform hover:scale-125`} />)}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">{t('color')}</span>
              <div className="flex gap-2.5">
                {COLORS.map((c, i) => <button key={i} style={{backgroundColor: c}} className="size-7 rounded-full transition-transform hover:scale-110 shadow-sm" />)}
              </div>
            </div>
          </div>
        )}

        {activeTool === Tool.Shapes && (
          <div className="grid grid-cols-4 gap-2 pt-1">
            {['square', 'circle', 'change_history', 'star', 'pentagon', 'hexagon', 'diamond', 'rectangle'].map((s, i) => (
              <button key={i} className={`h-12 flex items-center justify-center rounded-lg border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                <span className="material-symbols-outlined text-[20px] text-gray-400">{s}</span>
              </button>
            ))}
          </div>
        )}

        {activeTool === Tool.Text && (
          <div className="space-y-2 pt-1">
            {[
              { label: 'heading', size: '32px', weight: 'bold' },
              { label: 'subheading', size: '20px', weight: 'semibold' },
              { label: 'body_text', size: '14px', weight: 'normal' }
            ].map((item, idx) => (
              <button key={idx} className={`w-full text-left p-3 rounded-xl hover:bg-white/5 flex flex-col transition-colors border border-transparent hover:border-white/10 ${theme === 'dark' ? 'text-white' : 'text-navy'}`}>
                <span className={`text-${idx === 0 ? 'lg' : idx === 1 ? 'base' : 'sm'} font-${item.weight}`}>{t(item.label)}</span>
                <span className="text-[10px] text-gray-500 uppercase mt-1">{item.size} • {t(item.weight)}</span>
              </button>
            ))}
          </div>
        )}

        {activeTool === Tool.Icons && <IconsTool theme={theme} t={t} />}

        {activeTool === Tool.Images && <ImagesTool theme={theme} t={t} />}

        {activeTool === Tool.Templates && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-24 rounded-lg border relative overflow-hidden group cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 relative ${
      theme === 'dark' ? 'bg-[#121212] text-gray-200' : 'bg-gray-50 text-navy'
    }`}>
      <div className={`fixed inset-0 pointer-events-none -z-10 dot-grid ${
        theme === 'dark' ? 'text-white/5' : 'text-gray-300'
      }`}></div>

      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isDarkMode={isDarkMode} />
        <div className="flex flex-1 overflow-hidden relative px-4 pb-4 pt-4 gap-6">
          <ToolSidebar
            theme={theme}
            tools={toolsList}
            activeTool={activeTool}
            onToolToggle={handleToolToggle}
            toolRefs={toolRefs}
            sidebarRef={sidebarRef}
          />

          {renderPopupContent()}

          <CanvasStage
            theme={theme}
            t={t}
            showProperties={showProperties}
            onToggleProperties={() => setShowProperties(!showProperties)}
          />

          <PropertiesPanel
            theme={theme}
            t={t}
            isOpen={showProperties}
            onClose={() => setShowProperties(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Canvas;
