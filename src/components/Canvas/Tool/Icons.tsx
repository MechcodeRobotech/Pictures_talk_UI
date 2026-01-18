import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../types';

const ICON_PLACEHOLDERS = [1, 2, 3, 4, 5, 6];
const PRIMARY_COLOR = '#F8AF24';

interface IconsToolProps {
  theme: Theme;
  t: (key: string) => string;
}

const IconsTool: React.FC<IconsToolProps> = ({ theme, t }) => (
  <IconsToolWrap $theme={theme}>
    <div className="searchRow">
      <span className="material-symbols-outlined searchIcon">search</span>
      <input type="text" placeholder={t('search_placeholder')} className="searchInput" />
    </div>
    <div className="iconsGrid">
      {ICON_PLACEHOLDERS.map((i) => (
        <div key={i} className="iconTile">
          <span className="material-symbols-outlined iconGlyph">mood</span>
        </div>
      ))}
    </div>
  </IconsToolWrap>
);

const IconsToolWrap = styled.div<{ $theme: Theme }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.25rem;

  .searchRow {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid
      ${({ $theme }) => ($theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB')};
    background: ${({ $theme }) => ($theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : '#F9FAFB')};
    transition: border-color 150ms ease, background-color 150ms ease;

    &:focus-within {
      border-color: ${PRIMARY_COLOR};
    }
  }

  .searchIcon {
    font-size: 18px;
    color: #6b7280;
  }

  .searchInput {
    flex: 1;
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.75rem;
    color: #9ca3af;

    &::placeholder {
      color: #4b5563;
    }
  }

  .iconsGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .iconTile {
    aspect-ratio: 1 / 1;
    border-radius: 0.75rem;
    border: 1px solid
      ${({ $theme }) => ($theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB')};
    background: ${({ $theme }) => ($theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F9FAFB')};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 150ms ease, background-color 150ms ease;

    &:hover {
      transform: scale(1.05);
      background: ${({ $theme }) => ($theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F3F4F6')};
    }
  }

  .iconGlyph {
    color: #6b7280;
  }
`;

export default IconsTool;
