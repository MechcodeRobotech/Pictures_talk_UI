import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { Tool, Lang, Theme } from '../types';
import Header from '../components/Common/Header';
import Sidebar from '../components/Common/Sidebar';
import ToolSidebar from '../components/Canvas/ToolSidebar';
import CanvasStage, { CanvasStageHandle } from '../components/Canvas/CanvasStage';
import PropertiesPanel from '../components/Canvas/PropertiesPanel';
import IconsTool from '../components/Canvas/Tool/Icons';
import ImagesTool from '../components/Canvas/Tool/Images';
import PencilTool from '../components/Canvas/Tool/Pencil';
import TextTool from '../components/Canvas/Tool/Text';
import ShapeIcon from '../components/Canvas/Tool/ShapeIcon';
import { TRANSLATIONS, COLORS } from './constants';
import { getUntitledProjectId, createCanvasDocument, updateCanvasDocument, getCanvasDocument, type CanvasDocument } from '../lib/canvasApi';

const DRAG_DATA_KEY = 'application/x-canvas-item';
const POPUP_OFFSET_Y_PX = -40;
const AUTO_SAVE_DEBOUNCE_MS = 3000;
const AUTO_SAVE_INTERVAL_MS = 30000;

interface CanvasProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ isDarkMode, toggleTheme }) => {
  const { language: globalLang } = useLanguage();

  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [showProperties, setShowProperties] = useState<boolean>(() => {
    const saved = localStorage.getItem('showProperties');
    return saved ? JSON.parse(saved) : true;
  });
  const [popupPos, setPopupPos] = useState({ top: 0, arrowTop: 0, left: 88 });
  const [pencilColors, setPencilColors] = useState<string[]>(() => {
    const saved = localStorage.getItem('pencilColors');
    return saved ? JSON.parse(saved) : COLORS;
  });
  const [pencilColor, setPencilColor] = useState<string>(COLORS[0]);
  const [pencilStroke, setPencilStroke] = useState<number>(4);

  // Canvas Document state
  const [canvasDocumentId, setCanvasDocumentId] = useState<number | null>(() => {
    const saved = localStorage.getItem('canvasDocumentId');
    return saved ? parseInt(saved) : null;
  });
  const [isLoadingFromBackend, setIsLoadingFromBackend] = useState(false);

  const savedCanvasWidth = localStorage.getItem('canvasWidth');
  const savedCanvasHeight = localStorage.getItem('canvasHeight');
  const savedBackgroundColor = localStorage.getItem('backgroundColor');
  const savedTextColor = localStorage.getItem('textColor');
  const savedStrokeColor = localStorage.getItem('strokeColor');

  const [canvasWidth, setCanvasWidth] = useState<number>(savedCanvasWidth ? parseInt(savedCanvasWidth) : 900);
  const [canvasHeight, setCanvasHeight] = useState<number>(savedCanvasHeight ? parseInt(savedCanvasHeight) : 506);
  const [backgroundColor, setBackgroundColor] = useState<string>(savedBackgroundColor || (isDarkMode ? '#1e1e1e' : '#ffffff'));

  const [strokeColor, setStrokeColor] = useState<string>(savedStrokeColor || (isDarkMode ? '#f8fafc' : '#0f172a'));
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [hasSelection, setHasSelection] = useState<boolean>(false);
  const [selectionFontData, setSelectionFontData] = useState<{
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    textAlign?: string;
  } | null>(null);
  const [textColor, setTextColor] = useState<string>(savedTextColor || (isDarkMode ? '#ffffff' : '#0f172a'));
  const [shapeSearch, setShapeSearch] = useState<string>('');

  const shapeCategories = {
    basic: {
      id: 'basic',
      label: 'Basic Shapes',
      labelTh: 'รูปทรงพื้นฐาน',
      icon: 'category',
      shapes: [
        { name: 'square', label: 'Square', labelTh: 'สี่เหลี่ยม' },
        { name: 'circle', label: 'Circle', labelTh: 'วงกลม' },
        { name: 'oval', label: 'Oval', labelTh: 'วงรี' },
      ]
    },
    polygons: {
      id: 'polygons',
      label: 'Polygons',
      labelTh: 'รูปหลายเหลี่ยม',
      icon: 'pentagon',
      shapes: [
        { name: 'change_history', label: 'Triangle', labelTh: 'สามเหลี่ยม' },
        { name: 'pentagon', label: 'Pentagon', labelTh: 'ห้าเหลี่ยม' },
      ]
    },
    special: {
      id: 'special',
      label: 'Special',
      labelTh: 'รูปทรงพิเศษ',
      icon: 'star',
      shapes: [
        { name: 'star', label: 'Star', labelTh: 'ดาว' },
        { name: 'heart', label: 'Heart', labelTh: 'หัวใจ' },
        { name: 'cross', label: 'Cross', labelTh: 'กากบาท' },
      ]
    },
    arrows: {
      id: 'arrows',
      label: 'Arrows',
      labelTh: 'ลูกศร',
      icon: 'arrow_forward',
      shapes: [
        { name: 'arrow', label: 'Arrow', labelTh: 'ลูกศร' },
        { name: 'arrow_down', label: 'Arrow Down', labelTh: 'ลูกศรลง' },
        { name: 'arrow_left', label: 'Arrow Left', labelTh: 'ลูกศรซ้าย' },
        { name: 'arrow_right', label: 'Arrow Right', labelTh: 'ลูกศรขวา' },
      ]
    },
    geometric: {
      id: 'geometric',
      label: 'Geometric',
      labelTh: 'เรขาคณิต',
      icon: 'change_history',
      shapes: [
        { name: 'parallelogram', label: 'Parallelogram', labelTh: 'สี่เหลี่ยมคู่ขนาน' },
        { name: 'trapezoid', label: 'Trapezoid', labelTh: 'สี่เหลี่ยมด้านไม่เท่า' },
        { name: 'inverted_trapezoid', label: 'Inv. Trapezoid', labelTh: 'สี่เหลี่ยมกลับ' },
      ]
    },
    symbols: {
      id: 'symbols',
      label: 'Symbols',
      labelTh: 'สัญลักษณ์',
      icon: 'radio_button_unchecked',
      shapes: [
        { name: 'plus', label: 'Plus', labelTh: 'บวก' },
        { name: 'minus', label: 'Minus', labelTh: 'ลบ' },
        { name: 'frame', label: 'Frame', labelTh: 'กรอบ' },
        { name: 'rounded_frame', label: 'Rounded Frame', labelTh: 'กรอบมุมมน' },
        { name: 'check', label: 'Check', labelTh: 'เช็ค' },
        { name: 'x_mark', label: 'X Mark', labelTh: 'กากบาท X' },
        { name: 'circle_mark', label: 'Circle Mark', labelTh: 'วงกลม' },
        { name: 'dot', label: 'Dot', labelTh: 'จุด' },
      ]
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCategory');
    return saved || 'basic';
  });

  const popupRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const toolRefs = useRef<{ [key in Tool]?: HTMLButtonElement | null }>({});
  const canvasStageRef = useRef<CanvasStageHandle | null>(null);

  const theme: Theme = isDarkMode ? 'dark' : 'light';
  const lang: Lang = globalLang as Lang;

  const t = useCallback((key: string) => {
    return TRANSLATIONS[key]?.[lang] || key;
  }, [lang]);

  // Debounce save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Save canvas to backend
  const saveCanvasToBackend = useCallback(async () => {
    if (!canvasDocumentId || !canvasStageRef.current) return;

    try {
      const canvasData = canvasStageRef.current.getCanvasData();
      if (!canvasData) return;

      await updateCanvasDocument(canvasDocumentId, {
        canvas_width: canvasWidth,
        canvas_height: canvasHeight,
        background_color: backgroundColor,
        canvas_data: canvasData,
      });
    } catch (error) {
      console.error('Error saving canvas to backend:', error);
    }
  }, [canvasDocumentId, canvasWidth, canvasHeight, backgroundColor]);

  // Debounced save
  const scheduleAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveCanvasToBackend();
    }, AUTO_SAVE_DEBOUNCE_MS);
  }, [saveCanvasToBackend]);

  // Load canvas from backend on mount
  useEffect(() => {
    const loadCanvasFromBackend = async () => {
      if (!canvasDocumentId) {
        // Create new canvas document
        try {
          setIsLoadingFromBackend(true);
          const projectId = await getUntitledProjectId();
          const newDocument = await createCanvasDocument({
            project_id: projectId,
            canvas_width: canvasWidth,
            canvas_height: canvasHeight,
            background_color: backgroundColor,
            theme,
            language: lang,
          });
          setCanvasDocumentId(newDocument.id);
          localStorage.setItem('canvasDocumentId', newDocument.id.toString());
        } catch (error) {
          console.error('Error creating canvas document:', error);
          // Fallback to localStorage
          canvasStageRef.current?.loadCanvas();
        } finally {
          setIsLoadingFromBackend(false);
        }
        return;
      }

      // Load existing canvas
      try {
        setIsLoadingFromBackend(true);
        const document = await getCanvasDocument(canvasDocumentId);

        // Update state from backend
        if (document.canvas_width) {
          setCanvasWidth(document.canvas_width);
          localStorage.setItem('canvasWidth', document.canvas_width.toString());
        }
        if (document.canvas_height) {
          setCanvasHeight(document.canvas_height);
          localStorage.setItem('canvasHeight', document.canvas_height.toString());
        }
        if (document.background_color) {
          setBackgroundColor(document.background_color);
          localStorage.setItem('backgroundColor', document.background_color);
        }

        // Load canvas data
        if (document.canvas_data) {
          canvasStageRef.current?.loadCanvasFromData(document.canvas_data);
        } else {
          canvasStageRef.current?.loadCanvas();
        }
      } catch (error) {
        console.error('Error loading canvas from backend:', error);
        // Fallback to localStorage
        canvasStageRef.current?.loadCanvas();
      } finally {
        setIsLoadingFromBackend(false);
      }
    };

    loadCanvasFromBackend();

    // Setup periodic auto-save
    autoSaveIntervalRef.current = setInterval(() => {
      saveCanvasToBackend();
    }, AUTO_SAVE_INTERVAL_MS);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []); // Run only on mount

  // Save on dimension change
  useEffect(() => {
    localStorage.setItem('canvasWidth', canvasWidth.toString());
    localStorage.setItem('canvasHeight', canvasHeight.toString());
    scheduleAutoSave();
  }, [canvasWidth, canvasHeight, scheduleAutoSave]);

  // Save on background color change
  useEffect(() => {
    localStorage.setItem('backgroundColor', backgroundColor);
    scheduleAutoSave();
  }, [backgroundColor, scheduleAutoSave]);

  // Save on any canvas change (triggered by canvas stage)
  useEffect(() => {
    const handleCanvasChange = () => {
      scheduleAutoSave();
    };

    // Listen for canvas changes
    // This will be triggered by canvas stage
    window.addEventListener('canvas-change', handleCanvasChange);
    return () => window.removeEventListener('canvas-change', handleCanvasChange);
  }, [scheduleAutoSave]);

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

        let top = iconCenterY - (popupHeight / 2) + POPUP_OFFSET_Y_PX;

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
      const frameId = requestAnimationFrame(updatePosition);
      return () => cancelAnimationFrame(frameId);
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
        if (activeTool !== Tool.Pencil) {
          setActiveTool(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', () => setActiveTool(null));
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', () => setActiveTool(null));
    };
  }, [activeTool]);

  const toolsList = [
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

  useEffect(() => {
    localStorage.setItem('showProperties', JSON.stringify(showProperties));
  }, [showProperties]);

  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  const handleDragStart = (event: React.DragEvent, payload: Record<string, string | number>) => {
    const data = JSON.stringify(payload);
    event.dataTransfer.setData(DRAG_DATA_KEY, data);
    event.dataTransfer.setData('text/plain', data);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleTextPick = (payload: Record<string, string | number>) => {
    if (payload.type !== 'text') return;
    canvasStageRef.current?.addTextAtCenter(payload as { type: 'text'; label: string; size?: number; weight: string });
    scheduleAutoSave();
  };

  const handleImagePick = (payload: { type: 'image'; url: string; name: string }) => {
    canvasStageRef.current?.addImageAtCenter(payload);
    scheduleAutoSave();
  };

  const handleIconPick = (payload: { type: 'icon'; url: string; name: string }) => {
    canvasStageRef.current?.addIconAtCenter(payload);
    scheduleAutoSave();
  };

  const handleShapePick = (payload: { type: 'shape'; shape: string }) => {
    canvasStageRef.current?.addShapeAtCenter(payload);
    scheduleAutoSave();
  };

  const handleAddPencilColor = (color: string) => {
    setPencilColors((prev) => {
      if (prev.some((item) => item.toLowerCase() === color.toLowerCase())) return prev;
      const newColors = [...prev, color];
      localStorage.setItem('pencilColors', JSON.stringify(newColors));
      return newColors;
    });
  };

  const handleDimensionChange = (width: number, height: number) => {
    setCanvasWidth(width);
    setCanvasHeight(height);
    scheduleAutoSave();
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    scheduleAutoSave();
  };

  // Reset text color when theme changes
  useEffect(() => {
    setTextColor(isDarkMode ? '#ffffff' : '#0f172a');
  }, [isDarkMode]);

  const handleSelectionChange = useCallback(
    (payload: {
      hasSelection: boolean;
      strokeColor: string | null;
      strokeWidth: number | null;
      fontData?: {
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: string;
        textAlign?: string;
      } | null;
      textColor?: string | null;
    }) => {
      if (payload.hasSelection !== undefined) setHasSelection(payload.hasSelection);
      if (payload.strokeColor) setStrokeColor(payload.strokeColor);
      if (payload.strokeWidth !== null) setStrokeWidth(payload.strokeWidth);
      setSelectionFontData(payload.fontData ?? null);
      if (payload.textColor) setTextColor(payload.textColor);
    },
    [],
  );

  const handleStrokeChange = useCallback((options: { color?: string; width?: number }) => {
    if (options.color) {
      setStrokeColor(options.color);
      localStorage.setItem('strokeColor', options.color);
    }
    if (options.width !== undefined) setStrokeWidth(options.width);

    const updateOptions: { stroke?: string; strokeWidth?: number } = {};
    if (options.color) updateOptions.stroke = options.color;
    if (options.width !== undefined) updateOptions.strokeWidth = options.width;

    if (Object.keys(updateOptions).length > 0) {
      canvasStageRef.current?.updateActiveObjectStroke(updateOptions);
    }
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  const handleShapeFillChange = useCallback((color: string) => {
    canvasStageRef.current?.updateActiveObjectFill({ fill: color });
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  const handleTextColorChange = useCallback((color: string) => {
    setTextColor(color);
    localStorage.setItem('textColor', color);
    canvasStageRef.current?.updateActiveObjectFont({ fill: color });
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  const filteredShapes = () => {
    const category = shapeCategories[selectedCategory as keyof typeof shapeCategories];
    if (!category) return [];

    const searchLower = shapeSearch.toLowerCase().trim();

    return category.shapes.filter(shape =>
      shape.label.toLowerCase().includes(searchLower) ||
      shape.labelTh.includes(shapeSearch) ||
      shape.name.toLowerCase().includes(searchLower)
    );
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
          <PencilTool
            theme={theme}
            t={t}
            colors={pencilColors}
            activeColor={pencilColor}
            activeStroke={pencilStroke}
            onColorChange={setPencilColor}
            onStrokeChange={setPencilStroke}
            onAddColor={handleAddPencilColor}
          />
        )}

        {activeTool === Tool.Shapes && (
          <div>
            {/* Category Tabs */}
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
              {Object.values(shapeCategories).map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShapeSearch('');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary text-navy border-primary shadow-sm'
                      : theme === 'dark'
                        ? 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5 hover:border-white/20 hover:text-gray-300'
                        : 'bg-transparent border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{category.icon}</span>
                  <span>{lang === 'th' ? category.labelTh : category.label}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={shapeSearch}
                onChange={(e) => setShapeSearch(e.target.value)}
                placeholder={`${lang === 'th' ? 'ค้นหา' : 'Search'} ${lang === 'th' ? shapeCategories[selectedCategory as keyof typeof shapeCategories].labelTh : shapeCategories[selectedCategory as keyof typeof shapeCategories].label}...`}
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50'
                }`}
              />
              {shapeSearch && (
                <button
                  type="button"
                  onClick={() => setShapeSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    close
                  </span>
                </button>
              )}
            </div>

            {/* Shapes Grid */}
            <div className="grid grid-cols-6 gap-2 pt-1 max-h-[320px] overflow-y-auto pr-1">
              {filteredShapes().map((shape, i) => (
                <button
                  key={i}
                  draggable
                  onDragStart={(event) => handleDragStart(event, { type: 'shape', shape: shape.name })}
                  onClick={() => handleShapePick({ type: 'shape', shape: shape.name })}
                  title={lang === 'th' ? shape.labelTh : shape.label}
                  className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all overflow-hidden group ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10'
                      : 'bg-gray-50 border-gray-200 hover:border-primary/50 hover:bg-white'
                  } cursor-grab active:cursor-grabbing`}
                >
                  <div className="relative size-10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <ShapeIcon shape={shape.name} theme={theme} />
                  </div>
                </button>
              ))}
              {filteredShapes().length === 0 && (
                <div className={`col-span-6 flex flex-col items-center justify-center py-8 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                  <span>{lang === 'th' ? 'ไม่พบรูปทรง' : 'No shapes found'}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTool === Tool.Text && (
          <TextTool theme={theme} t={t} onDragStart={handleDragStart} onSelect={handleTextPick} />
        )}

        {activeTool === Tool.Icons && <IconsTool theme={theme} t={t} onSelect={handleIconPick} />}

        {activeTool === Tool.Images && <ImagesTool theme={theme} t={t} onSelect={handleImagePick} />}

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
            ref={canvasStageRef}
            theme={theme}
            t={t}
            activeTool={activeTool}
            pencilColor={pencilColor}
            pencilStroke={pencilStroke}
            showProperties={showProperties}
            onToggleProperties={() => setShowProperties(!showProperties)}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            backgroundColor={backgroundColor}
            onSelectionChange={handleSelectionChange}
          />

          <PropertiesPanel
            theme={theme}
            t={t}
            isOpen={showProperties}
            onClose={() => setShowProperties(false)}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            onDimensionChange={handleDimensionChange}
            backgroundColor={backgroundColor}
            onBackgroundColorChange={handleBackgroundColorChange}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            hasSelection={hasSelection}
            onStrokeChange={handleStrokeChange}
            onShapeFillChange={handleShapeFillChange}
            canvasRef={canvasStageRef}
            selectionFontData={selectionFontData}
            textColor={textColor}
            onTextColorChange={handleTextColorChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Canvas;
