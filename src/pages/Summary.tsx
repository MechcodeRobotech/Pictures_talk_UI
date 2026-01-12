import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import Keywords, { fallbackKeywords, keywordPalette, KeywordItem } from '../components/Summary/Keywords';

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
};

const Summary: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { resultId } = useParams();
  const locationState = location.state as SummaryLocationState | null;
  const meetingIdFromParam = resultId && /^\d+$/.test(resultId) ? Number(resultId) : undefined;
  const meetingId = locationState?.meetingId ?? meetingIdFromParam;
  const storedFileName = React.useMemo(() => {
    if (!resultId) return undefined;
    try {
      const raw = localStorage.getItem('summaryResults');
      if (!raw) return undefined;
      const parsed = JSON.parse(raw) as { id: string; name: string }[];
      return parsed.find((item) => item.id === resultId)?.name;
    } catch {
      return undefined;
    }
  }, [resultId]);
  const fileName = locationState?.fileName ?? storedFileName;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const [isEditing, setIsEditing] = React.useState(false);
  const [summaryText, setSummaryText] = React.useState(() => (meetingId ? '' : DEFAULT_SUMMARY_TEXT));
  const [summaryStatus, setSummaryStatus] = React.useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [summaryError, setSummaryError] = React.useState<string | null>(null);
  const [keywords, setKeywords] = React.useState<KeywordItem[]>([]);
  const [keywordsStatus, setKeywordsStatus] = React.useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [keywordsError, setKeywordsError] = React.useState<string | null>(null);
  const summaryTextAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const hasUserEditedRef = React.useRef(false);

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

    setSummaryText('');
    setSummaryStatus('loading');
    setSummaryError(null);

    let isActive = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const pollSummary = async () => {
      if (!isActive) return;
      try {
        const summaryUrl = apiBaseUrl
          ? new URL(`/api/meetings/${meetingId}/summary`, apiBaseUrl).toString()
          : `/api/meetings/${meetingId}/summary`;
        const response = await fetch(summaryUrl);
        if (!isActive) return;
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
  }, [meetingId, apiBaseUrl]);

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

  const displayText = summaryText || (!meetingId ? DEFAULT_SUMMARY_TEXT : '');
  const isWaitingForSummary = Boolean(meetingId) && summaryStatus === 'loading' && !summaryText;
  const showSummaryError = Boolean(meetingId) && summaryStatus === 'error';
  const showEmptySummary = Boolean(meetingId) && summaryStatus === 'ready' && !summaryText;
  const displayKeywords = React.useMemo(() => {
    if (keywords.length > 0) return keywords;
    return !meetingId ? fallbackKeywords : [];
  }, [keywords, meetingId]);

  const escapeRegex = React.useCallback((value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), []);
  const normalizeMatchValue = React.useCallback(
    (value: string) =>
      value
        .normalize('NFC')
        .toLowerCase()
        .replace(/[^0-9a-z\u0E00-\u0E7F]+/gi, ''),
    [],
  );

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
        paletteByTerm.set(normalizedTerm, keywordPalette[index % keywordPalette.length].termHighlightClass);
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
    [displayKeywords, escapeRegex],
  );

  const recentWork = [
    {
      title: 'UX Design Brainstorming',
      date: 'Oct 20, 2023',
      desc: 'Discussed user journey improvements for the new dashboard.',
      tags: ['Product', 'Design'],
      icon: 'groups',
      iconClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'End of Year Campaign Update',
      date: 'Oct 18, 2023',
      desc: 'Checked readiness of advertising media and budget for promotion.',
      tags: ['Marketing'],
      icon: 'campaign',
      iconClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Q3 Performance Summary',
      date: 'Oct 15, 2023',
      desc: 'Presented profit figures and next-quarter improvement plans.',
      tags: ['Finance'],
      icon: 'trending_up',
      iconClass: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
  ];

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
          <h2 className="text-2xl md:text-3xl font-bold text-secondary dark:text-white">Weekly Meeting Summary</h2>
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
            <div className="relative">
              <select
                defaultValue="75"
                className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-secondary dark:text-gray-200 text-sm rounded-lg pl-3 pr-10 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <option value="100">100% Summary from text</option>
                <option value="75">75% Summary from text</option>
                <option value="50">50% Summary from text</option>
                <option value="25">25% Summary from text</option>
              </select>
              <span className="material-icons-round absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg">expand_more</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-500">
            <span className="flex items-center">
              <span className="material-icons-round text-base mr-1">schedule</span>
              45 mins
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span>Oct 24, 2023</span>
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
              {displayText &&
                displayText.split(/\n\s*\n/).map((paragraph, index) => (
                  <p
                    key={`${paragraph.slice(0, 24)}-${index}`}
                    className="text-lg leading-relaxed text-secondary dark:text-gray-200 mb-6"
                  >
                    {highlightKeywords(paragraph)}
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
          {recentWork.map((item) => (
            <div
              key={item.title}
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
          ))}
        </div>
      </section>
    </div>
  );
};

export default Summary;
