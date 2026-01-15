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
    return 'p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors';
  })();

  const iconClassName = (() => {
    if (variant === 'header') {
      return 'material-icons-round text-[24px] relative top-[1px]';
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
