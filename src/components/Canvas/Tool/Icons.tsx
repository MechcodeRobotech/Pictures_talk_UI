import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../types';

const PRIMARY_COLOR = '#F8AF24';
const DEFAULT_QUERY = 'icon';
const SEARCH_LIMIT = 48;
const ICON_SIZE = 24;
const LIGHT_ICON_COLOR = '#6b7280';
const DARK_ICON_COLOR = '#9ca3af';
const DRAG_DATA_KEY = 'application/x-canvas-item';

interface IconsToolProps {
  theme: Theme;
  t: (key: string) => string;
  onSelect?: (payload: { type: 'icon'; url: string; name: string }) => void;
}

const IconsTool: React.FC<IconsToolProps> = ({ theme, t, onSelect }) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [icons, setIcons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iconColor = theme === 'dark' ? DARK_ICON_COLOR : LIGHT_ICON_COLOR;

  const buildApiUrl = useMemo(() => {
    return (path: string) => (apiBaseUrl ? new URL(path, apiBaseUrl).toString() : path);
  }, [apiBaseUrl]);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setIcons([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const searchUrl = buildApiUrl(
          `/api/iconify/search?query=${encodeURIComponent(normalizedQuery)}&limit=${SEARCH_LIMIT}`,
        );
        const response = await fetch(searchUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('iconify-search-failed');
        }
        const data = await response.json();
        const nextIcons = Array.isArray(data?.icons) ? data.icons : [];
        setIcons(nextIcons);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError('failed');
          setIcons([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [buildApiUrl, query]);

  return (
    <IconsToolWrap $theme={theme}>
      <div className="searchRow">
        <span className="material-symbols-outlined searchIcon">search</span>
        <input
          type="text"
          placeholder={t('search_placeholder')}
          className="searchInput"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {error && <div className="statusText">{t('upload_failed')}</div>}
      {!error && isLoading && <div className="statusText">Loading...</div>}
      {!error && !isLoading && icons.length === 0 && (
        <div className="statusText">No icons found.</div>
      )}
      <div className="iconsGrid">
        {icons.map((name) => {
          const iconUrl = buildApiUrl(
            `/api/iconify/svg?name=${encodeURIComponent(name)}&width=${ICON_SIZE}&height=${ICON_SIZE}&color=${encodeURIComponent(iconColor)}`,
          );
          return (
            <div
              key={name}
              className="iconTile"
              title={name}
              draggable
              onDragStart={(event) => {
                const data = JSON.stringify({ type: 'icon', name, url: iconUrl });
                event.dataTransfer.setData(DRAG_DATA_KEY, data);
                event.dataTransfer.setData('text/plain', data);
                event.dataTransfer.effectAllowed = 'copy';
              }}
              onClick={() => {
                onSelect?.({ type: 'icon', name, url: iconUrl });
              }}
            >
              <img className="iconGlyph" src={iconUrl} alt={name} loading="lazy" />
            </div>
          );
        })}
      </div>
    </IconsToolWrap>
  );
};

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
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.5rem;
    max-height: 260px;
    overflow-y: auto;
    padding-right: 0.25rem;
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
    padding: 0.25rem;
    overflow: hidden;
    cursor: grab;
    transition: transform 150ms ease, background-color 150ms ease;

    &:hover {
      transform: scale(1.05);
      background: ${({ $theme }) => ($theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F3F4F6')};
    }

    &:active {
      cursor: grabbing;
    }
  }

  .iconGlyph {
    width: 100%;
    height: 100%;
    max-width: 24px;
    max-height: 24px;
    object-fit: contain;
    display: block;
  }

  .statusText {
    font-size: 0.75rem;
    color: #6b7280;
  }
`;

export default IconsTool;
