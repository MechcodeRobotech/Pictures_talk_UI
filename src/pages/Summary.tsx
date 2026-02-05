import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import Keywords, { fallbackKeywords, keywordPalette, KeywordItem } from '../components/Summary/Keywords';

const SUMMARY_SECTION_MAX_CARDS = 3;
const SUMMARY_TITLE_WORD_LIMIT = 6;
const SUMMARY_DESC_MAX_CHARS = 140;
const SUMMARY_RATIO_OPTIONS = [
  { value: '100', label: '100% Summary from text' },
  { value: '75', label: '75% Summary from text' },
  { value: '50', label: '50% Summary from text' },
  { value: '25', label: '25% Summary from text' },
] as const;
const SUMMARY_CARD_DECORATIONS = [
  {
    icon: 'article',
    iconClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  },
  {
    icon: 'assignment',
    iconClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  },
  {
    icon: 'auto_awesome',
    iconClass: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  },
];

const DEFAULT_SUMMARY_TEXT = [
  'In this meeting, the team discussed Marketing Strategy for Q4, focusing on preparing for the new product launch at the end of the year, which is a key period for generating sales.',
  'A key point raised was regarding the Advertising Budget. The finance department proposed reducing the budget for print media and reallocating it to online media and social media.',
  'Additionally, the development team updated the progress of Project Alpha, stating that it is currently in final system testing and is expected to be ready for a soft launch in the next 2 weeks.',
  'Finally, the meeting summarized the operational plan for next week, assigning the marketing department to accelerate Promotion Campaigns with partners to build momentum before the actual product launch.',
  'The meeting concluded with a follow-up in the next 2 weeks to evaluate progress and adjust plans if necessary.',
].join('\n\n');

type SummaryLocationState = {
  fileName?: string;
  meetingId?: number;
  uploadedAt?: number;
  durationMinutes?: number | null;
};
type SummaryRatioValue = (typeof SUMMARY_RATIO_OPTIONS)[number]['value'];
type StoredSummaryResult = {
  id: string;
  name: string;
  createdAt?: number;
  durationMinutes?: number | null;
};

const formatDurationLabel = (value?: number | null) => {
  if (!Number.isFinite(value) || (value ?? 0) <= 0) return '— mins';
  return `${Math.round(value as number)} mins`;
};

const formatUploadedDateLabel = (timestamp?: number) => {
  if (!Number.isFinite(timestamp)) return '—';
  return new Date(timestamp as number).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Summary: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { resultId } = useParams();
  const locationState = location.state as SummaryLocationState | null;
  const meetingIdFromParam = resultId && /^\d+$/.test(resultId) ? Number(resultId) : undefined;
  const meetingId = locationState?.meetingId ?? meetingIdFromParam;
  const storedSummaryItem = React.useMemo(() => {
    if (!resultId) return undefined;
    try {
      const raw = localStorage.getItem('summaryResults');
      if (!raw) return undefined;
      const parsed = JSON.parse(raw) as StoredSummaryResult[];
      return parsed.find((item) => item.id === resultId);
    } catch {
      return undefined;
    }
  }, [resultId]);
  const fileName = locationState?.fileName ?? storedSummaryItem?.name;
  const uploadDurationLabel = React.useMemo(
    () => formatDurationLabel(locationState?.durationMinutes ?? storedSummaryItem?.durationMinutes),
    [locationState?.durationMinutes, storedSummaryItem?.durationMinutes],
  );
  const uploadDateLabel = React.useMemo(
    () => formatUploadedDateLabel(locationState?.uploadedAt ?? storedSummaryItem?.createdAt),
    [locationState?.uploadedAt, storedSummaryItem?.createdAt],
  );
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const [isEditing, setIsEditing] = React.useState(false);
  const [summaryText, setSummaryText] = React.useState(() => (meetingId ? '' : DEFAULT_SUMMARY_TEXT));
  const [summaryStatus, setSummaryStatus] = React.useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [summaryError, setSummaryError] = React.useState<string | null>(null);
  const [keywords, setKeywords] = React.useState<KeywordItem[]>([]);
  const [keywordsStatus, setKeywordsStatus] = React.useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [keywordsError, setKeywordsError] = React.useState<string | null>(null);
  const [summaryRatio, setSummaryRatio] = React.useState<SummaryRatioValue>('100');
  const [isSummaryRatioOpen, setIsSummaryRatioOpen] = React.useState(false);
  const summaryTextAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const summaryRatioRef = React.useRef<HTMLDivElement | null>(null);
  const hasUserEditedRef = React.useRef(false);
  const lastMeetingIdRef = React.useRef<number | undefined>(meetingId);
  const summaryTextRef = React.useRef(summaryText);

  React.useEffect(() => {
    summaryTextRef.current = summaryText;
  }, [summaryText]);

  React.useEffect(() => {
    hasUserEditedRef.current = false;
    if (!meetingId) {
      setSummaryText(DEFAULT_SUMMARY_TEXT);
      setSummaryStatus('idle');
      setSummaryError(null);
      setKeywords([]);
      setKeywordsStatus('idle');
      setKeywordsError(null);
      return;
    }

    const meetingChanged = lastMeetingIdRef.current !== meetingId;
    if (meetingChanged || !summaryTextRef.current.trim()) {
      setSummaryText('');
    }
    setSummaryStatus('loading');
    setSummaryError(null);
    lastMeetingIdRef.current = meetingId;

    let isActive = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const pollSummary = async () => {
      if (!isActive) return;
      try {
        const summaryPath = `/api/meetings/${meetingId}/summary?summary_ratio=${summaryRatio}`;
        const summaryUrl = apiBaseUrl
          ? new URL(summaryPath, apiBaseUrl).toString()
          : summaryPath;
        const response = await fetch(summaryUrl);
        if (!isActive) return;
        if (response.status === 202) {
          timeoutId = setTimeout(pollSummary, 4000);
          return;
        }
        if (response.ok) {
          const payload = (await response.json()) as { summary?: string };
          const nextText = (payload?.summary ?? '').trim();
          if (!hasUserEditedRef.current) {
            setSummaryText(nextText);
          }
          setSummaryStatus('ready');
          setSummaryError(null);
          return;
        }
        if (response.status === 404) {
          timeoutId = setTimeout(pollSummary, 4000);
          return;
        }
        let detail = 'Failed to load summary.';
        try {
          const payload = (await response.json()) as { detail?: string };
          if (payload?.detail) {
            detail = payload.detail;
          }
        } catch {
          // Keep default detail message.
        }
        throw new Error(detail);
      } catch (error) {
        if (!isActive) return;
        setSummaryStatus('error');
        setSummaryError(error instanceof Error ? error.message : 'Failed to load summary.');
      }
    };

    pollSummary();

    return () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [meetingId, apiBaseUrl, summaryRatio]);

  React.useEffect(() => {
    if (!meetingId) {
      return;
    }

    setKeywords([]);
    setKeywordsStatus('loading');
    setKeywordsError(null);

    let isActive = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const pollKeywords = async () => {
      if (!isActive) return;
      try {
        const keywordsUrl = apiBaseUrl
          ? new URL(`/api/meetings/${meetingId}/keywords`, apiBaseUrl).toString()
          : `/api/meetings/${meetingId}/keywords`;
        const response = await fetch(keywordsUrl);
        if (!isActive) return;
        if (response.status === 202) {
          timeoutId = setTimeout(pollKeywords, 4000);
          return;
        }
        if (response.ok) {
          const payload = (await response.json()) as KeywordItem[];
          if (!isActive) return;
          setKeywords(Array.isArray(payload) ? payload : []);
          setKeywordsStatus('ready');
          setKeywordsError(null);
          return;
        }
        if (response.status === 404) {
          timeoutId = setTimeout(pollKeywords, 4000);
          return;
        }
        let detail = 'Failed to load keywords.';
        try {
          const payload = (await response.json()) as { detail?: string };
          if (payload?.detail) {
            detail = payload.detail;
          }
        } catch {
          // Keep default detail message.
        }
        throw new Error(detail);
      } catch (error) {
        if (!isActive) return;
        setKeywordsStatus('error');
        setKeywordsError(error instanceof Error ? error.message : 'Failed to load keywords.');
      }
    };

    pollKeywords();

    return () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [meetingId, apiBaseUrl]);

  React.useEffect(() => {
    if (isEditing && summaryTextAreaRef.current) {
      summaryTextAreaRef.current.focus();
      summaryTextAreaRef.current.selectionStart = summaryTextAreaRef.current.value.length;
    }
  }, [isEditing]);

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!summaryRatioRef.current) return;
      const target = event.target as Node | null;
      if (target && !summaryRatioRef.current.contains(target)) {
        setIsSummaryRatioOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSummaryRatioOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const displayText = summaryText || (!meetingId ? DEFAULT_SUMMARY_TEXT : '');
  const formattedDisplayText = React.useMemo(() => {
    if (!displayText) return displayText;
    // Fireflies sometimes returns bullet points in a single line separated by " - ".
    if (!displayText.includes('\n') && displayText.includes(' - ')) {
      return displayText.replace(/\s-\s(?=\S)/g, '\n- ');
    }
    return displayText;
  }, [displayText]);
  const isWaitingForSummary = Boolean(meetingId) && summaryStatus === 'loading' && !summaryText;
  const showSummaryError = Boolean(meetingId) && summaryStatus === 'error';
  const showEmptySummary = Boolean(meetingId) && summaryStatus === 'ready' && !summaryText;
  const selectedSummaryRatioLabel = React.useMemo(
    () => SUMMARY_RATIO_OPTIONS.find((option) => option.value === summaryRatio)?.label ?? SUMMARY_RATIO_OPTIONS[0].label,
    [summaryRatio],
  );
  const normalizeKeywordMatch = React.useCallback(
    (value: string) => value.normalize('NFC').toLowerCase().trim(),
    [],
  );
  const normalizeMatchValue = React.useCallback(
    (value: string) =>
      value
        .normalize('NFC')
        .toLowerCase()
        .replace(/[^0-9a-z\u0E00-\u0E7F]+/gi, ''),
    [],
  );
  const collapseKeywordMatch = React.useCallback(
    (value: string) => normalizeKeywordMatch(value).replace(/[\s\p{P}\p{S}_]+/gu, ''),
    [normalizeKeywordMatch],
  );
  const keywordSourceItems = React.useMemo(
    () => (keywords.length > 0 ? keywords : !meetingId ? fallbackKeywords : []),
    [keywords, meetingId],
  );
  const keywordHighlightClassByTerm = React.useMemo(() => {
    const paletteByTerm = new Map<string, string>();

    keywordSourceItems.forEach((item, index) => {
      const term = (item.term ?? '').toString().trim();
      if (!term) return;
      const normalizedTerm = normalizeMatchValue(term);
      if (!normalizedTerm || paletteByTerm.has(normalizedTerm)) return;
      paletteByTerm.set(normalizedTerm, keywordPalette[index % keywordPalette.length].termHighlightClass);
    });

    return paletteByTerm;
  }, [keywordSourceItems, normalizeMatchValue]);
  const displayKeywords = React.useMemo(() => {
    if (!meetingId) {
      return keywordSourceItems;
    }
    const normalizedSummary = normalizeKeywordMatch(formattedDisplayText || '');
    const collapsedSummary = collapseKeywordMatch(formattedDisplayText || '');
    if (!normalizedSummary) {
      return [];
    }
    return keywordSourceItems.filter((item) => {
      const term = (item.term ?? '').toString().trim();
      if (!term) return false;
      const normalizedTerm = normalizeKeywordMatch(term);
      if (!normalizedTerm) return false;
      if (normalizedSummary.includes(normalizedTerm)) {
        return true;
      }
      const collapsedTerm = collapseKeywordMatch(normalizedTerm);
      if (!collapsedTerm) return false;
      return collapsedSummary.includes(collapsedTerm);
    });
  }, [keywordSourceItems, meetingId, formattedDisplayText, normalizeKeywordMatch, collapseKeywordMatch]);

  const escapeRegex = React.useCallback((value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), []);

  const highlightKeywords = React.useCallback(
    (text: string) => {
      if (!displayKeywords.length) return text;
      const terms = displayKeywords
        .map((item) => (item.term ?? '').toString().trim())
        .filter(Boolean);
      if (!terms.length) return text;
      const paletteByTerm = new Map<string, string>();
      const normalizedEntries: { key: string; pattern: string; length: number }[] = [];

      terms.forEach((term, index) => {
        const normalizedTerm = normalizeMatchValue(term);
        if (!normalizedTerm) return;
        if (paletteByTerm.has(normalizedTerm)) return;
        const chars = Array.from(normalizedTerm);
        const pattern = chars.map((char) => escapeRegex(char)).join('[\\s\\p{P}]*');
        if (!pattern) return;
        paletteByTerm.set(
          normalizedTerm,
          keywordHighlightClassByTerm.get(normalizedTerm) ?? keywordPalette[index % keywordPalette.length].termHighlightClass,
        );
        normalizedEntries.push({ key: normalizedTerm, pattern, length: normalizedTerm.length });
      });

      if (!normalizedEntries.length) return text;
      normalizedEntries.sort((a, b) => b.length - a.length);
      const regex = new RegExp(`(${normalizedEntries.map((entry) => entry.pattern).join('|')})`, 'giu');
      return text.split(regex).map((part, index) => {
        const normalizedPart = normalizeMatchValue(part);
        const paletteClass = paletteByTerm.get(normalizedPart);
        if (!paletteClass) return part;
        return (
          <span
            key={`${part}-${index}`}
            className={`inline-flex items-center rounded-md px-2 py-0.5 font-semibold ${paletteClass}`}
          >
            {part}
          </span>
        );
      });
    },
    [displayKeywords, escapeRegex, keywordHighlightClassByTerm, normalizeMatchValue],
  );

  const highlightedParagraphs = React.useMemo(() => {
    if (!formattedDisplayText) return [];
    return formattedDisplayText.split(/\n\s*\n/).map((paragraph, index) => ({
      id: `${paragraph.slice(0, 24)}-${index}`,
      text: paragraph,
      highlighted: highlightKeywords(paragraph),
    }));
  }, [formattedDisplayText, highlightKeywords]);

  const summaryCards = React.useMemo(() => {
    const paragraphs = formattedDisplayText
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .slice(0, SUMMARY_SECTION_MAX_CARDS);

    const keywordTerms = displayKeywords
      .map((item) => (item.term ?? '').toString().trim())
      .filter(Boolean);

    return paragraphs.map((paragraph, index) => {
      const titleWords = paragraph.split(/\s+/).filter(Boolean).slice(0, SUMMARY_TITLE_WORD_LIMIT);
      const title = titleWords.join(' ');
      const shouldTrimDesc = paragraph.length > SUMMARY_DESC_MAX_CHARS;
      const description = shouldTrimDesc ? `${paragraph.slice(0, SUMMARY_DESC_MAX_CHARS).trimEnd()}...` : paragraph;
      const tags = keywordTerms.slice(index * 2, index * 2 + 2);
      const fallbackTag = `Point ${index + 1}`;
      const decoration = SUMMARY_CARD_DECORATIONS[index % SUMMARY_CARD_DECORATIONS.length];
      return {
        id: `${title}-${index}`,
        title: title || fallbackTag,
        date: `Summary ${index + 1}`,
        desc: description,
        tags: tags.length > 0 ? tags : [fallbackTag],
        icon: decoration.icon,
        iconClass: decoration.iconClass,
      };
    });
  }, [displayKeywords, formattedDisplayText]);

  return (
    <div className="max-w-[1400px] mx-auto animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center space-x-2 text-sm text-slate-400 dark:text-slate-500 mb-1">
            <span className="hover:text-secondary dark:hover:text-white cursor-pointer">{t('home')}</span>
            <span className="material-icons-round text-base">chevron_right</span>
            <span className="font-medium text-secondary dark:text-white truncate max-w-[360px]" title={fileName ?? t('summary')}>
              {fileName ?? t('summary')}
            </span>
          </nav>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary dark:text-white truncate max-w-[640px]" title={fileName ?? t('summary')}>
            {fileName ?? t('summary')}
          </h2>
        </div>
      </header>

      <section className="flex flex-col h-[calc(100vh-180px)] min-h-[600px] bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 md:px-8 py-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-surface-dark">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-xl font-bold text-secondary dark:text-white flex items-center">
              <span className="material-icons-round text-primary mr-2">article</span>
              Meeting Summary Article
            </h3>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 hidden sm:block"></div>
            <div className="relative" ref={summaryRatioRef}>
              <button
                type="button"
                onClick={() => setIsSummaryRatioOpen((prev) => !prev)}
                className="min-w-[250px] flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3.5 py-2 text-sm font-medium text-secondary dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <span>{selectedSummaryRatioLabel}</span>
                <span
                  className={`material-icons-round text-lg text-slate-400 transition-transform ${isSummaryRatioOpen ? 'rotate-180' : ''}`}
                >
                  expand_more
                </span>
              </button>
              {isSummaryRatioOpen && (
                <div className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white/95 dark:bg-gray-800/95 shadow-xl backdrop-blur-sm">
                  {SUMMARY_RATIO_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSummaryRatio(option.value);
                        hasUserEditedRef.current = false;
                        setIsSummaryRatioOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                        option.value === summaryRatio
                          ? 'bg-primary/10 text-secondary dark:text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700/70'
                      }`}
                    >
                      <span>{option.label}</span>
                      {option.value === summaryRatio && (
                        <span className="material-icons-round text-base text-primary">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-500">
            <span className="flex items-center">
              <span className="material-icons-round text-base mr-1">schedule</span>
              {uploadDurationLabel}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span>{uploadDateLabel}</span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 pr-4">
            {isEditing ? (
              <textarea
                ref={summaryTextAreaRef}
                value={summaryText}
                onChange={(event) => {
                  hasUserEditedRef.current = true;
                  setSummaryText(event.target.value);
                }}
                rows={14}
                className="w-full min-h-[360px] px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-secondary dark:text-gray-200 placeholder-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
            />
          ) : (
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {isWaitingForSummary && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Generating meeting summary...</p>
              )}
              {showSummaryError && (
                <p className="text-sm text-red-500 mb-4">{summaryError ?? 'Failed to load summary.'}</p>
              )}
              {highlightedParagraphs.map((item) => (
                <p
                  key={item.id}
                  className="text-lg leading-relaxed whitespace-pre-line text-secondary dark:text-gray-200 mb-6"
                >
                  {item.highlighted}
                </p>
              ))}
              {showEmptySummary && (
                <p className="text-sm text-slate-500 dark:text-slate-400">No summary content available yet.</p>
              )}
            </article>
          )}
        </div>

          <Keywords
            items={keywords}
            status={keywordsStatus}
            errorMessage={keywordsError}
            showPlaceholder={!meetingId}
          />
        </div>

        <div className="p-5 md:p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-surface-dark flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-secondary dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
          >
            <span className="material-icons-round mr-2 text-sm">{isEditing ? 'check' : 'edit'}</span>
            {isEditing ? 'Done' : 'Edit Text'}
          </button>
          <button className="px-7 py-2.5 rounded-xl bg-primary text-secondary font-bold hover:bg-primary-hover shadow-sm hover:shadow-md transition-all flex items-center">
            Next
            <span className="material-icons-round ml-2 text-sm">arrow_forward</span>
          </button>
        </div>
      </section>

      <section className="mt-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-secondary dark:text-white">{t('recent_work')}</h3>
          <button className="text-sm text-primary hover:text-primary-hover font-medium flex items-center group">
            {t('view_all')}
            <span className="material-icons-round text-base ml-1 transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryCards.length > 0 ? (
            summaryCards.map((item) => (
              <div
                key={item.id}
                className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${item.iconClass}`}>
                    <span className="material-icons-round">{item.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                    {item.date}
                  </span>
                </div>
                <h4 className="font-bold text-lg text-secondary dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {item.desc}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-auto">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-xs font-medium text-slate-500 dark:text-slate-300 border border-gray-100 dark:border-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-sm text-slate-500 dark:text-slate-400">
              Summary highlights will appear here after the summary is generated.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Summary;
