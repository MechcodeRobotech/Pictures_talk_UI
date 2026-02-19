import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { DELETE_ICON_SVG } from '../Common/Add';
import { Theme, Tool } from '../../types';

type DragPayload =
  | {
      type: 'icon';
      url: string;
      name: string;
    }
  | {
      type: 'image';
      url: string;
      name: string;
    }
  | {
      type: 'shape';
      shape: string;
    }
  | {
      type: 'text';
      label: string;
      weight: string;
      size?: number;
    };

export type CanvasStageHandle = {
  addTextAtCenter: (payload: DragPayload & { type: 'text' }) => void;
  addImageAtCenter: (payload: DragPayload & { type: 'image' }) => void;
  addIconAtCenter: (payload: DragPayload & { type: 'icon' }) => void;
  addShapeAtCenter: (payload: DragPayload & { type: 'shape' }) => void;
  applyTemplate: (templateId: string) => void;
  updateActiveObjectFont: (options: { fontFamily?: string; fontSize?: number; fontWeight?: string; textAlign?: string; fill?: string }) => void;
  updateActiveObjectStroke: (options: { stroke?: string; strokeWidth?: number }) => void;
  updateActiveObjectFill: (options: { fill: string }) => void;
  saveCanvas: () => void;
  loadCanvas: () => void;
  getCanvasData: () => any;
  loadCanvasFromData: (data: any) => void;
};

interface CanvasStageProps {
  theme: Theme;
  t: (key: string) => string;
  activeTool: Tool | null;
  pencilColor: string;
  pencilStroke: number;
  showProperties: boolean;
  onToggleProperties: () => void;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  onSelectionChange?: (payload: {
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
  }) => void;
}

const DRAG_DATA_KEY = 'application/x-canvas-item';
const BASE_ICON_SIZE = 56;
const BASE_IMAGE_SIZE = 160;
const BASE_SHAPE_SIZE = 80;
const CONTROL_SIZE_PX = 20;
const CONTROL_OFFSET_PX = 12;

type TemplateBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  highlight?: boolean;
};

type TemplatePreset = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  boxes: TemplateBox[];
};

const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'l1',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.49, h: 1, label: 'Content Column 1' },
      { x: 0.51, y: 0, w: 0.49, h: 1, label: 'Content Column 2' },
    ],
  },
  {
    id: 'l2',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.32, h: 1, label: 'Content Column 1' },
      { x: 0.34, y: 0, w: 0.32, h: 1, label: 'Content Column 2' },
      { x: 0.68, y: 0, w: 0.32, h: 1, label: 'Content Column 3' },
    ],
  },
  {
    id: 'l3',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.32, h: 1, label: 'Content Column 1' },
      { x: 0.34, y: 0, w: 0.32, h: 1, label: 'Content Column 2' },
      { x: 0.68, y: 0, w: 0.32, h: 1, label: 'Content Column 3' },
    ],
  },
  {
    id: 'l4',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 1, h: 0.26, label: 'Highlight Content', highlight: true },
      { x: 0, y: 0.3, w: 0.235, h: 0.7, label: 'Content Column 1' },
      { x: 0.255, y: 0.3, w: 0.235, h: 0.7, label: 'Content Column 2' },
      { x: 0.51, y: 0.3, w: 0.235, h: 0.7, label: 'Content Column 3' },
      { x: 0.765, y: 0.3, w: 0.235, h: 0.7, label: 'Content Column 4' },
    ],
  },
  {
    id: 'l5',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.235, h: 1, label: 'Content Column 1' },
      { x: 0.255, y: 0, w: 0.235, h: 1, label: 'Content Column 2' },
      { x: 0.51, y: 0, w: 0.235, h: 1, label: 'Content Column 3' },
      { x: 0.765, y: 0, w: 0.235, h: 1, label: 'Content Column 4' },
    ],
  },
  {
    id: 'l6',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 1, h: 0.22, label: 'Highlight Content', highlight: true },
      { x: 0, y: 0.26, w: 0.15, h: 0.74, label: 'Content 1' },
      { x: 0.17, y: 0.26, w: 0.15, h: 0.74, label: 'Content 2' },
      { x: 0.34, y: 0.26, w: 0.15, h: 0.74, label: 'Content 3' },
      { x: 0.51, y: 0.26, w: 0.15, h: 0.74, label: 'Content 4' },
      { x: 0.68, y: 0.26, w: 0.15, h: 0.74, label: 'Content 5' },
      { x: 0.85, y: 0.26, w: 0.15, h: 0.74, label: 'Content 6' },
    ],
  },
  {
    id: 'l7',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.19, h: 1, label: 'Content Column 1' },
      { x: 0.202, y: 0, w: 0.19, h: 1, label: 'Content Column 2' },
      { x: 0.404, y: 0, w: 0.19, h: 1, label: 'Content Column 3' },
      { x: 0.606, y: 0, w: 0.19, h: 1, label: 'Content Column 4' },
      { x: 0.808, y: 0, w: 0.19, h: 1, label: 'Content Column 5' },
    ],
  },
  {
    id: 'l8',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0.05, w: 0.235, h: 0.4, label: '01' },
      { x: 0.255, y: 0.05, w: 0.235, h: 0.4, label: '02' },
      { x: 0.51, y: 0.05, w: 0.235, h: 0.4, label: '03' },
      { x: 0.765, y: 0.05, w: 0.235, h: 0.4, label: '04' },
      { x: 0, y: 0.55, w: 0.235, h: 0.4, label: 'Content Column 1' },
      { x: 0.255, y: 0.55, w: 0.235, h: 0.4, label: 'Content Column 2' },
      { x: 0.51, y: 0.55, w: 0.235, h: 0.4, label: 'Content Column 3' },
      { x: 0.765, y: 0.55, w: 0.235, h: 0.4, label: 'Content Column 4' },
    ],
  },
  {
    id: 'l9',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.24, h: 1, label: 'PHASE 1' },
      { x: 0.255, y: 0, w: 0.24, h: 1, label: 'PHASE 2' },
      { x: 0.51, y: 0, w: 0.24, h: 1, label: 'PHASE 3' },
      { x: 0.765, y: 0, w: 0.235, h: 1, label: 'PHASE 4' },
      { x: 0.28, y: 0.06, w: 0.44, h: 0.2, label: 'Highlight Content', highlight: true },
    ],
  },
  {
    id: 'p1',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.49, h: 0.49, label: 'Content 1' },
      { x: 0.51, y: 0, w: 0.49, h: 0.49, label: 'Content 2' },
      { x: 0, y: 0.51, w: 0.49, h: 0.49, label: 'Content 3' },
      { x: 0.51, y: 0.51, w: 0.49, h: 0.49, label: 'Content 4' },
    ],
  },
  {
    id: 'p2',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.49, h: 0.28, label: 'Highlight 1', highlight: true },
      { x: 0.51, y: 0, w: 0.49, h: 0.28, label: 'Highlight 2', highlight: true },
      { x: 0, y: 0.32, w: 0.49, h: 0.68, label: 'Content Column 1' },
      { x: 0.51, y: 0.32, w: 0.49, h: 0.68, label: 'Content Column 2' },
    ],
  },
  {
    id: 'p3',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.49, h: 1, label: 'Content Column 1' },
      { x: 0.51, y: 0, w: 0.49, h: 1, label: 'Content Column 2' },
    ],
  },
  {
    id: 'p4',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.32, h: 1, label: 'Content Column 1' },
      { x: 0.34, y: 0, w: 0.32, h: 1, label: 'Content Column 2' },
      { x: 0.68, y: 0, w: 0.32, h: 1, label: 'Content Column 3' },
    ],
  },
  {
    id: 'p5',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.235, h: 1, label: 'Content Column 1' },
      { x: 0.255, y: 0, w: 0.235, h: 1, label: 'Content Column 2' },
      { x: 0.51, y: 0, w: 0.235, h: 1, label: 'Content Column 3' },
      { x: 0.765, y: 0, w: 0.235, h: 1, label: 'Content Column 4' },
    ],
  },
  {
    id: 'p6',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.49, h: 0.49, label: 'Content Column 1' },
      { x: 0.51, y: 0, w: 0.49, h: 0.49, label: 'Content Column 2' },
      { x: 0, y: 0.51, w: 0.49, h: 0.49, label: 'Content Column 3' },
      { x: 0.51, y: 0.51, w: 0.49, h: 0.49, label: 'Content Column 4' },
    ],
  },
  {
    id: 'p7',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 1, h: 0.24, label: 'Highlight Content', highlight: true },
      { x: 0, y: 0.28, w: 0.24, h: 0.72, label: 'Content Column 1' },
      { x: 0.255, y: 0.28, w: 0.24, h: 0.72, label: 'Content Column 2' },
      { x: 0.51, y: 0.28, w: 0.24, h: 0.72, label: 'Content Column 3' },
      { x: 0.765, y: 0.28, w: 0.235, h: 0.72, label: 'Content Column 4' },
    ],
  },
  {
    id: 'p8',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.24, h: 1, label: 'Content Column 1' },
      { x: 0.255, y: 0, w: 0.24, h: 1, label: 'Content Column 2' },
      { x: 0.51, y: 0, w: 0.24, h: 1, label: 'Content Column 3' },
      { x: 0.765, y: 0, w: 0.235, h: 1, label: 'Content Column 4' },
      { x: 0.29, y: 0.05, w: 0.42, h: 0.18, label: 'Highlight Content', highlight: true },
    ],
  },
  {
    id: 'p9',
    title: 'Title',
    subtitle: 'Subtitle',
    date: 'Date & Venue',
    boxes: [
      { x: 0, y: 0, w: 0.235, h: 1, label: 'Content Column 1' },
      { x: 0.255, y: 0, w: 0.235, h: 1, label: 'Content Column 2' },
      { x: 0.51, y: 0, w: 0.235, h: 1, label: 'Content Column 3' },
      { x: 0.765, y: 0, w: 0.235, h: 1, label: 'Content Column 4' },
    ],
  },
];

const createSvgIcon = (svg: string) => {
  const image = new Image();
  image.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return image;
};

const DELETE_ICON = createSvgIcon(DELETE_ICON_SVG);

const renderControlIcon = (icon: HTMLImageElement) => {
  return (
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    _styleOverride: unknown,
    fabricObject: fabric.Object,
  ) => {
    const size = CONTROL_SIZE_PX;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle || 0));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
};

const handleDelete = (_eventData: MouseEvent, transform: fabric.Transform) => {
  const target = transform.target;
  const canvas = target.canvas;
  if (!canvas) return false;
  canvas.remove(target);
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  return true;
};

const createCustomControls = () => {
  const controls = fabric.controlsUtils.createObjectDefaultControls() as ReturnType<
    typeof fabric.controlsUtils.createObjectDefaultControls
  > & {
    deleteControl?: fabric.Control;
  };
  controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetX: -CONTROL_OFFSET_PX,
    offsetY: CONTROL_OFFSET_PX,
    cursorStyle: 'pointer',
    mouseUpHandler: handleDelete,
    render: renderControlIcon(DELETE_ICON),
    sizeX: CONTROL_SIZE_PX,
    sizeY: CONTROL_SIZE_PX,
  });
  return controls;
};

const registerCanvasControls = () => {
  const interactiveClass = fabric.InteractiveFabricObject as typeof fabric.InteractiveFabricObject & {
    __customControls?: boolean;
  };
  interactiveClass.createControls = () => ({ controls: createCustomControls() });
  interactiveClass.__customControls = true;
};

const applyCustomControlsToObject = (object: fabric.Object) => {
  object.controls = createCustomControls();
  object.setCoords();
};

  const buildPolygonPoints = (sides: number, radius: number) => {
    const points = [];
    for (let i = 0; i < sides; i += 1) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
    }
    return points;
  };

  const debounceRender = (fn: () => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(fn, delay);
    };
  };

const CanvasStage = React.forwardRef<CanvasStageHandle, CanvasStageProps>(({
  theme,
  t,
  activeTool,
  pencilColor,
  pencilStroke,
  showProperties,
  onToggleProperties,
  canvasWidth,
  canvasHeight,
  backgroundColor,
  onSelectionChange,
}, ref) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const currentPathRef = useRef<fabric.Path | null>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const selectionChangeRef = useRef<CanvasStageProps['onSelectionChange']>(onSelectionChange);

  const saveCanvasToStorage = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    try {
      const json = canvas.toObject(['controls']);
      localStorage.setItem('canvasData', JSON.stringify(json));
    } catch (error) {
      console.error('Error saving canvas:', error);
    }
  };

  const loadCanvasFromStorage = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    try {
      const data = localStorage.getItem('canvasData');
      if (!data) return;

      const json = JSON.parse(data);
      canvas
        .loadFromJSON(json)
        .then(() => {
          canvas.getObjects().forEach((object) => applyCustomControlsToObject(object));
          canvas.requestRenderAll();
        })
        .catch((error) => {
          console.error('Error loading canvas:', error);
        });
    } catch (error) {
      console.error('Error loading canvas:', error);
    }
  };

  const textSamples = useMemo(
    () => ({
      heading: t('heading'),
      subheading: t('subheading'),
      body_text: t('body_text'),
    }),
    [t],
  );

  useEffect(() => {
    selectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    if (!canvasRef.current) return;
    registerCanvasControls();
    const canvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;
    [DELETE_ICON].forEach((icon) => {
      icon.onload = () => {
        canvas.requestRenderAll();
      };
    });
    canvas.getObjects().forEach((object) => applyCustomControlsToObject(object));

    const handleObjectAdded = (event: { target?: fabric.Object }) => {
      if (event.target) {
        applyCustomControlsToObject(event.target);
      }
    };
    canvas.on('object:added', handleObjectAdded);

    setTimeout(() => {
      loadCanvasFromStorage();
    }, 100);

    const emitSelectionChange = () => {
      const selectionHandler = selectionChangeRef.current;
      if (!selectionHandler) return;
      const active = canvas.getActiveObject();
      if (!active) {
        selectionHandler({ hasSelection: false, strokeColor: null, strokeWidth: null });
        return;
      }

      const primaryObject =
        active.type === 'activeSelection'
          ? (active as unknown as { getObjects: () => fabric.Object[] }).getObjects()[0] ?? active
          : active;
      const strokeColor = typeof primaryObject.stroke === 'string' ? primaryObject.stroke : null;
      const strokeWidth = typeof primaryObject.strokeWidth === 'number' ? primaryObject.strokeWidth : null;

      // Get font data from text object
      let fontData = null;
      let textColor = null;
      if (primaryObject.type === 'textbox' || primaryObject.type === 'text') {
        const textObject = primaryObject as unknown as {
          fontFamily?: string;
          fontSize?: number;
          fontWeight?: string;
          textAlign?: string;
          fill?: string;
        };
        fontData = {
          fontFamily: textObject.fontFamily,
          fontSize: textObject.fontSize,
          fontWeight: textObject.fontWeight,
          textAlign: textObject.textAlign,
        };
        textColor = typeof textObject.fill === 'string' ? textObject.fill : null;
      }

      selectionHandler({ hasSelection: true, strokeColor, strokeWidth, fontData, textColor });
    };

    const debouncedRender = debounceRender(() => canvas.requestRenderAll(), 16);

    const handleSelectionEvent = () => {
      emitSelectionChange();
      debouncedRender();
    };

    canvas.on('selection:created', handleSelectionEvent);
    canvas.on('selection:updated', handleSelectionEvent);
    canvas.on('selection:cleared', handleSelectionEvent);

    canvas.on('path:created', () => {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    });

    canvas.on('object:added', saveCanvasToStorage);
    canvas.on('object:modified', saveCanvasToStorage);
    canvas.on('object:removed', saveCanvasToStorage);

    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('selection:created', handleSelectionEvent);
      canvas.off('selection:updated', handleSelectionEvent);
      canvas.off('selection:cleared', handleSelectionEvent);
      canvas.off('object:added', saveCanvasToStorage);
      canvas.off('object:modified', saveCanvasToStorage);
      canvas.off('object:removed', saveCanvasToStorage);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const isPencilActive = activeTool === Tool.Pencil;
    canvas.isDrawingMode = isPencilActive;
    canvas.selection = !isPencilActive;
    if (isPencilActive) {
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }
      canvas.freeDrawingBrush.color = pencilColor;
      canvas.freeDrawingBrush.width = pencilStroke;
    }
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, [activeTool, pencilColor, pencilStroke]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.backgroundColor = backgroundColor;
    canvas.requestRenderAll();
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !canvasWidth || !canvasHeight) return;
    
    if (canvas.getWidth() === canvasWidth && canvas.getHeight() === canvasHeight) return;
    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);
    canvas.requestRenderAll();
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return;
      const canvas = fabricRef.current;
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (!active) return;
      event.preventDefault();
      canvas.remove(active);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const applyTemplateToCanvas = (templateId: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const preset = TEMPLATE_PRESETS.find((item) => item.id === templateId);
    if (!preset) return;

    const objects = canvas.getObjects();
    objects.forEach((object) => canvas.remove(object));

    const canvasWidthPx = canvas.getWidth();
    const canvasHeightPx = canvas.getHeight();
    const paddingX = Math.max(26, canvasWidthPx * 0.04);
    const headerTop = Math.max(22, canvasHeightPx * 0.03);
    const contentTop = Math.max(118, canvasHeightPx * 0.2);
    const contentBottomPadding = Math.max(24, canvasHeightPx * 0.05);
    const contentWidth = canvasWidthPx - paddingX * 2;
    const contentHeight = Math.max(120, canvasHeightPx - contentTop - contentBottomPadding);
    const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
    const subtleTextColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const boxFill = theme === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc';
    const boxStroke = theme === 'dark' ? 'rgba(255,255,255,0.22)' : '#cbd5e1';
    const highlightFill = theme === 'dark' ? 'rgba(248,175,36,0.2)' : '#fde68a';
    const highlightStroke = theme === 'dark' ? 'rgba(248,175,36,0.55)' : '#f59e0b';

    const title = new fabric.Textbox(preset.title, {
      left: paddingX,
      top: headerTop,
      fontSize: Math.max(28, canvasHeightPx * 0.055),
      fontWeight: '700',
      fill: textColor,
      width: Math.max(220, canvasWidthPx * 0.56),
      editable: true,
    });

    const subtitle = new fabric.Textbox(preset.subtitle, {
      left: paddingX,
      top: headerTop + Math.max(40, canvasHeightPx * 0.075),
      fontSize: Math.max(16, canvasHeightPx * 0.03),
      fontWeight: '400',
      fill: subtleTextColor,
      width: Math.max(220, canvasWidthPx * 0.62),
      editable: true,
    });

    const dateAndVenue = new fabric.Textbox(preset.date, {
      left: canvasWidthPx - paddingX,
      top: headerTop + Math.max(8, canvasHeightPx * 0.015),
      originX: 'right',
      fontSize: Math.max(13, canvasHeightPx * 0.023),
      fontWeight: '500',
      textAlign: 'right',
      fill: subtleTextColor,
      width: Math.max(180, canvasWidthPx * 0.24),
      editable: true,
    });

    canvas.add(title, subtitle, dateAndVenue);

    preset.boxes.forEach((box) => {
      const left = paddingX + box.x * contentWidth;
      const top = contentTop + box.y * contentHeight;
      const width = Math.max(64, box.w * contentWidth);
      const height = Math.max(48, box.h * contentHeight);

      const rect = new fabric.Rect({
        left,
        top,
        width,
        height,
        fill: box.highlight ? highlightFill : boxFill,
        stroke: box.highlight ? highlightStroke : boxStroke,
        strokeWidth: box.highlight ? 1.8 : 1.2,
        rx: 16,
        ry: 16,
      });

      const label = new fabric.Textbox(box.label, {
        left: left + width / 2,
        top: top + height / 2,
        originX: 'center',
        originY: 'center',
        textAlign: 'center',
        fontSize: Math.max(11, Math.min(16, height * 0.17)),
        width: Math.max(56, width - 16),
        fontWeight: box.highlight ? '700' : '500',
        fill: textColor,
        editable: true,
      });

      canvas.add(rect, label);
    });

    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  useImperativeHandle(ref, () => ({
    addTextAtCenter: (payload) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const left = canvas.getWidth() / 2;
      const top = canvas.getHeight() / 2;
      addText(payload, left, top);
    },
    addImageAtCenter: (payload) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const left = canvas.getWidth() / 2;
      const top = canvas.getHeight() / 2;
      addImage(payload, left, top);
    },
    addIconAtCenter: (payload) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const left = canvas.getWidth() / 2;
      const top = canvas.getHeight() / 2;
      addIcon(payload, left, top);
    },
    addShapeAtCenter: (payload) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const left = canvas.getWidth() / 2;
      const top = canvas.getHeight() / 2;
      addShape(payload, left, top);
    },
    applyTemplate: (templateId) => {
      applyTemplateToCanvas(templateId);
      saveCanvasToStorage();
    },
    updateActiveObjectFont: (options) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (!active) return;

      console.log('updateActiveObjectFont called with options:', options);
      console.log('Active object type:', active.type);

      const applyFont = (object: fabric.Object) => {
        // Check if object is a text object using type property
        const isTextObject = object.type === 'textbox' || object.type === 'text';
        if (!isTextObject) return;

        console.log('Applying to text object, current fill:', (object as any).fill);

        const updateOptions: Record<string, any> = {};
        if (options.fontFamily !== undefined) updateOptions.fontFamily = options.fontFamily;
        if (options.fontSize !== undefined) updateOptions.fontSize = options.fontSize;
        if (options.fontWeight !== undefined) updateOptions.fontWeight = options.fontWeight;
        if (options.textAlign !== undefined) updateOptions.textAlign = options.textAlign;
        if (options.fill !== undefined) updateOptions.fill = options.fill;

        console.log('Update options:', updateOptions);

        if (Object.keys(updateOptions).length > 0) {
          object.set(updateOptions);
          object.set('dirty', true); // Mark as dirty to force re-render
        }
        object.setCoords();

        console.log('After update, new fill:', (object as any).fill);
      };

      if (active.type === 'activeSelection') {
        (active as fabric.ActiveSelection).getObjects().forEach(applyFont);
      } else {
        applyFont(active);
      }

      canvas.requestRenderAll();
    },

    updateActiveObjectStroke: (options) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (!active) return;

      const applyStroke = (object: fabric.Object) => {
        const updateOptions: Record<string, any> = {};
        if (options.stroke !== undefined) updateOptions.stroke = options.stroke;
        if (options.strokeWidth !== undefined) updateOptions.strokeWidth = options.strokeWidth;

        if (Object.keys(updateOptions).length > 0) {
          object.set(updateOptions);
          object.set('dirty', true);
        }
        object.setCoords();
      };

      if (active.type === 'activeSelection') {
        (active as fabric.ActiveSelection).getObjects().forEach(applyStroke);
      } else {
        applyStroke(active);
      }

      canvas.requestRenderAll();
    },

    updateActiveObjectFill: (options) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (!active) return;

      const applyFill = (object: fabric.Object) => {
        object.set({ fill: options.fill });
        object.set('dirty', true);
        object.setCoords();
      };

      if (active.type === 'activeSelection') {
        (active as fabric.ActiveSelection).getObjects().forEach(applyFill);
      } else {
        applyFill(active);
      }

      canvas.requestRenderAll();
    },

    saveCanvas: saveCanvasToStorage,

    loadCanvas: loadCanvasFromStorage,

    getCanvasData: () => {
      const canvas = fabricRef.current;
      if (!canvas) return null;
      try {
        return canvas.toObject(['controls']);
      } catch (error) {
        console.error('Error getting canvas data:', error);
        return null;
      }
    },

    loadCanvasFromData: (data: any) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      try {
        canvas
          .loadFromJSON(data)
          .then(() => {
            canvas.getObjects().forEach((object) => applyCustomControlsToObject(object));
            canvas.requestRenderAll();
          })
          .catch((error) => {
            console.error('Error loading canvas from data:', error);
          });
      } catch (error) {
        console.error('Error loading canvas from data:', error);
      }
    },
  }));

  const addIcon = (payload: DragPayload & { type: 'icon' }, left: number, top: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    fabric
      .loadSVGFromURL(payload.url, undefined, { crossOrigin: 'anonymous' })
      .then(({ objects, options }) => {
        if (!objects || !Array.isArray(objects) || objects.length === 0) return;
        const icon = fabric.util.groupSVGElements(objects as fabric.Object[], options);
        const scale = BASE_ICON_SIZE / Math.max(icon.width || 1, icon.height || 1);
        icon.set({
          left,
          top,
          originX: 'center',
          originY: 'center',
          scaleX: scale,
          scaleY: scale,
        });
        canvas.add(icon);
        canvas.setActiveObject(icon);
        canvas.requestRenderAll();
      })
      .catch(() => {
        // Ignore failed icon loads to keep the canvas responsive.
      });
  };

  const addImage = (payload: DragPayload & { type: 'image' }, left: number, top: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    fabric.FabricImage.fromURL(payload.url, { crossOrigin: 'anonymous' })
      .then((img) => {
        const scale = BASE_IMAGE_SIZE / Math.max(img.width || 1, img.height || 1);
        img.set({
          left,
          top,
          originX: 'center',
          originY: 'center',
          scaleX: scale,
          scaleY: scale,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
      })
      .catch(() => {
        // Ignore failed image loads to avoid breaking drag/drop UX.
      });
  };

  const addShape = (payload: DragPayload & { type: 'shape' }, left: number, top: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fill = theme === 'dark' ? '#e5e7eb' : '#1f2937';
    const stroke = theme === 'dark' ? '#0f172a' : '#f8fafc';
    const size = BASE_SHAPE_SIZE;
    let shape: fabric.Object;

    switch (payload.shape) {
      // Basic Shapes
      case 'square':
        shape = new fabric.Rect({ width: size, height: size, fill, stroke, strokeWidth: 1 });
        break;
      case 'rectangle':
        shape = new fabric.Rect({ width: size * 1.4, height: size * 0.8, fill, stroke, strokeWidth: 1 });
        break;
      case 'circle':
        shape = new fabric.Circle({ radius: size / 2, fill, stroke, strokeWidth: 1 });
        break;
      case 'oval':
        shape = new fabric.Ellipse({ rx: size * 0.6, ry: size * 0.4, fill, stroke, strokeWidth: 1 });
        break;

      // Triangles
      case 'change_history':
        shape = new fabric.Triangle({ width: size, height: size, fill, stroke, strokeWidth: 1 });
        break;
      case 'inverted_triangle':
        shape = new fabric.Triangle({ width: size, height: size, fill, stroke, strokeWidth: 1, angle: 180 });
        break;
      case 'right_triangle':
        shape = new fabric.Triangle({ width: size, height: size, fill, stroke, strokeWidth: 1, angle: -90 });
        break;

      // Polygons
      case 'pentagon':
        shape = new fabric.Polygon(buildPolygonPoints(5, size / 2), { fill, stroke, strokeWidth: 1 });
        break;
      case 'hexagon':
        shape = new fabric.Polygon(buildPolygonPoints(6, size / 2), { fill, stroke, strokeWidth: 1 });
        break;
      case 'heptagon':
        shape = new fabric.Polygon(buildPolygonPoints(7, size / 2), { fill, stroke, strokeWidth: 1 });
        break;
      case 'octagon':
        shape = new fabric.Polygon(buildPolygonPoints(8, size / 2), { fill, stroke, strokeWidth: 1 });
        break;

      // Special Shapes
      case 'star': {
        const points = buildPolygonPoints(10, size / 2).map((point, idx) => ({
          x: idx % 2 === 0 ? point.x : point.x * 0.5,
          y: idx % 2 === 0 ? point.y : point.y * 0.5,
        }));
        shape = new fabric.Polygon(points, { fill, stroke, strokeWidth: 1 });
        break;
      }
      case 'diamond':
        shape = new fabric.Polygon(
          [{ x: 0, y: -size / 2 }, { x: size / 2, y: 0 }, { x: 0, y: size / 2 }, { x: -size / 2, y: 0 }],
          { fill, stroke, strokeWidth: 1 },
        );
        break;
      case 'heart':
        shape = new fabric.Path('M50,90 C20,60 5,45 5,30 C5,15 15,10 25,10 C35,10 45,15 50,25 C55,15 65,10 75,10 C85,10 95,15 95,30 C95,45 80,60 50,90Z', { fill, stroke, strokeWidth: 1, scaleX: size / 100, scaleY: size / 100 });
        break;
      case 'cross':
        shape = new fabric.Polygon(
          [
            { x: -size * 0.15, y: -size * 0.45 }, { x: size * 0.15, y: -size * 0.45 },
            { x: size * 0.15, y: -size * 0.15 }, { x: size * 0.45, y: -size * 0.15 },
            { x: size * 0.45, y: size * 0.15 }, { x: size * 0.15, y: size * 0.15 },
            { x: size * 0.15, y: size * 0.45 }, { x: -size * 0.15, y: size * 0.45 },
            { x: -size * 0.15, y: size * 0.15 }, { x: -size * 0.45, y: size * 0.15 },
            { x: -size * 0.45, y: -size * 0.15 }, { x: -size * 0.15, y: -size * 0.15 },
          ],
          { fill, stroke, strokeWidth: 1 },
        );
        break;

      // Arrows
      case 'arrow':
        shape = new fabric.Polygon(
          [
            { x: -size * 0.3, y: -size * 0.4 }, { x: size * 0.2, y: -size * 0.4 },
            { x: size * 0.2, y: -size * 0.3 }, { x: size * 0.4, y: 0 },
            { x: size * 0.2, y: size * 0.3 }, { x: size * 0.2, y: size * 0.4 },
            { x: -size * 0.3, y: size * 0.4 }, { x: -size * 0.3, y: size * 0.3 },
            { x: -size * 0.5, y: 0 }, { x: -size * 0.3, y: -size * 0.3 },
          ],
          { fill, stroke, strokeWidth: 1 },
        );
        break;
      case 'arrow_up':
        shape = new fabric.Triangle({ width: size * 0.6, height: size * 0.8, fill, stroke, strokeWidth: 1 });
        break;
      case 'arrow_down':
        shape = new fabric.Triangle({ width: size * 0.6, height: size * 0.8, fill, stroke, strokeWidth: 1, angle: 180 });
        break;
      case 'arrow_left':
        shape = new fabric.Triangle({ width: size * 0.6, height: size * 0.8, fill, stroke, strokeWidth: 1, angle: -90 });
        break;
      case 'arrow_right':
        shape = new fabric.Triangle({ width: size * 0.6, height: size * 0.8, fill, stroke, strokeWidth: 1, angle: 90 });
        break;
      case 'arrow_up_left':
        shape = new fabric.Triangle({ width: size * 0.6, height: size * 0.8, fill, stroke, strokeWidth: 1, angle: -45 });
        break;

      // Parallelograms & Trapezoids
      case 'parallelogram':
        shape = new fabric.Polygon(
          [{ x: -size * 0.35, y: -size * 0.35 }, { x: size * 0.35, y: -size * 0.35 }, { x: size * 0.25, y: size * 0.35 }, { x: -size * 0.45, y: size * 0.35 }],
          { fill, stroke, strokeWidth: 1 },
        );
        break;
      case 'trapezoid':
        shape = new fabric.Polygon(
          [{ x: -size * 0.4, y: -size * 0.3 }, { x: size * 0.4, y: -size * 0.3 }, { x: size * 0.3, y: size * 0.3 }, { x: -size * 0.3, y: size * 0.3 }],
          { fill, stroke, strokeWidth: 1 },
        );
        break;
      case 'inverted_trapezoid':
        shape = new fabric.Polygon(
          [{ x: -size * 0.3, y: -size * 0.3 }, { x: size * 0.3, y: -size * 0.3 }, { x: size * 0.4, y: size * 0.3 }, { x: -size * 0.4, y: size * 0.3 }],
          { fill, stroke, strokeWidth: 1 },
        );
        break;

      // Lines & Frames
      case 'plus':
        shape = new fabric.Group([
          new fabric.Rect({ width: size * 0.2, height: size, left: size * 0.4, top: 0, fill, strokeWidth: 0 }),
          new fabric.Rect({ width: size, height: size * 0.2, left: 0, top: size * 0.4, fill, strokeWidth: 0 }),
        ], { left: 0, top: 0 });
        break;
      case 'minus':
        shape = new fabric.Rect({ width: size, height: size * 0.2, left: size * 0.5, top: size * 0.5, originX: 'center', originY: 'center', fill, strokeWidth: 0 });
        break;
      case 'frame':
        shape = new fabric.Rect({ width: size * 0.8, height: size * 0.8, fill: 'transparent', stroke: fill, strokeWidth: 6 });
        break;
      case 'rounded_frame':
        shape = new fabric.Rect({ width: size * 0.8, height: size * 0.8, fill, stroke, strokeWidth: 1, rx: size * 0.2, ry: size * 0.2 });
        break;

      // Symbols
      case 'check':
        shape = new fabric.Path('M10,50 L40,70 L90,30', { stroke: fill, strokeWidth: 8, fill: 'transparent', strokeLinecap: 'round', strokeLinejoin: 'round' });
        break;
      case 'x_mark':
        shape = new fabric.Group([
          new fabric.Line([0, 0, 80, 80], { stroke: fill, strokeWidth: 10, strokeLinecap: 'round' }),
          new fabric.Line([80, 0, 0, 80], { stroke: fill, strokeWidth: 10, strokeLinecap: 'round' }),
        ], { left: 0, top: 0 });
        break;
      case 'circle_mark':
        shape = new fabric.Circle({ radius: size * 0.35, fill: 'transparent', stroke: fill, strokeWidth: 6 });
        break;
      case 'dot':
        shape = new fabric.Circle({ radius: size * 0.15, fill, strokeWidth: 0 });
        break;

      default:
        shape = new fabric.Rect({ width: size, height: size, fill, stroke, strokeWidth: 1 });
        break;
    }

    shape.set({ left, top, originX: 'center', originY: 'center' });
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.requestRenderAll();
  };

  const addText = (payload: DragPayload & { type: 'text' }, left: number, top: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const text = textSamples[payload.label as keyof typeof textSamples] ?? payload.label;
    const textbox = new fabric.Textbox(text, {
      left,
      top,
      originX: 'center',
      originY: 'center',
      fontSize: payload.size ?? 28,
      fontWeight: payload.weight,
      fill: theme === 'dark' ? '#ffffff' : '#0f172a',
      width: 300,
      resizeType: 'both',
      lockRotation: false,
      lockScalingX: false,
      lockScalingY: false,
      lockScalingFlip: false,
      minWidth: 20,
      minHeight: 20,
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.requestRenderAll();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    const types = Array.from(event.dataTransfer.types || []);
    if (!types.includes(DRAG_DATA_KEY) && !types.includes('text/plain')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const raw =
      event.dataTransfer.getData(DRAG_DATA_KEY) || event.dataTransfer.getData('text/plain');
    if (!raw) return;
    event.preventDefault();
    setIsDragOver(false);

    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    let payload: DragPayload | null = null;
    try {
      payload = JSON.parse(raw) as DragPayload;
    } catch {
      return;
    }
    if (!payload) return;
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;

    switch (payload.type) {
      case 'icon':
        addIcon(payload, left, top);
        break;
      case 'image':
        addImage(payload, left, top);
        break;
      case 'shape':
        addShape(payload, left, top);
        break;
      case 'text':
        addText(payload, left, top);
        break;
      default:
        break;
    }
  };

  return (
    <main className="flex-1 rounded-3xl relative overflow-hidden flex flex-col">
      <div className="flex items-center justify-end px-4 py-3">
        <button
          type="button"
          onClick={onToggleProperties}
          className={`p-2.5 rounded-xl transition-all ${
            showProperties ? 'bg-primary/20 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {showProperties ? 'dock_to_right' : 'dock_to_left'}
          </span>
        </button>
      </div>
      <div className="flex-1 relative overflow-auto flex items-start justify-center p-12">
        <div
          ref={wrapperRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
          className={`relative border-2 shadow-2xl rounded-3xl shrink-0 ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          } ${isDragOver ? 'ring-2 ring-primary/70' : ''}`}
        >
          <canvas ref={canvasRef} className="w-full h-full rounded-3xl" />
        </div>
      </div>
    </main>
  );
});

export default CanvasStage;
