import React from 'react';
import { Theme } from '../../types';

interface CanvasStageProps {
  theme: Theme;
  t: (key: string) => string;
  showProperties: boolean;
  onToggleProperties: () => void;
}

const CanvasStage: React.FC<CanvasStageProps> = ({
  theme,
  t,
  showProperties,
  onToggleProperties,
}) => (
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
        className={`relative w-full max-w-[900px] aspect-[16/9] border-2 shadow-2xl rounded-3xl p-10 flex flex-col items-center justify-center gap-8 ${
          theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'
        }`}
      >
        <div
          className={`size-32 rounded-full flex items-center justify-center mb-2 animate-pulse ${
            theme === 'dark' ? 'bg-primary/10 text-primary' : 'bg-navy/5 text-navy'
          }`}
        >
          <span className="material-symbols-outlined text-6xl">draw</span>
        </div>
        <div className="text-center space-y-3">
          <h2
            className={`text-4xl font-extrabold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-navy'
            }`}
          >
            {t('canvas_title')}
          </h2>
          <p className="text-gray-500 max-w-lg text-lg leading-relaxed">{t('canvas_desc')}</p>
        </div>
      </div>
    </div>
  </main>
);

export default CanvasStage;
