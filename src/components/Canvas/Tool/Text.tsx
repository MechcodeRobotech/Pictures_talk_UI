import React from 'react';
import { Theme } from '../../../types';

interface TextToolProps {
  theme: Theme;
  t: (key: string) => string;
  onDragStart: (event: React.DragEvent, payload: Record<string, string | number>) => void;
  onSelect: (payload: Record<string, string | number>) => void;
}

const TEXT_OPTIONS = [
  { label: 'heading', size: 32, weight: '700' },
  { label: 'subheading', size: 20, weight: '600' },
  { label: 'body_text', size: 14, weight: '400' },
];

const TextTool: React.FC<TextToolProps> = ({ theme, t, onDragStart, onSelect }) => (
  <div className="space-y-3 pt-1">
    <p className={`mb-1 text-sm leading-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
      {t('canvas_text_helper')}
    </p>
    {TEXT_OPTIONS.map((item, idx) => (
      <button
        key={item.label}
        draggable
        onClick={() =>
          onSelect({
            type: 'text',
            label: item.label,
            size: item.size,
            weight: item.weight,
          })
        }
        onDragStart={(event) =>
          onDragStart(event, {
            type: 'text',
            label: item.label,
            size: item.size,
            weight: item.weight,
          })
        }
        className={`flex w-full cursor-grab flex-col rounded-[22px] border p-4 text-left transition-all active:cursor-grabbing ${
          theme === 'dark'
            ? 'border-white/10 bg-white/[0.03] text-white hover:border-white/20 hover:bg-white/[0.06]'
            : 'border-slate-200 bg-slate-50 text-navy hover:border-slate-300 hover:bg-white hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]'
        }`}
      >
        <span className={`font-semibold ${idx === 0 ? 'text-xl' : idx === 1 ? 'text-lg' : 'text-sm'}`}>
          {t(item.label)}
        </span>
        <span className={`mt-2 text-[11px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{item.size}px</span>
      </button>
    ))}
  </div>
);

export default TextTool;
