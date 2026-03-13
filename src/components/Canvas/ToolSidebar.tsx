import React from 'react';
import { Tool, Theme } from '../../types';

interface ToolItem {
  id: Tool;
  icon: string;
  title: string;
  desc: string;
}

interface ToolSidebarProps {
  theme: Theme;
  t: (key: string) => string;
  tools: ToolItem[];
  activeTool: Tool | null;
  onToolToggle: (tool: Tool) => void;
  toolRefs: React.MutableRefObject<{ [key in Tool]?: HTMLButtonElement | null }>;
  sidebarRef: React.RefObject<HTMLElement>;
}

const ToolSidebar: React.FC<ToolSidebarProps> = ({
  theme,
  t,
  tools,
  activeTool,
  onToolToggle,
  toolRefs,
  sidebarRef,
}) => (
  <aside
    ref={sidebarRef}
    className={`w-[90px] max-h-[calc(100vh-196px)] shrink-0 self-start overflow-y-auto rounded-[28px] border p-2.5 backdrop-blur-xl transition-all ${
      theme === 'dark'
        ? 'border-white/10 bg-[#0f172a]/72 shadow-[0_16px_44px_rgba(2,6,23,0.35)]'
        : 'border-slate-200/80 bg-white/88 shadow-[0_20px_40px_rgba(15,23,42,0.08)]'
    }`}
  >
    <div className="mb-2 rounded-[18px] px-2 py-2 text-center">
      <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
        {t('canvas_toolbar_label')}
      </p>
    </div>

    <div className="flex flex-col gap-1">
      {tools.map((item) => {
        const isActive = activeTool === item.id;

        return (
          <button
            key={item.id}
            type="button"
            ref={(el) => {
              toolRefs.current[item.id] = el;
            }}
            onClick={() => onToolToggle(item.id)}
            title={t(item.title)}
            className={`group relative overflow-hidden rounded-[18px] border px-1.5 py-2 text-center transition-all ${
              isActive
                ? theme === 'dark'
                  ? 'border-white/10 bg-white/[0.08]'
                  : 'border-slate-200 bg-slate-50'
                : theme === 'dark'
                  ? 'border-transparent hover:border-white/10 hover:bg-white/[0.04]'
                  : 'border-transparent hover:border-slate-200/80 hover:bg-white/70'
            }`}
          >
            <div
              className={`mx-auto mb-1.5 flex size-10 items-center justify-center rounded-[14px] transition-all ${
                isActive
                  ? 'bg-primary text-navy shadow-[0_10px_24px_rgba(248,175,36,0.28)]'
                  : theme === 'dark'
                    ? 'bg-white/[0.04] text-slate-300 group-hover:bg-white/[0.08] group-hover:text-white'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'filled' : ''}`}>
                {item.icon}
              </span>
            </div>
            <span className={`block text-[10px] font-semibold leading-3.5 ${
              isActive
                ? theme === 'dark'
                  ? 'text-white'
                  : 'text-slate-900'
                : theme === 'dark'
                  ? 'text-slate-400 group-hover:text-slate-200'
                  : 'text-slate-500 group-hover:text-slate-700'
            }`}>
              {t(item.title)}
            </span>
          </button>
        );
      })}
    </div>
  </aside>
);

export default ToolSidebar;
