import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { MeetingTemplateDraft, Tool, Lang, Theme } from '../types';
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
import { getUntitledProjectId, createCanvasDocument, updateCanvasDocument, getCanvasDocument } from '../lib/canvasApi';

const DRAG_DATA_KEY = 'application/x-canvas-item';
const POPUP_OFFSET_Y_PX = -40;
const AUTO_SAVE_DEBOUNCE_MS = 3000;
const AUTO_SAVE_INTERVAL_MS = 30000;
const CANVAS_DRAFT_STORAGE_KEY = 'meetingTemplateDraft';

interface CanvasProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface CanvasLocationState {
  meetingTemplateDraft?: MeetingTemplateDraft;
}

interface TemplatePreviewBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  highlight?: boolean;
}

interface TemplateCard {
  id: string;
  code: string;
  orientation: 'L' | 'P';
  nameEn: string;
  nameTh: string;
  preview: TemplatePreviewBlock[];
}

const TEMPLATE_CARDS: TemplateCard[] = [
  { id: 'l1', code: 'L1', orientation: 'L', nameEn: 'Landscape 2 Columns', nameTh: 'แนวนอน 2 คอลัมน์', preview: [{ x: 4, y: 8, w: 44, h: 84 }, { x: 52, y: 8, w: 44, h: 84 }] },
  { id: 'l2', code: 'L2', orientation: 'L', nameEn: 'Landscape 3 Columns', nameTh: 'แนวนอน 3 คอลัมน์', preview: [{ x: 4, y: 8, w: 28, h: 84 }, { x: 36, y: 8, w: 28, h: 84 }, { x: 68, y: 8, w: 28, h: 84 }] },
  { id: 'l3', code: 'L3', orientation: 'L', nameEn: 'Landscape 3 Columns Alt', nameTh: 'แนวนอน 3 คอลัมน์ แบบ 2', preview: [{ x: 4, y: 8, w: 28, h: 84 }, { x: 36, y: 8, w: 28, h: 84 }, { x: 68, y: 8, w: 28, h: 84 }] },
  { id: 'l4', code: 'L4', orientation: 'L', nameEn: 'Highlight + 4 Columns', nameTh: 'ไฮไลต์ + 4 คอลัมน์', preview: [{ x: 4, y: 8, w: 92, h: 20, highlight: true }, { x: 4, y: 33, w: 21, h: 59 }, { x: 28, y: 33, w: 21, h: 59 }, { x: 52, y: 33, w: 21, h: 59 }, { x: 76, y: 33, w: 20, h: 59 }] },
  { id: 'l5', code: 'L5', orientation: 'L', nameEn: 'Landscape 4 Columns', nameTh: 'แนวนอน 4 คอลัมน์', preview: [{ x: 4, y: 8, w: 21, h: 84 }, { x: 28, y: 8, w: 21, h: 84 }, { x: 52, y: 8, w: 21, h: 84 }, { x: 76, y: 8, w: 20, h: 84 }] },
  { id: 'l6', code: 'L6', orientation: 'L', nameEn: 'Highlight + 6 Columns', nameTh: 'ไฮไลต์ + 6 คอลัมน์', preview: [{ x: 4, y: 8, w: 92, h: 18, highlight: true }, { x: 4, y: 30, w: 13.5, h: 62 }, { x: 20, y: 30, w: 13.5, h: 62 }, { x: 36, y: 30, w: 13.5, h: 62 }, { x: 52, y: 30, w: 13.5, h: 62 }, { x: 68, y: 30, w: 13.5, h: 62 }, { x: 84, y: 30, w: 12, h: 62 }] },
  { id: 'l7', code: 'L7', orientation: 'L', nameEn: 'Landscape 5 Columns', nameTh: 'แนวนอน 5 คอลัมน์', preview: [{ x: 4, y: 8, w: 17, h: 84 }, { x: 24, y: 8, w: 17, h: 84 }, { x: 44, y: 8, w: 17, h: 84 }, { x: 64, y: 8, w: 17, h: 84 }, { x: 84, y: 8, w: 12, h: 84 }] },
  { id: 'l8', code: 'L8', orientation: 'L', nameEn: 'Two Row Timeline', nameTh: 'ไทม์ไลน์ 2 แถว', preview: [{ x: 4, y: 8, w: 21, h: 38 }, { x: 28, y: 8, w: 21, h: 38 }, { x: 52, y: 8, w: 21, h: 38 }, { x: 76, y: 8, w: 20, h: 38 }, { x: 4, y: 54, w: 21, h: 38 }, { x: 28, y: 54, w: 21, h: 38 }, { x: 52, y: 54, w: 21, h: 38 }, { x: 76, y: 54, w: 20, h: 38 }] },
  { id: 'l9', code: 'L9', orientation: 'L', nameEn: '4 Phases + Highlight', nameTh: '4 เฟส + ไฮไลต์', preview: [{ x: 4, y: 8, w: 22, h: 84 }, { x: 28, y: 8, w: 22, h: 84 }, { x: 52, y: 8, w: 22, h: 84 }, { x: 76, y: 8, w: 20, h: 84 }, { x: 33, y: 14, w: 34, h: 16, highlight: true }] },
  { id: 'p1', code: 'P1', orientation: 'P', nameEn: 'Portrait 2x2', nameTh: 'แนวตั้ง 2x2', preview: [{ x: 4, y: 8, w: 44, h: 40 }, { x: 52, y: 8, w: 44, h: 40 }, { x: 4, y: 52, w: 44, h: 40 }, { x: 52, y: 52, w: 44, h: 40 }] },
  { id: 'p2', code: 'P2', orientation: 'P', nameEn: '2 Highlights + 2 Columns', nameTh: '2 ไฮไลต์ + 2 คอลัมน์', preview: [{ x: 4, y: 8, w: 44, h: 16, highlight: true }, { x: 52, y: 8, w: 44, h: 16, highlight: true }, { x: 4, y: 28, w: 44, h: 64 }, { x: 52, y: 28, w: 44, h: 64 }] },
  { id: 'p3', code: 'P3', orientation: 'P', nameEn: 'Portrait 2 Columns', nameTh: 'แนวตั้ง 2 คอลัมน์', preview: [{ x: 4, y: 8, w: 44, h: 84 }, { x: 52, y: 8, w: 44, h: 84 }] },
  { id: 'p4', code: 'P4', orientation: 'P', nameEn: 'Portrait 3 Columns', nameTh: 'แนวตั้ง 3 คอลัมน์', preview: [{ x: 4, y: 8, w: 28, h: 84 }, { x: 36, y: 8, w: 28, h: 84 }, { x: 68, y: 8, w: 28, h: 84 }] },
  { id: 'p5', code: 'P5', orientation: 'P', nameEn: 'Portrait 4 Columns', nameTh: 'แนวตั้ง 4 คอลัมน์', preview: [{ x: 4, y: 8, w: 21, h: 84 }, { x: 28, y: 8, w: 21, h: 84 }, { x: 52, y: 8, w: 21, h: 84 }, { x: 76, y: 8, w: 20, h: 84 }] },
  { id: 'p6', code: 'P6', orientation: 'P', nameEn: 'Portrait Grid 2x2', nameTh: 'ตารางแนวตั้ง 2x2', preview: [{ x: 4, y: 8, w: 44, h: 40 }, { x: 52, y: 8, w: 44, h: 40 }, { x: 4, y: 52, w: 44, h: 40 }, { x: 52, y: 52, w: 44, h: 40 }] },
  { id: 'p7', code: 'P7', orientation: 'P', nameEn: 'Highlight + 4 Columns', nameTh: 'ไฮไลต์ + 4 คอลัมน์', preview: [{ x: 4, y: 8, w: 92, h: 18, highlight: true }, { x: 4, y: 30, w: 21, h: 62 }, { x: 28, y: 30, w: 21, h: 62 }, { x: 52, y: 30, w: 21, h: 62 }, { x: 76, y: 30, w: 20, h: 62 }] },
  { id: 'p8', code: 'P8', orientation: 'P', nameEn: '4 Columns + Mid Highlight', nameTh: '4 คอลัมน์ + ไฮไลต์กลาง', preview: [{ x: 4, y: 8, w: 21, h: 84 }, { x: 28, y: 8, w: 21, h: 84 }, { x: 52, y: 8, w: 21, h: 84 }, { x: 76, y: 8, w: 20, h: 84 }, { x: 34, y: 14, w: 32, h: 14, highlight: true }] },
  { id: 'p9', code: 'P9', orientation: 'P', nameEn: 'Portrait 4 Columns Alt', nameTh: 'แนวตั้ง 4 คอลัมน์ แบบ 2', preview: [{ x: 4, y: 8, w: 21, h: 84 }, { x: 28, y: 8, w: 21, h: 84 }, { x: 52, y: 8, w: 21, h: 84 }, { x: 76, y: 8, w: 20, h: 84 }] },
];

const TEMPLATE_NAME_TH: Record<string, string> = {
  l1: '\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19 2 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  l2: '\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19 3 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  l3: '\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19 3 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C \u0E41\u0E1A\u0E1A 2',
  l4: '\u0E44\u0E2E\u0E44\u0E25\u0E15\u0E4C + 4 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  l5: '\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19 4 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  l6: '\u0E44\u0E2E\u0E44\u0E25\u0E15\u0E4C + 6 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  l7: '\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19 5 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  l8: '\u0E44\u0E17\u0E21\u0E4C\u0E44\u0E25\u0E19\u0E4C 2 \u0E41\u0E16\u0E27',
  l9: '4 \u0E40\u0E1F\u0E2A + \u0E44\u0E2E\u0E44\u0E25\u0E15\u0E4C',
  p1: '\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07 2x2',
  p2: '2 \u0E44\u0E2E\u0E44\u0E25\u0E15\u0E4C + 2 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  p3: '\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07 2 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  p4: '\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07 3 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  p5: '\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07 4 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  p6: '\u0E15\u0E32\u0E23\u0E32\u0E07\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07 2x2',
  p7: '\u0E44\u0E2E\u0E44\u0E25\u0E15\u0E4C + 4 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C',
  p8: '4 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C + \u0E44\u0E2E\u0E44\u0E25\u0E15\u0E4C\u0E01\u0E25\u0E32\u0E07',
  p9: '\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07 4 \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C \u0E41\u0E1A\u0E1A 2',
};

const SHAPE_CATEGORY_LABELS_TH: Record<string, string> = {
  basic: '\u0E23\u0E39\u0E1B\u0E17\u0E23\u0E07\u0E1E\u0E37\u0E49\u0E19\u0E10\u0E32\u0E19',
  polygons: '\u0E23\u0E39\u0E1B\u0E2B\u0E25\u0E32\u0E22\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21',
  special: '\u0E23\u0E39\u0E1B\u0E17\u0E23\u0E07\u0E1E\u0E34\u0E40\u0E28\u0E29',
  arrows: '\u0E25\u0E39\u0E01\u0E28\u0E23',
  geometric: '\u0E40\u0E23\u0E02\u0E32\u0E04\u0E13\u0E34\u0E15',
  symbols: '\u0E2A\u0E31\u0E0D\u0E25\u0E31\u0E01\u0E29\u0E13\u0E4C',
};

const SHAPE_LABELS_TH: Record<string, string> = {
  square: '\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21',
  circle: '\u0E27\u0E07\u0E01\u0E25\u0E21',
  oval: '\u0E27\u0E07\u0E23\u0E35',
  change_history: '\u0E2A\u0E32\u0E21\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21',
  pentagon: '\u0E2B\u0E49\u0E32\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21',
  star: '\u0E14\u0E32\u0E27',
  heart: '\u0E2B\u0E31\u0E27\u0E43\u0E08',
  cross: '\u0E01\u0E32\u0E01\u0E1A\u0E32\u0E17',
  arrow: '\u0E25\u0E39\u0E01\u0E28\u0E23',
  arrow_down: '\u0E25\u0E39\u0E01\u0E28\u0E23\u0E25\u0E07',
  arrow_left: '\u0E25\u0E39\u0E01\u0E28\u0E23\u0E0B\u0E49\u0E32\u0E22',
  arrow_right: '\u0E25\u0E39\u0E01\u0E28\u0E23\u0E02\u0E27\u0E32',
  parallelogram: '\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21\u0E14\u0E49\u0E32\u0E19\u0E02\u0E19\u0E32\u0E19',
  trapezoid: '\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21\u0E04\u0E32\u0E07\u0E2B\u0E21\u0E39',
  inverted_trapezoid: '\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21\u0E04\u0E32\u0E07\u0E2B\u0E21\u0E39\u0E01\u0E25\u0E31\u0E1A\u0E2B\u0E31\u0E27',
  plus: '\u0E1A\u0E27\u0E01',
  minus: '\u0E25\u0E1A',
  frame: '\u0E01\u0E23\u0E2D\u0E1A',
  rounded_frame: '\u0E01\u0E23\u0E2D\u0E1A\u0E21\u0E38\u0E21\u0E21\u0E19',
  check: '\u0E40\u0E0A\u0E47\u0E01',
  x_mark: '\u0E01\u0E32\u0E01\u0E1A\u0E32\u0E17 X',
  circle_mark: '\u0E27\u0E07\u0E01\u0E25\u0E21',
  dot: '\u0E08\u0E38\u0E14',
};

const getTemplateName = (template: TemplateCard, lang: Lang) =>
  lang === 'th' ? TEMPLATE_NAME_TH[template.id] ?? template.nameEn : template.nameEn;

const getCategoryLabel = (categoryId: string, fallback: string, lang: Lang) =>
  lang === 'th' ? SHAPE_CATEGORY_LABELS_TH[categoryId] ?? fallback : fallback;

const getShapeLabel = (shapeName: string, fallback: string, lang: Lang) =>
  lang === 'th' ? SHAPE_LABELS_TH[shapeName] ?? fallback : fallback;

const Canvas: React.FC<CanvasProps> = ({ isDarkMode, toggleTheme }) => {
  const { language: globalLang } = useLanguage();
  const location = useLocation();
  const locationState = location.state as CanvasLocationState | null;

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
  const [lastAppliedDraftId, setLastAppliedDraftId] = useState<string | null>(null);
  const [lastExportedFileName, setLastExportedFileName] = useState<string | null>(null);

  const shapeCategories = {
    basic: {
      id: 'basic',
      label: 'Basic Shapes',
      icon: 'category',
      shapes: [
        { name: 'square', label: 'Square' },
        { name: 'circle', label: 'Circle' },
        { name: 'oval', label: 'Oval' },
      ]
    },
    polygons: {
      id: 'polygons',
      label: 'Polygons',
      icon: 'pentagon',
      shapes: [
        { name: 'change_history', label: 'Triangle' },
        { name: 'pentagon', label: 'Pentagon' },
      ]
    },
    special: {
      id: 'special',
      label: 'Special',
      icon: 'star',
      shapes: [
        { name: 'star', label: 'Star' },
        { name: 'heart', label: 'Heart' },
        { name: 'cross', label: 'Cross' },
      ]
    },
    arrows: {
      id: 'arrows',
      label: 'Arrows',
      icon: 'arrow_forward',
      shapes: [
        { name: 'arrow', label: 'Arrow' },
        { name: 'arrow_down', label: 'Arrow Down' },
        { name: 'arrow_left', label: 'Arrow Left' },
        { name: 'arrow_right', label: 'Arrow Right' },
      ]
    },
    geometric: {
      id: 'geometric',
      label: 'Geometric',
      icon: 'change_history',
      shapes: [
        { name: 'parallelogram', label: 'Parallelogram' },
        { name: 'trapezoid', label: 'Trapezoid' },
        { name: 'inverted_trapezoid', label: 'Inv. Trapezoid' },
      ]
    },
    symbols: {
      id: 'symbols',
      label: 'Symbols',
      icon: 'radio_button_unchecked',
      shapes: [
        { name: 'plus', label: 'Plus' },
        { name: 'minus', label: 'Minus' },
        { name: 'frame', label: 'Frame' },
        { name: 'rounded_frame', label: 'Rounded Frame' },
        { name: 'check', label: 'Check' },
        { name: 'x_mark', label: 'X Mark' },
        { name: 'circle_mark', label: 'Circle Mark' },
        { name: 'dot', label: 'Dot' },
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

  const pendingMeetingDraft = React.useMemo<MeetingTemplateDraft | null>(() => {
    if (locationState?.meetingTemplateDraft) {
      return locationState.meetingTemplateDraft;
    }

    try {
      const rawDraft = localStorage.getItem(CANVAS_DRAFT_STORAGE_KEY);
      return rawDraft ? (JSON.parse(rawDraft) as MeetingTemplateDraft) : null;
    } catch {
      return null;
    }
  }, [locationState]);

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

  useEffect(() => {
    if (isLoadingFromBackend || !pendingMeetingDraft || !canvasStageRef.current) return;
    if (lastAppliedDraftId === pendingMeetingDraft.draftId) return;

    canvasStageRef.current.applyMeetingTemplate(pendingMeetingDraft);
    setLastAppliedDraftId(pendingMeetingDraft.draftId);
    localStorage.removeItem(CANVAS_DRAFT_STORAGE_KEY);
    scheduleAutoSave();
  }, [isLoadingFromBackend, lastAppliedDraftId, pendingMeetingDraft, scheduleAutoSave]);

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
  const activeToolMeta = activeTool ? toolsList.find((tool) => tool.id === activeTool) ?? null : null;

  const handleToolToggle = (tool: Tool) => {
    setActiveTool((current) => (current === tool ? null : tool));
  };

  const handleTemplateApply = (templateId: string) => {
    canvasStageRef.current?.applyTemplate(templateId);
    scheduleAutoSave();
  };

  const handleExportCanvas = () => {
    const exportUrl = canvasStageRef.current?.exportAsImage();
    if (!exportUrl) return;

    const normalizedName = (
      pendingMeetingDraft?.fileName ||
      lastExportedFileName ||
      'meeting-canvas'
    )
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9-_]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
    const downloadName = `${normalizedName || 'meeting-canvas'}.png`;

    const link = document.createElement('a');
    link.href = exportUrl;
    link.download = downloadName;
    link.click();
    setLastExportedFileName(downloadName);
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

    return category.shapes.filter((shape) => {
      const localizedLabel = getShapeLabel(shape.name, shape.label, lang).toLowerCase();
      return (
        shape.label.toLowerCase().includes(searchLower) ||
        localizedLabel.includes(searchLower) ||
        shape.name.toLowerCase().includes(searchLower)
      );
    });
  };

  const renderPopupContent = () => {
    if (!activeTool) return null;
    const tool = toolsList.find(t => t.id === activeTool);
    if (!tool) return null;
    const popupHelper =
      activeTool === Tool.Shapes
        ? t('canvas_shapes_helper')
        : activeTool === Tool.Templates
          ? t('canvas_templates_helper')
          : activeTool === Tool.Text
            ? t('canvas_text_helper')
            : t(tool.desc);

    return (
      <div
        ref={popupRef}
        className={`fixed z-[100] pointer-events-auto flex w-[356px] max-w-[calc(100vw-32px)] flex-col gap-4 rounded-[30px] border p-5 shadow-[0_24px_60px_rgba(15,23,42,0.16)] animate-fadeIn backdrop-blur-xl ${
          theme === 'dark' ? 'border-white/10 bg-[#0f172a]/92' : 'border-slate-200/80 bg-white/94'
        }`}
        style={{ left: `${popupPos.left}px`, top: `${popupPos.top}px` }}
      >
        <div
          className={`absolute size-4 rotate-45 border-b border-l transition-all duration-300 ${
            theme === 'dark' ? 'border-white/10 bg-[#0f172a]' : 'border-slate-200 bg-white'
          }`}
          style={{ top: `${popupPos.arrowTop}px`, left: '-8px' }}
        />

        <div className={`flex items-start gap-3 border-b pb-4 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200/80'}`}>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[18px] bg-primary text-navy">
            <span className="material-symbols-outlined filled text-[22px]">{tool.icon}</span>
          </div>
          <div className="min-w-0">
            <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('canvas_toolbar_label')}
            </p>
            <h3 className={`mt-1 text-base font-semibold leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t(tool.title)}</h3>
            <p className={`mt-1 text-sm leading-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{popupHelper}</p>
          </div>
        </div>

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
            <div className={`mb-4 rounded-2xl border px-4 py-3 text-xs leading-6 ${
              theme === 'dark' ? 'border-white/8 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}>
              {t('canvas_shapes_helper')}
            </div>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {Object.values(shapeCategories).map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShapeSearch('');
                  }}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'border-primary/40 bg-primary/14 text-primary'
                      : theme === 'dark'
                        ? 'border-white/10 bg-transparent text-slate-400 hover:border-white/20 hover:bg-white/[0.04] hover:text-slate-200'
                        : 'border-slate-200 bg-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{category.icon}</span>
                  <span>{getCategoryLabel(category.id, category.label, lang)}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                search
              </span>
              <input
                type="text"
                value={shapeSearch}
                onChange={(e) => setShapeSearch(e.target.value)}
                placeholder={`${lang === 'th' ? '\u0E04\u0E49\u0E19\u0E2B\u0E32' : 'Search'} ${getCategoryLabel(
                  shapeCategories[selectedCategory as keyof typeof shapeCategories].id,
                  shapeCategories[selectedCategory as keyof typeof shapeCategories].label,
                  lang,
                )}...`}
                className={`w-full rounded-2xl border py-3 pl-10 pr-10 text-sm transition-all ${
                  theme === 'dark'
                    ? 'border-white/10 bg-white/[0.03] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/30'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25'
                }`}
              />
              {shapeSearch && (
                <button
                  type="button"
                  onClick={() => setShapeSearch('')}
                  className="absolute right-3 top-1/2 rounded-full p-1 transition-colors -translate-y-1/2 hover:bg-slate-200/60 dark:hover:bg-white/8"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    close
                  </span>
                </button>
              )}
            </div>

            <div className="grid max-h-[320px] grid-cols-6 gap-2 overflow-y-auto pr-1 pt-1">
              {filteredShapes().map((shape, i) => (
                <button
                  key={i}
                  draggable
                  onDragStart={(event) => handleDragStart(event, { type: 'shape', shape: shape.name })}
                  onClick={() => handleShapePick({ type: 'shape', shape: shape.name })}
                  title={getShapeLabel(shape.name, shape.label, lang)}
                  className={`group aspect-square overflow-hidden rounded-2xl border transition-all ${
                    theme === 'dark'
                      ? 'border-white/10 bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.08]'
                      : 'border-slate-200 bg-slate-50 hover:border-primary/30 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
                  } cursor-grab active:cursor-grabbing`}
                >
                  <div className="relative flex size-10 items-center justify-center transition-transform group-hover:scale-110">
                    <ShapeIcon shape={shape.name} theme={theme} />
                  </div>
                </button>
              ))}
              {filteredShapes().length === 0 && (
                <div className={`col-span-6 flex flex-col items-center justify-center py-8 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                  <span>{t('no_shapes_found')}</span>
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
          <div className="pt-1 max-h-[420px] overflow-y-auto pr-1">
            <div className={`mb-4 rounded-2xl border px-4 py-3 text-xs leading-6 ${
              theme === 'dark' ? 'border-white/8 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}>
              {t('canvas_templates_helper')}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATE_CARDS.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateApply(template.id)}
                  className={`group rounded-[22px] border p-3 text-left transition-all ${
                    theme === 'dark'
                      ? 'border-white/10 bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.07]'
                      : 'border-slate-200 bg-slate-50 hover:border-primary/30 hover:bg-white hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      template.orientation === 'L'
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-violet-500/20 text-violet-400'
                    }`}>
                      {template.code}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {template.orientation === 'L'
                        ? (lang === 'th' ? '\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19' : 'Landscape')
                        : (lang === 'th' ? '\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07' : 'Portrait')}
                    </span>
                  </div>

                  <div className={`relative h-24 overflow-hidden rounded-[16px] border ${
                    theme === 'dark' ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-white'
                  }`}>
                    {template.preview.map((block, index) => (
                      <div
                        key={`${template.id}-${index}`}
                        className={`absolute rounded-[6px] border ${
                          block.highlight
                            ? 'bg-primary/35 border-primary/60'
                            : theme === 'dark'
                              ? 'bg-white/10 border-white/20'
                              : 'bg-slate-100 border-slate-300'
                        }`}
                        style={{
                          left: `${block.x}%`,
                          top: `${block.y}%`,
                          width: `${block.w}%`,
                          height: `${block.h}%`,
                        }}
                      />
                    ))}
                  </div>

                  <p className={`mt-3 min-h-8 text-[12px] font-medium leading-5 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {getTemplateName(template, lang)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative flex h-screen flex-col overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#080d16] text-slate-200' : 'bg-[#f3f5f9] text-navy'
    }`}>
      <div className={`pointer-events-none absolute inset-0 -z-10 ${
        theme === 'dark'
          ? 'bg-[radial-gradient(circle_at_top,#1e293b_0%,#080d16_52%)]'
          : 'bg-[radial-gradient(circle_at_top,#ffffff_0%,#eef2f7_58%)]'
      }`} />
      <div className={`fixed inset-0 pointer-events-none -z-10 dot-grid ${theme === 'dark' ? 'text-white/[0.04]' : 'text-slate-300/80'}`} />

      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isDarkMode={isDarkMode} />
        <div className="relative flex flex-1 overflow-hidden px-5 pb-5 pt-4">
          <div className={`absolute inset-x-5 top-4 hidden rounded-[30px] border px-6 py-4 backdrop-blur-xl xl:flex xl:items-center xl:justify-between ${
            theme === 'dark' ? 'border-white/10 bg-white/[0.03]' : 'border-white/80 bg-white/70'
          }`}>
            <div className="min-w-0">
              <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('canvas_workspace_label')}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('canvas_title')}</h1>
                <span className={`hidden text-sm lg:block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {activeToolMeta ? t(activeToolMeta.desc) : t('canvas_desc')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {pendingMeetingDraft && (
                <div className={`max-w-[240px] truncate rounded-full px-3 py-2 text-xs font-medium ${
                  theme === 'dark' ? 'bg-primary/12 text-primary' : 'bg-primary/10 text-primary'
                }`}>
                  {pendingMeetingDraft.title}
                </div>
              )}
              <div className={`rounded-full px-3 py-2 text-xs font-medium ${
                theme === 'dark' ? 'bg-white/[0.05] text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {t('canvas_status_saved')}
              </div>
              <div className={`rounded-full px-3 py-2 text-xs font-medium ${
                theme === 'dark' ? 'bg-white/[0.05] text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {hasSelection ? t('canvas_selection_desc') : t('canvas_status_focus')}
              </div>
              <button
                type="button"
                onClick={handleExportCanvas}
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-navy transition-colors hover:bg-primary-hover"
              >
                {t('export')}
              </button>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 gap-5 pt-0 xl:pt-[92px]">
            <ToolSidebar
              theme={theme}
              t={t}
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
              isLoading={isLoadingFromBackend}
              onExport={handleExportCanvas}
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
    </div>
  );
};

export default Canvas;

