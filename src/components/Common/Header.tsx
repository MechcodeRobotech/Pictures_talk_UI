import React from 'react';
import LanguageSwitcher from './Language';
import ThemeToggle from './Theme';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => (
  <header
    className={`w-full h-[88px] flex items-center justify-between px-4 md:px-8 border-b shrink-0 z-20 ${
      isDarkMode ? 'border-white/5 bg-[#242526]' : 'border-slate-200/70 bg-[#f5f6f6]'
    }`}
  >

    <div className="relative z-10 flex-1 max-w-md hidden sm:block">
      <div className="flex items-center">
        <img
          src={isDarkMode ? '/LogoDark.png' : '/LogoLight.png'}
          alt="Pictures Talk"
          className="h-16 w-auto object-contain"
        />
      </div>
    </div>

    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} variant="header" />
    </div>
  </header>
);

export default Header;
