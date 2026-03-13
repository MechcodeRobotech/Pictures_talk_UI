import React from 'react';
import styled from 'styled-components';
import LanguageSwitcher from './Language';
import ThemeToggle from './Theme';

const HEADER_HEIGHT_PX = 88;
const HEADER_PADDING_X_SM_PX = 16;
const HEADER_PADDING_X_MD_PX = 32;
const ACTION_GAP_PX = 12;
const BREAKPOINT_MD_PX = 768;

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const HeaderBar = styled.header`
  width: 100%;
  height: ${HEADER_HEIGHT_PX}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${HEADER_PADDING_X_SM_PX}px;
  border-bottom: 1px solid var(--ui-border);
  flex-shrink: 0;
  z-index: 20;
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;

  @media (min-width: ${BREAKPOINT_MD_PX}px) {
    padding: 0 ${HEADER_PADDING_X_MD_PX}px;
  }

  &.dark {
    background: #262626;
  }

  &.light {
    background: #f1f1f1;
  }

  .logo-wrapper {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
  }

  .logo-inner {
    display: flex;
    align-items: center;
  }

  .brand-mark {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo {
    height: 48px;
    width: auto;
    object-fit: contain;
    display: block;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: ${ACTION_GAP_PX}px;
  }

`;

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => (
  <HeaderBar className={isDarkMode ? 'dark' : 'light'}>
    <div className="logo-wrapper">
      <div className="logo-inner">
        <div className="brand-mark">
          <img
            src={isDarkMode ? '/LogoDark.png' : '/LogoLight.png'}
            alt="Pictures Talk"
            className="logo"
          />
        </div>
      </div>
    </div>

    <div className="actions">
      <LanguageSwitcher />
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} variant="header" />
    </div>
  </HeaderBar>
);

export default Header;
