import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { Tool, Lang, Theme } from '../types';
import ThemeToggle from '../components/Common/Theme';
import { TRANSLATIONS, COLORS } from './constants';

interface CanvasProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const { language: globalLang, setLanguage: setGlobalLang } = useLanguage();
  
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [showProperties, setShowProperties] = useState(true);
  const [popupPos, setPopupPos] = useState({ top: 0, arrowTop: 0 });
  
  const popupRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const toolRefs = useRef<{ [key in Tool]?: HTMLButtonElement | null }>({});

  const theme: Theme = isDarkMode ? 'dark' : 'light';
  const lang: Lang = globalLang as Lang;

  const t = useCallback((key: string) => {
    return TRANSLATIONS[key]?.[lang] || key;
  }, [lang]);

  // Logo URL from main dashboard
  const logoUrl = "https://static.wixstatic.com/media/b69b08_d3e4b97f3ace4015866b1f2738fafdf0~mv2.png/v1/fill/w_159,h_44,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo_Secondary_onWhite_Secondary_onWhite.png";

  useEffect(() => {
    if (activeTool && toolRefs.current[activeTool]) {
      const button = toolRefs.current[activeTool];
      if (!button) return;

      const updatePosition = () => {
        const rect = button.getBoundingClientRect();
        const iconCenterY = rect.top + rect.height / 2;
        
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

        setPopupPos({ top, arrowTop });
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
    { id: Tool.Select, icon: 'near_me', title: 'select_title', desc: 'select_desc' },
    { id: Tool.Shapes, icon: 'shapes', title: 'shapes_title', desc: 'shapes_desc' },
    { id: Tool.Connect, icon: 'cable', title: 'connect_title', desc: 'connect_desc' },
    { id: Tool.Pencil, icon: 'edit', title: 'pencil_title', desc: 'pencil_desc' },
    { id: Tool.Text, icon: 'text_fields', title: 'text_title', desc: 'text_desc' },
    { id: Tool.Icons, icon: 'category', title: 'icons_title', desc: 'icons_desc' },
    { id: Tool.Images, icon: 'add_photo_alternate', title: 'images_title', desc: 'images_desc' },
    { id: Tool.Templates, icon: 'grid_view', title: 'templates_title', desc: 'templates_desc' },
  ];

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
        style={{ left: '88px', top: `${popupPos.top}px` }}
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

        {(activeTool === Tool.Icons || activeTool === Tool.Images) && (
          <div className="space-y-3 pt-1">
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-black/20 border-white/10 focus-within:border-primary' : 'bg-gray-50 border-gray-200 focus-within:border-primary'}`}>
              <span className="material-symbols-outlined text-gray-500 text-[18px]">search</span>
              <input type="text" placeholder={t('search_placeholder')} className="bg-transparent border-none outline-none text-xs w-full text-gray-400 placeholder:text-gray-600" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`aspect-square rounded-xl border flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                  <span className="material-symbols-outlined text-gray-500">{activeTool === Tool.Icons ? 'mood' : 'image'}</span>
                </div>
              ))}
            </div>
            {activeTool === Tool.Images && (
              <button className="w-full py-3 bg-primary hover:opacity-90 text-navy rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95">{t('upload_btn')}</button>
            )}
          </div>
        )}

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
    <div className={`fixed inset-0 z-50 flex flex-col overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#121212] text-gray-200' : 'bg-gray-50 text-navy'
    }`}>
      <div className={`fixed inset-0 pointer-events-none -z-10 dot-grid ${
        theme === 'dark' ? 'text-white/5' : 'text-gray-300'
      }`}></div>

      <header className={`h-16 flex items-center justify-between px-6 backdrop-blur-md border-b z-20 shrink-0 ${
        theme === 'dark' ? 'bg-[#1a1a1a]/90 border-white/10' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/home')}
            className="h-10 w-auto flex items-center overflow-hidden transform hover:scale-[1.02] transition-all"
          >
            <img 
              src={logoUrl} 
              alt="Pictures Talk" 
              className={`h-full w-auto object-contain transition-all ${isDarkMode ? 'brightness-200 grayscale-0' : ''}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="group flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-navy'}`}>
              {t('untitled')}
            </span>
            <span className="material-symbols-outlined text-[16px] text-gray-500 group-hover:text-gray-400">edit</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowProperties(!showProperties)} 
            className={`p-2.5 rounded-xl transition-all ${showProperties ? 'bg-primary/20 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showProperties ? 'dock_to_right' : 'dock_to_left'}
            </span>
          </button>

          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} variant="canvas" />
          
          <button 
            onClick={() => setGlobalLang(lang === 'en' ? 'th' : 'en')} 
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all font-bold text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">language</span>
            {lang.toUpperCase()}
          </button>
          
          <button className="bg-primary hover:opacity-90 text-navy font-bold text-sm px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-xl active:scale-95">
            <span>{t('export')}</span>
            <span className="material-symbols-outlined text-[18px]">ios_share</span>
          </button>
          
          <div className="size-10 rounded-full bg-cover bg-center border-2 border-white/20 shadow-xl cursor-pointer hover:ring-2 hover:ring-primary transition-all" style={{ backgroundImage: `url('https://picsum.photos/seed/design/100/100')` }}></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative px-4 pb-4 pt-4 gap-6">
        <aside 
          ref={sidebarRef}
          className={`w-16 flex flex-col items-center py-6 backdrop-blur-xl border rounded-3xl shadow-2xl z-20 shrink-0 gap-4 h-fit self-start transition-all ${
            theme === 'dark' ? 'bg-[#1a1a1a]/80 border-white/10' : 'bg-white/80 border-gray-200'
          }`}
        >
          {toolsList.map((item) => (
            <button 
              key={item.id}
              ref={el => { toolRefs.current[item.id] = el; }}
              onClick={() => setActiveTool(activeTool === item.id ? null : item.id)}
              className="group w-full relative flex justify-center"
            >
              {activeTool === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full animate-fadeIn"></div>
              )}
              <div className={`size-11 flex items-center justify-center rounded-2xl transition-all relative z-10 mx-2 ${
                activeTool === item.id 
                  ? 'bg-primary text-navy shadow-lg scale-110' 
                  : 'text-gray-400 hover:text-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105'
              }`}>
                <span className={`material-symbols-outlined text-[24px] ${activeTool === item.id ? 'filled' : ''}`}>{item.icon}</span>
              </div>
            </button>
          ))}
        </aside>

        {renderPopupContent()}

        <main className="flex-1 rounded-3xl relative overflow-hidden flex flex-col">
          <div className="flex-1 relative overflow-auto flex items-start justify-center p-12">
            <div className={`relative w-full max-w-[900px] aspect-[16/9] border-2 shadow-2xl rounded-3xl p-10 flex flex-col items-center justify-center gap-8 ${
              theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'
            }`}>
              <div className={`size-32 rounded-full flex items-center justify-center mb-2 animate-pulse ${
                theme === 'dark' ? 'bg-primary/10 text-primary' : 'bg-navy/5 text-navy'
              }`}>
                <span className="material-symbols-outlined text-6xl">draw</span>
              </div>
              <div className="text-center space-y-3">
                <h2 className={`text-4xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-navy'}`}>{t('canvas_title')}</h2>
                <p className="text-gray-500 max-w-lg text-lg leading-relaxed">{t('canvas_desc')}</p>
              </div>
            </div>
          </div>
        </main>

        {showProperties && (
          <aside className={`w-72 backdrop-blur-xl border rounded-3xl shadow-2xl hidden lg:flex flex-col z-10 shrink-0 transition-all animate-fadeIn ${
            theme === 'dark' ? 'bg-[#1a1a1a]/80 border-white/10' : 'bg-white border-gray-200'
          }`}>
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className={`font-bold text-base tracking-tight ${theme === 'dark' ? 'text-white' : 'text-navy'}`}>{t('properties')}</h3>
              <button 
                onClick={() => setShowProperties(false)} 
                className="text-gray-500 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-white/5"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-8 overflow-y-auto">
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{t('dimensions')}</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`flex flex-col gap-1.5 p-3 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-black/40 border-white/10 focus-within:border-primary' : 'bg-gray-50 border-gray-200 focus-within:border-primary'}`}>
                    <span className="text-[10px] text-gray-400 font-bold">{t('width_short')}</span>
                    <input type="text" defaultValue="900" className="bg-transparent border-none outline-none text-sm font-bold text-primary w-full" />
                  </div>
                  <div className={`flex flex-col gap-1.5 p-3 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-black/40 border-white/10 focus-within:border-primary' : 'bg-gray-50 border-gray-200 focus-within:border-primary'}`}>
                    <span className="text-[10px] text-gray-400 font-bold">{t('height_short')}</span>
                    <input type="text" defaultValue="506" className="bg-transparent border-none outline-none text-sm font-bold text-primary w-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{t('appearance')}</span>
                <div className="space-y-4">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gray-800 border border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
                         <div className="size-full bg-gradient-to-br from-blue-600 to-indigo-900"></div>
                      </div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('fill')}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono bg-black/20 px-2 py-1 rounded">#1E40AF</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-transparent border-2 border-dashed border-gray-600 flex items-center justify-center">
                         <div className="size-5 rounded-full border-2 border-primary"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('stroke')}</span>
                        <span className="text-[10px] text-gray-500">2px • Solid</span>
                      </div>
                    </div>
                    <button className="size-8 rounded-lg bg-gray-700 border border-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] text-white">edit</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{t('typography')}</span>
                <div className="space-y-3">
                  <div className={`w-full rounded-2xl px-4 py-3 flex justify-between items-center cursor-pointer border transition-all ${
                    theme === 'dark' ? 'bg-black/40 border-white/10 text-white hover:bg-black/60' : 'bg-gray-50 border-gray-200 text-navy hover:bg-gray-100'
                  }`}>
                    <span className="text-sm font-bold tracking-tight">Inter</span>
                    <span className="material-symbols-outlined text-[20px] text-gray-500">expand_more</span>
                  </div>
                  <div className="flex gap-2">
                    <div className={`flex-1 rounded-2xl px-4 py-3 flex justify-between items-center cursor-pointer border transition-all ${
                      theme === 'dark' ? 'bg-black/40 border-white/10 text-white hover:bg-black/60' : 'bg-gray-50 border-gray-200 text-navy hover:bg-gray-100'
                    }`}>
                      <span className="text-sm">{t('regular')}</span>
                    </div>
                    <div className={`w-20 rounded-2xl px-4 py-3 flex justify-center items-center cursor-pointer border transition-all ${
                      theme === 'dark' ? 'bg-black/40 border-white/10 text-white hover:bg-black/60' : 'bg-gray-50 border-gray-200 text-navy hover:bg-gray-100'
                    }`}>
                      <span className="text-sm font-bold">16</span>
                    </div>
                  </div>
                  <div className={`flex p-1.5 rounded-2xl border w-full justify-between ${theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <button className="flex-1 py-2 bg-primary rounded-xl text-navy shadow-lg transition-transform active:scale-95">
                      <span className="material-symbols-outlined text-[20px] filled">format_align_left</span>
                    </button>
                    <button className="flex-1 py-2 hover:bg-white/5 rounded-xl text-gray-500 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">format_align_center</span>
                    </button>
                    <button className="flex-1 py-2 hover:bg-white/5 rounded-xl text-gray-500 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">format_align_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto p-6 border-t border-white/5">
              <button className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                theme === 'dark' ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:text-navy hover:bg-gray-200'
              }`}>
                <span className="material-symbols-outlined text-[18px]">help</span>
                Need Help?
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Canvas;
