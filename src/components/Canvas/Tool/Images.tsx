import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../types';

const PLACEHOLDER_SLOTS = 6;
const PLACEHOLDER_ITEMS = Array.from({ length: PLACEHOLDER_SLOTS }, (_, index) => index);

interface ImagesToolProps {
  theme: Theme;
  t: (key: string) => string;
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
  }

  .tile:hover {
    transform: scale(1.05);
    background: ${({ $theme }) => ($theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F3F4F6')};
  }

  .tile-button {
    padding: 0;
    border: none;
    cursor: pointer;
    background: transparent;
  }

  .thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
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

const ImagesTool: React.FC<ImagesToolProps> = ({ theme, t }) => {
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

  return (
    <ImagesToolWrapper $theme={theme}>
      <div className="grid">
        {uploadedImages.map((src, index) => (
          <button key={`${src}-${index}`} type="button" className="tile tile-button">
            <img src={src} alt={t('upload_btn')} className="thumb" />
          </button>
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
