import React, { useEffect, useMemo, useState } from 'react';
import { Theme } from '../../../types';
import type { CanvasStageHandle } from '../CanvasStage';

interface TypographySectionProps {
  theme: Theme;
  t: (key: string) => string;
  canvasRef: React.RefObject<CanvasStageHandle>;
  selectionFontData?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    textAlign?: string;
  } | null;
}

interface FontOption {
  label: string;
  family: string;
  spec: string;
}

const GOOGLE_FONTS_API_URL = 'https://fonts.googleapis.com/css2?family=';
const FONT_OPTIONS: FontOption[] = [
  { label: 'Kanit', family: 'Kanit', spec: 'Kanit:wght@300;400;500;600;700' },
  { label: 'Prompt', family: 'Prompt', spec: 'Prompt:wght@300;400;500;600;700' },
  { label: 'Sarabun', family: 'Sarabun', spec: 'Sarabun:wght@300;400;500;600;700' },
  { label: 'IBM Plex Sans Thai', family: 'IBM Plex Sans Thai', spec: 'IBM Plex Sans Thai:wght@300;400;500;600;700' },
  { label: 'Inter', family: 'Inter', spec: 'Inter:wght@300;400;500;600;700;800' },
  { label: 'Manrope', family: 'Manrope', spec: 'Manrope:wght@300;400;500;600;700;800' },
  { label: 'DM Sans', family: 'DM Sans', spec: 'DM Sans:wght@300;400;500;700' },
  { label: 'Plus Jakarta Sans', family: 'Plus Jakarta Sans', spec: 'Plus Jakarta Sans:wght@300;400;500;600;700;800' },
  { label: 'Outfit', family: 'Outfit', spec: 'Outfit:wght@300;400;500;600;700' },
  { label: 'Space Grotesk', family: 'Space Grotesk', spec: 'Space Grotesk:wght@300;400;500;600;700' },
  { label: 'Playfair Display', family: 'Playfair Display', spec: 'Playfair Display:wght@400;500;600;700' },
  { label: 'Merriweather', family: 'Merriweather', spec: 'Merriweather:wght@300;400;700' },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];
const FONT_WEIGHTS = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
];
const TEXT_ALIGNS = [
  { value: 'left', icon: 'format_align_left' },
  { value: 'center', icon: 'format_align_center' },
  { value: 'right', icon: 'format_align_right' },
];

const TypographySection: React.FC<TypographySectionProps> = ({ theme, t, canvasRef, selectionFontData }) => {
  const [selectedFont, setSelectedFont] = useState<string>('Kanit');
  const [selectedSize, setSelectedSize] = useState<number>(16);
  const [selectedWeight, setSelectedWeight] = useState<string>('400');
  const [selectedAlign, setSelectedAlign] = useState<string>('left');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadedFonts, setLoadedFonts] = useState<Record<string, boolean>>({});

  const loadFont = async (font: FontOption) => {
    if (loadedFonts[font.family]) return;

    const linkId = `font-${font.family.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(linkId)) {
      setLoadedFonts((prev) => ({ ...prev, [font.family]: true }));
      return;
    }

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `${GOOGLE_FONTS_API_URL}${encodeURIComponent(font.spec)}&display=swap&subset=thai,latin`;
    document.head.appendChild(link);

    await new Promise<void>((resolve) => {
      link.onload = () => resolve();
      link.onerror = () => resolve();
    });

    setLoadedFonts((prev) => ({ ...prev, [font.family]: true }));
  };

  useEffect(() => {
    FONT_OPTIONS.slice(0, 6).forEach((font) => {
      void loadFont(font);
    });
  }, []);

  useEffect(() => {
    if (!selectionFontData) return;

    if (selectionFontData.fontFamily) {
      setSelectedFont(selectionFontData.fontFamily);
      const matchedFont = FONT_OPTIONS.find((font) => font.family === selectionFontData.fontFamily);
      if (matchedFont) {
        void loadFont(matchedFont);
      }
    }
    if (selectionFontData.fontSize) {
      setSelectedSize(selectionFontData.fontSize);
    }
    if (selectionFontData.fontWeight) {
      setSelectedWeight(selectionFontData.fontWeight);
    }
    if (selectionFontData.textAlign) {
      setSelectedAlign(selectionFontData.textAlign);
    }
  }, [selectionFontData]);

  const filteredFonts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return FONT_OPTIONS;

    return FONT_OPTIONS.filter((font) => font.label.toLowerCase().includes(normalizedQuery));
  }, [searchQuery]);

  const handleFontChange = async (fontFamily: string) => {
    setSelectedFont(fontFamily);
    canvasRef.current?.updateActiveObjectFont({ fontFamily });

    const matchedFont = FONT_OPTIONS.find((font) => font.family === fontFamily);
    if (matchedFont) {
      await loadFont(matchedFont);
    }
  };

  const handleSizeChange = (fontSize: number) => {
    setSelectedSize(fontSize);
    canvasRef.current?.updateActiveObjectFont({ fontSize });
  };

  const handleWeightChange = (fontWeight: string) => {
    setSelectedWeight(fontWeight);
    canvasRef.current?.updateActiveObjectFont({ fontWeight });
  };

  const handleAlignChange = (textAlign: string) => {
    setSelectedAlign(textAlign);
    canvasRef.current?.updateActiveObjectFont({ textAlign: textAlign as 'left' | 'center' | 'right' });
  };

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border px-4 py-3 ${
        theme === 'dark' ? 'border-white/8 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'
      }`}>
        <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {t('typography')}
        </p>

        <div className={`mb-3 flex items-center gap-2 rounded-2xl border px-3 py-2 ${
          theme === 'dark' ? 'border-white/10 bg-[#0b1220]' : 'border-slate-200 bg-white'
        }`}>
          <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t('search_fonts_placeholder')}
            className={`w-full bg-transparent text-sm outline-none ${
              theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>

        <div className="grid max-h-44 gap-2 overflow-y-auto pr-1">
          {filteredFonts.length > 0 ? (
            filteredFonts.map((font) => (
              <button
                key={font.family}
                type="button"
                onClick={() => void handleFontChange(font.family)}
                className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                  selectedFont === font.family
                    ? 'border-primary/30 bg-primary/12 text-primary'
                    : theme === 'dark'
                      ? 'border-white/8 bg-white/[0.03] text-white hover:bg-white/[0.06]'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className="block text-sm font-medium" style={{ fontFamily: font.family }}>
                  {font.label}
                </span>
              </button>
            ))
          ) : (
            <div className={`rounded-2xl border px-4 py-3 text-sm ${
              theme === 'dark' ? 'border-white/8 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-white text-slate-500'
            }`}>
              {t('no_fonts_found')}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_96px] gap-3">
        <div className={`rounded-2xl border px-4 py-3 ${
          theme === 'dark' ? 'border-white/8 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'
        }`}>
          <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Weight
          </p>
          <div className="grid gap-2">
            {FONT_WEIGHTS.map((weight) => (
              <button
                key={weight.value}
                type="button"
                onClick={() => handleWeightChange(weight.value)}
                className={`rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  selectedWeight === weight.value
                    ? 'bg-primary/14 text-primary'
                    : theme === 'dark'
                      ? 'text-slate-300 hover:bg-white/[0.06]'
                      : 'text-slate-600 hover:bg-white'
                }`}
              >
                {weight.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border px-4 py-3 ${
          theme === 'dark' ? 'border-white/8 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'
        }`}>
          <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Size
          </p>
          <input
            type="number"
            value={selectedSize}
            onChange={(event) => {
              const nextSize = parseInt(event.target.value, 10);
              if (!nextSize || nextSize <= 0) return;
              handleSizeChange(nextSize);
            }}
            className={`mb-3 w-full bg-transparent text-2xl font-semibold outline-none ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          />
          <div className="grid gap-2">
            {FONT_SIZES.slice(0, 5).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeChange(size)}
                className={`rounded-xl px-2 py-1.5 text-sm transition-colors ${
                  selectedSize === size
                    ? 'bg-primary/14 text-primary'
                    : theme === 'dark'
                      ? 'text-slate-300 hover:bg-white/[0.06]'
                      : 'text-slate-600 hover:bg-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border p-2 ${
        theme === 'dark' ? 'border-white/8 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="grid grid-cols-3 gap-2">
          {TEXT_ALIGNS.map((align) => (
            <button
              key={align.value}
              type="button"
              onClick={() => handleAlignChange(align.value)}
              className={`rounded-xl py-2.5 transition-colors ${
                selectedAlign === align.value
                  ? 'bg-primary text-navy'
                  : theme === 'dark'
                    ? 'text-slate-300 hover:bg-white/[0.06]'
                    : 'text-slate-600 hover:bg-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{align.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypographySection;
