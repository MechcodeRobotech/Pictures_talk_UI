import React from 'react';
import styled from 'styled-components';
import LanguageSwitcher from './Language';
import ThemeToggle from './Theme';

const HEADER_HEIGHT_PX = 88;
const HEADER_PADDING_X_SM_PX = 16;
const HEADER_PADDING_X_MD_PX = 32;
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
    background: linear-gradient(180deg, rgba(8, 17, 27, 0.9) 0%, rgba(8, 17, 27, 0.72) 100%);
  }

  &.light {
    background: linear-gradient(180deg, rgba(244, 240, 232, 0.92) 0%, rgba(244, 240, 232, 0.7) 100%);
  }

  .logo-wrapper {
    position: relative;
    z-index: 10;
    flex: 1;
    max-width: ${LOGO_MAX_WIDTH_PX}px;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  .logo-inner {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .brand-mark {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, rgba(248, 175, 36, 0.96), rgba(255, 207, 92, 0.9));
    box-shadow: 0 16px 32px rgba(248, 175, 36, 0.28);
    flex-shrink: 0;
  }

  .brand-text {
    display: none;
    min-width: 0;
  }

  .brand-title {
    margin: 0;
    font-size: 16px;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--ui-text);
    font-weight: 800;
  }

  .brand-caption {
    margin: 4px 0 0;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ui-text-muted);
  }

  .logo {
    height: 28px;
    width: auto;
    object-fit: contain;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: ${ACTION_GAP_PX}px;
  }

  @media (min-width: ${BREAKPOINT_SM_PX}px) {
    .brand-text {
      display: block;
    }
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
        <div className="brand-text">
          <p className="brand-title">Pictures Talk</p>
          <p className="brand-caption">AI Meeting Workspace</p>
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
