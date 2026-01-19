import React from 'react';

type ThemeToggleVariant = 'header' | 'login' | 'canvas';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  variant?: ThemeToggleVariant;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDarkMode,
  toggleTheme,
  variant = 'header',
  className,
}) => {
  const buttonClassName = (() => {
    if (variant === 'login') {
      return 'p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors';
    }
    if (variant === 'canvas') {
      return 'p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-90';
    }
    return 'w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_10px_22px_rgba(15,23,42,0.12)] hover:text-slate-800 hover:shadow-[0_12px_26px_rgba(15,23,42,0.16)] transition-all grid place-items-center dark:bg-[#242526] dark:text-slate-100 dark:border-white/60';
  })();

  const iconClassName = (() => {
    if (variant === 'header') {
      return 'material-symbols-outlined text-[22px]';
    }
    if (variant === 'canvas') {
      return 'material-symbols-outlined text-[20px]';
    }
    return 'material-icons-round';
  })();

  return (
    <button
      onClick={toggleTheme}
      className={`${buttonClassName}${className ? ` ${className}` : ''}`}
      title={variant === 'login' ? (isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode') : undefined}
    >
      <span className={iconClassName}>
        {isDarkMode ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
