import React from 'react';
import styled from 'styled-components';
import LanguageSwitcher from './Language';
import ThemeToggle from './Theme';

const HEADER_HEIGHT_PX = 88;
const HEADER_PADDING_X_SM_PX = 16;
const HEADER_PADDING_X_MD_PX = 32;
const LOGO_HEIGHT_PX = 64;
const LOGO_MAX_WIDTH_PX = 448;
const ACTION_GAP_PX = 12;
const BREAKPOINT_SM_PX = 640;
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
  border-bottom: 1px solid;
  flex-shrink: 0;
  z-index: 20;

  @media (min-width: ${BREAKPOINT_MD_PX}px) {
    padding: 0 ${HEADER_PADDING_X_MD_PX}px;
  }

  &.dark {
    border-color: rgba(255, 255, 255, 0.05);
    background: #242526;
  }

  &.light {
    border-color: rgba(226, 232, 240, 0.7);
    background: #f5f6f6;
  }

  .logo-wrapper {
    position: relative;
    z-index: 10;
    flex: 1;
    max-width: ${LOGO_MAX_WIDTH_PX}px;
    display: none;
  }

  @media (min-width: ${BREAKPOINT_SM_PX}px) {
    .logo-wrapper {
      display: block;
    }
  }

  .logo-inner {
    display: flex;
    align-items: center;
  }

  .logo {
    height: ${LOGO_HEIGHT_PX}px;
    width: auto;
    object-fit: contain;
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
        <img
          src={isDarkMode ? '/LogoDark.png' : '/LogoLight.png'}
          alt="Pictures Talk"
          className="logo"
        />
      </div>
    </div>

    <div className="actions">
      <LanguageSwitcher />
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} variant="header" />
    </div>
  </HeaderBar>
);

export default Header;
