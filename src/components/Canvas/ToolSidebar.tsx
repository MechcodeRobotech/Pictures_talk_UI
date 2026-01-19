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
  tools: ToolItem[];
  activeTool: Tool | null;
  onToolToggle: (tool: Tool) => void;
  toolRefs: React.MutableRefObject<{ [key in Tool]?: HTMLButtonElement | null }>;
  sidebarRef: React.RefObject<HTMLElement>;
}

const ToolSidebar: React.FC<ToolSidebarProps> = ({
  theme,
  tools,
  activeTool,
  onToolToggle,
  toolRefs,
  sidebarRef,
}) => (
  <aside
    ref={sidebarRef}
    className={`w-16 flex flex-col items-center py-6 backdrop-blur-xl border rounded-3xl shadow-2xl z-20 shrink-0 gap-4 h-fit self-start transition-all ${
      theme === 'dark' ? 'bg-[#1a1a1a]/80 border-white/10' : 'bg-white/80 border-gray-200'
    }`}
  >
    {tools.map((item) => (
      <button
        key={item.id}
        ref={(el) => {
          toolRefs.current[item.id] = el;
        }}
        onClick={() => onToolToggle(item.id)}
        className="group w-full relative flex justify-center"
      >
        {activeTool === item.id && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full animate-fadeIn"></div>
        )}
        <div
          className={`size-11 flex items-center justify-center rounded-2xl transition-all relative z-10 mx-2 ${
            activeTool === item.id
              ? 'bg-primary text-navy shadow-lg scale-110'
              : 'text-gray-400 hover:text-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${activeTool === item.id ? 'filled' : ''}`}>
            {item.icon}
          </span>
        </div>
      </button>
    ))}
  </aside>
);

export default ToolSidebar;
