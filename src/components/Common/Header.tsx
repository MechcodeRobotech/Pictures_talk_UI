import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';
import LanguageSwitcher from './Language';
import ThemeToggle from './Theme';


interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useLanguage();

  return (
    <header
      className={`w-full h-[80px] flex items-center justify-between px-4 md:px-8 border-b border-gray-100 dark:border-gray-800 shrink-0 z-20 ${
        isDarkMode ? 'bg-[#242526]' : 'bg-[#f5f6f6]'
      }`}
    >
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="flex items-center">
          <img
            src={isDarkMode ? '/LogoDark.png' : '/LogoLight.png'}
            alt="Pictures Talk"
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        
      </div>
    </header>
  );
};

export default Header;
