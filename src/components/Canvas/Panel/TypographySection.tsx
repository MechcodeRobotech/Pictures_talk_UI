import React, { useState, useEffect, useCallback } from 'react';
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

const GOOGLE_FONTS_API_URL = 'https://fonts.googleapis.com/css2?family=';
// ฟอนต์ยอดนิยม - โหลดตอน mount (50 ฟอนต์)
const POPULAR_FONTS = [
  // ฟอนต์ภาษาไทย
  'Kanit:wght@100;200;300;400;500;600;700;800;900',
  'Prompt:wght@100;200;300;400;500;600;700;800;900',
  'Sarabun:wght@100;200;300;400;500;600;700;800;900',
  'Chakra Petch:wght@100;200;300;400;500;600;700;800;900',
  'Mitr:wght@100;200;300;400;500;600;700;800;900',
  'IBM Plex Sans Thai:wght@100;200;300;400;500;600;700;800;900',
  'Noto Sans Thai:wght@100;200;300;400;500;600;700;800;900',
  'Sriracha:wght@100;200;300;400;500;600;700;800;900',
  'Chonburi:wght@100;200;300;400;500;600;700;800;900',
  'Athiti:wght@100;200;300;400;500;600;700;800;900',
  // ฟอนต์อินเตอร์เนชันัลยอดนิยม
  'Inter:wght@100;200;300;400;500;600;700;800;900',
  'Roboto:wght@100;200;300;400;500;600;700;800;900',
  'Open Sans:wght@100;200;300;400;500;600;700;800;900',
  'Montserrat:wght@100;200;300;400;500;600;700;800;900',
  'Lato:wght@100;200;300;400;500;600;700;800;900',
  'Poppins:wght@100;200;300;400;500;600;700;800;900',
  'Source Sans Pro:wght@100;200;300;400;500;600;700;800;900',
  'Ubuntu:wght@100;200;300;400;500;600;700;800;900',
  'Nunito:wght@100;200;300;400;500;600;700;800;900',
  'Raleway:wght@100;200;300;400;500;600;700;800;900',
  'Oswald:wght@100;200;300;400;500;600;700;800;900',
  'Roboto Condensed:wght@100;200;300;400;500;600;700;800;900',
  'Oxygen:wght@100;200;300;400;500;600;700;800;900',
  'Merriweather:wght@100;200;300;400;500;600;700;800;900',
  'Playfair Display:wght@100;200;300;400;500;600;700;800;900',
  'Abril Fatface:wght@100;200;300;400;500;600;700;800;900',
  'Dancing Script:wght@100;200;300;400;500;600;700;800;900',
  'Pacifico:wght@100;200;300;400;500;600;700;800;900',
  'Lobster:wght@100;200;300;400;500;600;700;800;900',
  'Caveat:wght@100;200;300;400;500;600;700;800;900',
  'Quicksand:wght@100;200;300;400;500;600;700;800;900',
  'Noto Sans:wght@100;200;300;400;500;600;700;800;900',
  'Roboto Mono:wght@100;200;300;400;500;600;700;800;900',
  'Fira Code:wght@100;200;300;400;500;600;700;800;900',
  'JetBrains Mono:wght@100;200;300;400;500;600;700;800;900',
  'Barlow:wght@100;200;300;400;500;600;700;800;900',
  'Cinzel:wght@100;200;300;400;500;600;700;800;900',
  'Lora:wght@100;200;300;400;500;600;700;800;900',
  'Bebas Neue:wght@100;200;300;400;500;600;700;800;900',
  'Josefin Sans:wght@100;200;300;400;500;600;700;800;900',
  'Work Sans:wght@100;200;300;400;500;600;700;800;900',
  'Manrope:wght@100;200;300;400;500;600;700;800;900',
  'DM Sans:wght@100;200;300;400;500;600;700;800;900',
  'Plus Jakarta Sans:wght@100;200;300;400;500;600;700;800;900',
  'Outfit:wght@100;200;300;400;500;600;700;800;900',
  'Space Grotesk:wght@100;200;300;400;500;600;700;800;900',
  'Space Mono:wght@100;200;300;400;500;600;700;800;900',
  'Bodoni Moda:wght@100;200;300;400;500;600;700;800;900',
  'Libre Baskerville:wght@100;200;300;400;500;600;700;800;900',
];

// ฟอนต์เพิ่มเติม - โหลดเมื่อเลือก (500+ ฟอนต์)
const ADDITIONAL_FONTS = [
  'Alegreya:wght@100;200;300;400;500;600;700;800;900',
  'Alegreya Sans:wght@100;200;300;400;500;600;700;800;900',
  'Arvo:wght@100;200;300;400;500;600;700;800;900',
  'Bitter:wght@100;200;300;400;500;600;700;800;900',
  'Crimson Text:wght@100;200;300;400;500;600;700;800;900',
  'PT Serif:wght@100;200;300;400;500;600;700;800;900',
  'Libre Franklin:wght@100;200;300;400;500;600;700;800;900',
  'Mulish:wght@100;200;300;400;500;600;700;800;900',
  'Rubik:wght@100;200;300;400;500;600;700;800;900',
  'Comfortaa:wght@100;200;300;400;500;600;700;800;900',
  'Righteous:wght@100;200;300;400;500;600;700;800;900',
  'Architects Daughter:wght@100;200;300;400;500;600;700;800;900',
  'Kalam:wght@100;200;300;400;500;600;700;800;900',
  'Handlee:wght@100;200;300;400;500;600;700;800;900',
  'Shadows Into Light:wght@100;200;300;400;500;600;700;800;900',
  'Indie Flower:wght@100;200;300;400;500;600;700;800;900',
  'Permanent Marker:wght@100;200;300;400;500;600;700;800;900',
  'Gloria Hallelujah:wght@100;200;300;400;500;600;700;800;900',
  'Rock Salt:wght@100;200;300;400;500;600;700;800;900',
  'Amatic SC:wght@100;200;300;400;500;600;700;800;900',
  'Reenie Beanie:wght@100;200;300;400;500;600;700;800;900',
  'Bangers:wght@100;200;300;400;500;600;700;800;900',
  'Bungee:wght@100;200;300;400;500;600;700;800;900',
  'Creepster:wght@100;200;300;400;500;600;700;800;900',
  'Freckle Face:wght@100;200;300;400;500;600;700;800;900',
  'Luckiest Guy:wght@100;200;300;400;500;600;700;800;900',
  'Press Start 2P:wght@100;200;300;400;500;600;700;800;900',
  'VT323:wght@100;200;300;400;500;600;700;800;900',
  'ZCOOL KuaiLe:wght@100;200;300;400;500;600;700;800;900',
  'ZCOOL XiaoWei:wght@100;200;300;400;500;600;700;800;900',
  'ZCOOL QingKe HuangYou:wght@100;200;300;400;500;600;700;800;900',
  'Noto Serif:wght@100;200;300;400;500;600;700;800;900',
  'Playfair:wght@100;200;300;400;500;600;700;800;900',
  'Cormorant:wght@100;200;300;400;500;600;700;800;900',
  'Cormorant Garamond:wght@100;200;300;400;500;600;700;800;900',
  'Old Standard TT:wght@100;200;300;400;500;600;700;800;900',
  'Cinzel Decorative:wght@100;200;300;400;500;600;700;800;900',
  'UnifrakturMaguntia:wght@100;200;300;400;500;600;700;800;900',
  'MedievalSharp:wght@100;200;300;400;500;600;700;800;900',
  'Prata:wght@100;200;300;400;500;600;700;800;900',
  'Abril Fatface:wght@100;200;300;400;500;600;700;800;900',
  'Zeyada:wght@100;200;300;400;500;600;700;800;900',
  'Alex Brush:wght@100;200;300;400;500;600;700;800;900',
  'Great Vibes:wght@100;200;300;400;500;600;700;800;900',
  'Sacramento:wght@100;200;300;400;500;600;700;800;900',
  'Allura:wght@100;200;300;400;500;600;700;800;900',
  'Cookie:wght@100;200;300;400;500;600;700;800;900',
  'Dancing Script:wght@100;200;300;400;500;600;700;800;900',
  'Kaushan Script:wght@100;200;300;400;500;600;700;800;900',
  'Parisienne:wght@100;200;300;400;500;600;700;800;900',
  'Marck Script:wght@100;200;300;400;500;600;700;800;900',
  'Pinyon Script:wght@100;200;300;400;500;600;700;800;900',
  'Meie Script:wght@100;200;300;400;500;600;700;800;900',
  'Satisfy:wght@100;200;300;400;500;600;700;800;900',
  'Yellowtail:wght@100;200;300;400;500;600;700;800;900',
  'Tangerine:wght@100;200;300;400;500;600;700;800;900',
  'Herr Von Muellerhoff:wght@100;200;300;400;500;600;700;800;900',
  'Felipa:wght@100;200;300;400;500;600;700;800;900',
  'Walter Turncoat:wght@100;200;300;400;500;600;700;800;900',
  'Homemade Apple:wght@100;200;300;400;500;600;700;800;900',
  'Mrs Saint Delafield:wght@100;200;300;400;500;600;700;800;900',
  'League Script:wght@100;200;300;400;500;600;700;800;900',
  'Over the Rainbow:wght@100;200;300;400;500;600;700;800;900',
  'RocknRoll One:wght@100;200;300;400;500;600;700;800;900',
  'Red Rose:wght@100;200;300;400;500;600;700;800;900',
  'Linden Hill:wght@100;200;300;400;500;600;700;800;900',
  'Prosto One:wght@100;200;300;400;500;600;700;800;900',
  'Alike:wght@100;200;300;400;500;600;700;800;900',
  'Rouge Script:wght@100;200;300;400;500;600;700;800;900',
  'Waiting for the Sunrise:wght@100;200;300;400;500;600;700;800;900',
  'Stalemate:wght@100;200;300;400;500;600;700;800;900',
  'Englebert:wght@100;200;300;400;500;600;700;800;900',
  'Sue Ellen Francisco:wght@100;200;300;400;500;600;700;800;900',
  'Swanky and Moo Moo:wght@100;200;300;400;500;600;700;800;900',
  'Itim:wght@100;200;300;400;500;600;700;800;900',
  'Mali:wght@100;200;300;400;500;600;700;800;900',
  'Thai:Thai:wght@100;200;300;400;500;600;700;800;900',
  'Fahkwang:wght@100;200;300;400;500;600;700;800;900',
  'Taviraj:wght@100;200;300;400;500;600;700;800;900',
  'Kodchasan:wght@100;200;300;400;500;600;700;800;900',
  'Pridi:wght@100;200;300;400;500;600;700;800;900',
  'Pridi:wght@100;200;300;400;500;600;700;800;900',
  'K2D:wght@100;200;300;400;500;600;700;800;900',
  'KoHo:wght@100;200;300;400;500;600;700;800;900',
  'Trirong:wght@100;200;300;400;500;600;700;800;900',
  'Charmonman:wght@100;200;300;400;500;600;700;800;900',
  'Mali:wght@100;200;300;400;500;600;700;800;900',
  'Itim:wght@100;200;300;400;500;600;700;800;900',
  'Pridi:wght@100;200;300;400;500;600;700;800;900',
  'Kodchasan:wght@100;200;300;400;500;600;700;800;900',
  'Sriracha:wght@100;200;300;400;500;600;700;800;900',
  'Chonburi:wght@100;200;300;400;500;600;700;800;900',
  'Athiti:wght@100;200;300;400;500;600;700;800;900',
];

// รวมฟอนต์ทั้งหมด (สำหรับค้นหา)
const ALL_FONTS = [...POPULAR_FONTS, ...ADDITIONAL_FONTS];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];
const FONT_WEIGHTS = [
  { value: '100', label: 'Thin', abbr: 'T' },
  { value: '200', label: 'Extra Light', abbr: 'EL' },
  { value: '300', label: 'Light', abbr: 'L' },
  { value: '400', label: 'Regular', abbr: 'R' },
  { value: '500', label: 'Medium', abbr: 'M' },
  { value: '600', label: 'Semi Bold', abbr: 'SB' },
  { value: '700', label: 'Bold', abbr: 'B' },
  { value: '800', label: 'Extra Bold', abbr: 'EB' },
  { value: '900', label: 'Black', abbr: 'BL' },
];
const TEXT_ALIGNS = ['left', 'center', 'right'];

const TypographySection: React.FC<TypographySectionProps> = ({ theme, t, canvasRef, selectionFontData }) => {
  const [selectedFont, setSelectedFont] = useState<string>('Kanit');
  const [selectedSize, setSelectedSize] = useState<number>(16);
  const [selectedWeight, setSelectedWeight] = useState<string>('400');
  const [selectedAlign, setSelectedAlign] = useState<string>('left');
  const [isLoadingFonts, setIsLoadingFonts] = useState(false);
  const [loadingAdditionalFonts, setLoadingAdditionalFonts] = useState<string[]>([]);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isWeightDropdownOpen, setIsWeightDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ติดตามฟอนต์ที่โหลดแล้ว
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  // Sync ค่าจาก text object ที่ถูกเลือก
  useEffect(() => {
    if (selectionFontData) {
      if (selectionFontData.fontFamily) {
        setSelectedFont(selectionFontData.fontFamily);
        // โหลดฟอนต์ถ้ายังไม่ได้โหลด
        const fontSpec = ALL_FONTS.find(f => f.startsWith(selectionFontData.fontFamily));
        if (fontSpec && !loadedFonts.has(selectionFontData.fontFamily)) {
          setLoadingAdditionalFonts(prev => [...prev, selectionFontData.fontFamily!]);
          loadFontDynamic(fontSpec);
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
    }
  }, [selectionFontData, loadedFonts]); // ลบ loadFontDynamic ออกเพื่อป้องกัน infinite loop

  // โหลดฟอนต์แบบ dynamic ใช้ FontFace API
  const loadFontDynamic = useCallback(async (fontSpec: string): Promise<void> => {
    const fontFamily = fontSpec.split(':')[0];
    if (loadedFonts.has(fontFamily)) {
      return;
    }

    const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(linkId)) {
      setLoadedFonts(prev => new Set([...prev, fontFamily]));
      return;
    }

    // Load CSS
    const link = document.createElement('link');
    link.id = linkId;
    link.href = `${GOOGLE_FONTS_API_URL}${encodeURIComponent(fontSpec)}&display=swap&subset=thai,latin`;
    link.rel = 'stylesheet';

    await new Promise<void>((resolve) => {
      link.onload = () => {
        console.log('Font CSS loaded:', fontFamily);
        resolve();
      };
      link.onerror = () => {
        console.error('Font CSS failed to load:', fontFamily);
        resolve();
      };
      document.head.appendChild(link);
    });

    // Wait for font to be ready using document.fonts.ready
    try {
      await document.fonts.ready;
      console.log('Document fonts ready, checking font:', fontFamily);

      // Check if font is loaded
      const isLoaded = Array.from(document.fonts).some(font => font.family === fontFamily);
      if (isLoaded) {
        console.log('Font successfully loaded:', fontFamily);
        setLoadedFonts(prev => new Set([...prev, fontFamily]));
        setLoadingAdditionalFonts(prev => prev.filter(f => f !== fontFamily));
      } else {
        console.warn('Font may not be fully loaded:', fontFamily);
        setLoadedFonts(prev => new Set([...prev, fontFamily]));
        setLoadingAdditionalFonts(prev => prev.filter(f => f !== fontFamily));
      }
    } catch (error) {
      console.error('Error waiting for fonts:', fontFamily, error);
      setLoadedFonts(prev => new Set([...prev, fontFamily]));
      setLoadingAdditionalFonts(prev => prev.filter(f => f !== fontFamily));
    }
  }, [loadedFonts]);

  // โหลดฟอนต์ยอดนิยมตอน mount
  useEffect(() => {
    setIsLoadingFonts(true);

    const link = document.createElement('link');
    link.href = `${GOOGLE_FONTS_API_URL}${encodeURIComponent(POPULAR_FONTS.join('&family='))}&display=swap&subset=thai,latin`;
    link.rel = 'stylesheet';

    const handleLoadComplete = () => {
      setIsLoadingFonts(false);
      setLoadedFonts(new Set(POPULAR_FONTS.map(f => f.split(':')[0])));
    };

    link.onload = handleLoadComplete;
    link.onerror = handleLoadComplete;
    document.head.appendChild(link);

    const timeoutId = setTimeout(handleLoadComplete, 15000);

    return () => {
      clearTimeout(timeoutId);
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  const handleFontChange = useCallback(async (fontFamily: string) => {
    setSelectedFont(fontFamily);
    canvasRef.current?.updateActiveObjectFont({ fontFamily });

    // ตรวจสอบและโหลดฟอนต์ถ้ายังไม่ได้โหลด
    if (!loadedFonts.has(fontFamily)) {
      const fontSpec = ALL_FONTS.find(f => f.startsWith(fontFamily));
      if (fontSpec) {
        setLoadingAdditionalFonts(prev => [...prev, fontFamily]);
        await loadFontDynamic(fontSpec);
      }
    }
  }, [canvasRef, loadedFonts, loadFontDynamic]);

  const handleSizeChange = useCallback((fontSize: number) => {
    setSelectedSize(fontSize);
    canvasRef.current?.updateActiveObjectFont({ fontSize });
  }, [canvasRef]);

  const handleWeightChange = useCallback((fontWeight: string) => {
    setSelectedWeight(fontWeight);
    canvasRef.current?.updateActiveObjectFont({ fontWeight });
  }, [canvasRef]);

  const handleAlignChange = useCallback((textAlign: string) => {
    setSelectedAlign(textAlign);
    canvasRef.current?.updateActiveObjectFont({ textAlign: textAlign as 'left' | 'center' | 'right' });
  }, [canvasRef]);

  // Filter fonts based on search query (ค้นหาจากทุกฟอนต์)
  const filteredFonts = ALL_FONTS
    .map(font => font.split(':')[0])
    .filter(font =>
      font.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
          className={`w-full rounded-xl px-3.5 py-2.5 flex justify-between items-center cursor-pointer border transition-all group ${
            theme === 'dark'
              ? 'bg-black/30 border-white/5 focus-within:border-primary/50 text-white hover:bg-black/50'
              : 'bg-gray-50 border-gray-200 focus-within:border-primary/50 text-navy hover:bg-white'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="material-symbols-outlined text-[16px] text-gray-500">text_fields</span>
            <span className="text-sm font-medium tracking-tight truncate" style={{ fontFamily: selectedFont }}>
              {selectedFont}
            </span>
          </div>
        </div>

        {isFontDropdownOpen && (
          <div
            className={`absolute z-50 w-full mt-2 rounded-xl border shadow-lg overflow-hidden ${
              theme === 'dark'
                ? 'bg-black/95 border-white/10'
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Search Input */}
            <div className="p-2.5 border-b border-gray-200/10">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`ค้นหาฟอนต์ (${filteredFonts.length} ฟอนต์)`}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none transition-all ${
                    theme === 'dark'
                      ? 'bg-black/40 border-white/10 text-white placeholder-gray-500 focus:border-primary/50'
                      : 'bg-gray-50 border-gray-200 text-navy placeholder:text-gray-400 focus:border-primary/50'
                  }`}
                />
              </div>
            </div>

            {/* Font List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredFonts.length > 0 ? (
                filteredFonts.slice(0, 50).map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => {
                      handleFontChange(font);
                      setIsFontDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    disabled={loadingAdditionalFonts.includes(font)}
                    className={`w-full text-left px-3 py-2 transition-all hover:opacity-80 border-b border-gray-200/10 last:border-b-0 ${
                      selectedFont === font
                        ? 'bg-primary text-navy font-semibold'
                        : theme === 'dark'
                        ? 'text-white'
                        : 'text-navy'
                    } ${loadingAdditionalFonts.includes(font) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ fontFamily: font }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 truncate">
                        {loadingAdditionalFonts.includes(font) && (
                          <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                        )}
                        {font}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {font.includes('Kanit') || font.includes('Prompt') || font.includes('Sarabun') ||
                         font.includes('Chakra') || font.includes('Mitr') || font.includes('IBM') ||
                         font.includes('Noto') || font.includes('Sriracha') || font.includes('Chonburi') ||
                         font.includes('Athiti') || font.includes('Fahkwang') || font.includes('Taviraj') ||
                         font.includes('Kodchasan') || font.includes('Pridi') || font.includes('K2D') ||
                         font.includes('KoHo') || font.includes('Trirong') || font.includes('Charmonman') ||
                         font.includes('Mali') || font.includes('Itim') ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-navy font-semibold">
                            TH
                          </span>
                        ) : null}
                        {!loadedFonts.has(font) && !loadingAdditionalFonts.includes(font) && (
                          <span className="material-symbols-outlined text-[14px] text-gray-500">cloud_download</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-sm text-gray-500">
                  ไม่พบฟอนต์ที่ค้นหา
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 sm:gap-2">
        {/* Weight Dropdown */}
        <div className="flex-1 relative min-w-0">
          <div
            onClick={() => setIsWeightDropdownOpen(!isWeightDropdownOpen)}
            className={`w-full rounded-xl px-2.5 sm:px-3.5 py-2.5 flex justify-between items-center cursor-pointer border transition-all ${
              theme === 'dark'
                ? 'bg-black/30 border-white/5 text-white hover:bg-black/50'
                : 'bg-gray-50 border-gray-200 text-navy hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
              <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-gray-500 shrink-0">format_bold</span>
              <span className="text-[10px] sm:text-xs font-bold tracking-tight truncate">
                {FONT_WEIGHTS.find(w => w.value === selectedWeight)?.label || 'Regular'}
              </span>
            </div>
            <span className={`material-symbols-outlined text-[16px] sm:text-[18px] text-gray-400 transition-transform shrink-0 ${isWeightDropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>

          {isWeightDropdownOpen && (
            <div
              className={`absolute z-50 w-full mt-2 rounded-xl border shadow-lg overflow-hidden ${
                theme === 'dark'
                  ? 'bg-black/95 border-white/10'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="max-h-56 overflow-y-auto py-1">
                {FONT_WEIGHTS.map((weight) => (
                  <button
                    key={weight.value}
                    type="button"
                    onClick={() => {
                      handleWeightChange(weight.value);
                      setIsWeightDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 sm:px-3 py-2 transition-all hover:opacity-80 text-[10px] sm:text-xs ${
                      selectedWeight === weight.value
                        ? 'bg-primary text-navy font-semibold'
                        : theme === 'dark'
                        ? 'text-white'
                        : 'text-navy'
                    }`}
                    style={{ fontFamily: selectedFont, fontWeight: weight.value }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate flex-1">{weight.label}</span>
                      <span className="text-[9px] sm:text-[10px] text-gray-500 shrink-0">{weight.value}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Size Input */}
        <div className="w-16 sm:w-20 shrink-0">
          <div className={`rounded-xl px-2.5 sm:px-3.5 py-2.5 border flex items-center justify-between ${
            theme === 'dark'
              ? 'bg-black/30 border-white/5 text-white'
              : 'bg-gray-50 border-gray-200 text-navy'
          }`}>
            <input
              type="number"
              value={selectedSize}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val && val > 0) {
                  handleSizeChange(val);
                }
              }}
              className="w-10 sm:w-12 bg-transparent border-none outline-none text-xs sm:text-sm font-bold text-center"
              min="8"
              max="200"
            />
            <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium shrink-0">px</span>
          </div>
        </div>

        {/* Size Dropdown */}
        <div className="w-20 relative">
          <div
            onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
            className={`w-full rounded-xl px-3.5 py-2.5 flex justify-between items-center cursor-pointer border transition-all ${
              theme === 'dark'
                ? 'bg-black/30 border-white/5 text-white hover:bg-black/50'
                : 'bg-gray-50 border-gray-200 text-navy hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-gray-500">format_size</span>
              <span className="text-sm font-bold tracking-tight">
                {selectedSize}
              </span>
            </div>
            <span className={`material-symbols-outlined text-[18px] text-gray-400 transition-transform ${isSizeDropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>

          {isSizeDropdownOpen && (
            <div
              className={`absolute z-50 w-full mt-2 rounded-xl border shadow-lg overflow-hidden ${
                theme === 'dark'
                  ? 'bg-black/95 border-white/10'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="max-h-56 overflow-y-auto py-1">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      handleSizeChange(size);
                      setIsSizeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 transition-all hover:opacity-80 text-sm ${
                      selectedSize === size
                        ? 'bg-primary text-navy font-semibold'
                        : theme === 'dark'
                        ? 'text-white'
                        : 'text-navy'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex p-1 rounded-xl border w-full justify-between ${
          theme === 'dark' ? 'bg-black/30 border-white/5' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <button
          type="button"
          onClick={() => handleAlignChange('left')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            selectedAlign === 'left'
              ? 'bg-primary text-navy shadow-sm'
              : 'hover:bg-white/5 text-gray-500'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">format_align_left</span>
        </button>
        <button
          type="button"
          onClick={() => handleAlignChange('center')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            selectedAlign === 'center'
              ? 'bg-primary text-navy shadow-sm'
              : 'hover:bg-white/5 text-gray-500'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">format_align_center</span>
        </button>
        <button
          type="button"
          onClick={() => handleAlignChange('right')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            selectedAlign === 'right'
              ? 'bg-primary text-navy shadow-sm'
              : 'hover:bg-white/5 text-gray-500'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">format_align_right</span>
        </button>
      </div>
    </div>
  );
};

export default TypographySection;
