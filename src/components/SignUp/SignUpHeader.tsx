import React from 'react';
import {
  Actions,
  Brand,
  BrandIcon,
  BrandText,
  GhostButton,
  IconButton,
  TopBar,
} from './styles';

interface SignUpHeaderProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const SignUpHeader: React.FC<SignUpHeaderProps> = ({ isDarkMode, toggleTheme }) => (
  <TopBar>
    <Brand>
      <BrandIcon aria-hidden="true" className="material-symbols-outlined">auto_awesome</BrandIcon>
      <BrandText>Pictures Talk</BrandText>
    </Brand>
    <Actions>
      <GhostButton type="button">
        <span className="material-symbols-outlined" aria-hidden="true">language</span>
        <span>English</span>
        <span className="material-symbols-outlined" aria-hidden="true">expand_more</span>
      </GhostButton>
      <IconButton
        type="button"
        onClick={() => toggleTheme?.()}
        aria-label="Toggle theme"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {isDarkMode ? 'light_mode' : 'dark_mode'}
        </span>
      </IconButton>
    </Actions>
  </TopBar>
);

export default SignUpHeader;
