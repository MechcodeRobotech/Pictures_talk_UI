import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import * as fabric from 'fabric';
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
}

const DRAG_DATA_KEY = 'application/x-canvas-item';
const BASE_ICON_SIZE = 56;
const BASE_IMAGE_SIZE = 160;
const BASE_SHAPE_SIZE = 80;

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
}, ref) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const currentPathRef = useRef<fabric.Path | null>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);

  const textSamples = useMemo(
    () => ({
      heading: t('heading'),
      subheading: t('subheading'),
      body_text: t('body_text'),
    }),
    [t],
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    const debouncedRender = debounceRender(() => canvas.requestRenderAll(), 16);

    canvas.on('selection:created', debouncedRender);
    canvas.on('selection:updated', debouncedRender);

    canvas.on('path:created', () => {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    });

    return () => {
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

  useImperativeHandle(ref, () => ({
    addTextAtCenter: (payload) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const left = canvas.getWidth() / 2;
      const top = canvas.getHeight() / 2;
      addText(payload, left, top);
    },
  }));

  const addIcon = (payload: DragPayload & { type: 'icon' }, left: number, top: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    fabric.loadSVGFromURL(payload.url, (objects, options) => {
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
      case 'circle':
        shape = new fabric.Circle({ radius: size / 2, fill, stroke, strokeWidth: 1 });
        break;
      case 'change_history':
        shape = new fabric.Triangle({ width: size, height: size, fill, stroke, strokeWidth: 1 });
        break;
      case 'star': {
        const points = buildPolygonPoints(10, size / 2).map((point, idx) => ({
          x: idx % 2 === 0 ? point.x : point.x * 0.5,
          y: idx % 2 === 0 ? point.y : point.y * 0.5,
        }));
        shape = new fabric.Polygon(points, { fill, stroke, strokeWidth: 1 });
        break;
      }
      case 'pentagon':
        shape = new fabric.Polygon(buildPolygonPoints(5, size / 2), { fill, stroke, strokeWidth: 1 });
        break;
      case 'hexagon':
        shape = new fabric.Polygon(buildPolygonPoints(6, size / 2), { fill, stroke, strokeWidth: 1 });
        break;
      case 'diamond':
        shape = new fabric.Polygon(
          [
            { x: 0, y: -size / 2 },
            { x: size / 2, y: 0 },
            { x: 0, y: size / 2 },
            { x: -size / 2, y: 0 },
          ],
          { fill, stroke, strokeWidth: 1 },
        );
        break;
      case 'rectangle':
        shape = new fabric.Rect({ width: size * 1.4, height: size * 0.8, fill, stroke, strokeWidth: 1 });
        break;
      case 'square':
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
