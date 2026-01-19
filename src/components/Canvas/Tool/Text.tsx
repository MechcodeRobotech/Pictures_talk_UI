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
  <div className="space-y-2 pt-1">
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
        className={`w-full text-left p-3 rounded-xl hover:bg-white/5 flex flex-col transition-colors border border-transparent hover:border-white/10 cursor-grab active:cursor-grabbing ${
          theme === 'dark' ? 'text-white' : 'text-navy'
        }`}
      >
        <span className={`text-${idx === 0 ? 'lg' : idx === 1 ? 'base' : 'sm'} font-bold`}>
          {t(item.label)}
        </span>
        <span className="text-[10px] text-gray-500 uppercase mt-1">{item.size}px</span>
      </button>
    ))}
  </div>
);

export default TextTool;
