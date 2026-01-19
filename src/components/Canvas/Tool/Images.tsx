import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../types';

const PLACEHOLDER_SLOTS = 6;
const PLACEHOLDER_ITEMS = Array.from({ length: PLACEHOLDER_SLOTS }, (_, index) => index);
const DRAG_DATA_KEY = 'application/x-canvas-item';

interface ImagesToolProps {
  theme: Theme;
  t: (key: string) => string;
  onSelect?: (payload: { type: 'image'; url: string; name: string }) => void;
}

const ImagesToolWrapper = styled.div<{ $theme: Theme }>`
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .tile {
    aspect-ratio: 1 / 1;
    border-radius: 12px;
    border: 1px solid ${({ $theme }) => ($theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB')};
    background: ${({ $theme }) => ($theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F9FAFB')};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: transform 150ms ease, background-color 150ms ease;
    position: relative;
  }

  .tile:hover {
    transform: scale(1.05);
    background: ${({ $theme }) => ($theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F3F4F6')};
  }

  .tile-button {
    width: 100%;
    height: 100%;
    padding: 0;
    border: none;
    cursor: pointer;
    background: transparent;
    display: block;
  }

  .tile-button[draggable='true'] {
    cursor: grab;
  }

  .tile-button[draggable='true']:active {
    cursor: grabbing;
  }

  .thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .delete-button {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 1px solid ${({ $theme }) => ($theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#E5E7EB')};
    background: #ffffff;
    color: #111827;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 6px 10px rgba(17, 24, 39, 0.12);
    transition: transform 120ms ease, opacity 120ms ease;
  }

  .delete-button:hover {
    transform: scale(1.05);
  }

  .delete-button:active {
    transform: scale(0.95);
  }

  .placeholder-icon {
    color: #6b7280;
    font-size: 22px;
  }

  .upload-input {
    display: none;
  }

  .upload-button {
    width: 100%;
    padding: 12px 0;
    background: #f8af24;
    color: #003364;
    border: none;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 12px 20px rgba(17, 24, 39, 0.15);
    transition: transform 120ms ease, opacity 120ms ease;
  }

  .upload-button:hover {
    opacity: 0.9;
  }

  .upload-button:active {
    transform: scale(0.95);
  }
`;

const ImagesTool: React.FC<ImagesToolProps> = ({ theme, t, onSelect }) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const showPlaceholders = uploadedImages.length === 0;

  useEffect(() => {
    return () => {
      uploadedImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedImages]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const newUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...newUrls]);
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      const removedUrl = prev[index];
      if (removedUrl) {
        URL.revokeObjectURL(removedUrl);
      }
      return next;
    });
  };

  return (
    <ImagesToolWrapper $theme={theme}>
      <div className="grid">
        {uploadedImages.map((src, index) => (
          <div key={`${src}-${index}`} className="tile">
            <button
              type="button"
              className="tile-button"
              draggable
              onDragStart={(event) => {
                const data = JSON.stringify({ type: 'image', name: `image-${index + 1}`, url: src });
                event.dataTransfer.setData(DRAG_DATA_KEY, data);
                event.dataTransfer.setData('text/plain', data);
                event.dataTransfer.effectAllowed = 'copy';
              }}
              onClick={() => {
                onSelect?.({ type: 'image', name: `image-${index + 1}`, url: src });
              }}
            >
              <img src={src} alt={t('upload_btn')} className="thumb" />
            </button>
            <button
              type="button"
              className="delete-button"
              aria-label="Remove image"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                handleRemoveImage(index);
              }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        ))}
        {showPlaceholders &&
          PLACEHOLDER_ITEMS.map((i) => (
            <div key={`placeholder-${i}`} className="tile">
              <span className="material-symbols-outlined placeholder-icon">image</span>
            </div>
          ))}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="upload-input"
        onChange={handleFileChange}
      />
      <button type="button" onClick={handleUploadClick} className="upload-button">
        {t('upload_btn')}
      </button>
    </ImagesToolWrapper>
  );
};

export default ImagesTool;
