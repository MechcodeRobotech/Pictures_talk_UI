import React from 'react';
import Sentiment from './Sentiment';

export type KeywordItem = {
  label?: string | null;
  term?: string | null;
  percent?: number | string | null;
};

type KeywordsProps = {
  items?: KeywordItem[];
  status?: 'idle' | 'loading' | 'ready' | 'error';
  errorMessage?: string | null;
  showPlaceholder?: boolean;
};

export const fallbackKeywords: KeywordItem[] = [
  { label: 'Strategy', percent: 45, term: 'Marketing Strategy' },
  { label: 'Finance', percent: 30, term: 'Budget' },
  { label: 'Product', percent: 60, term: 'Project Alpha' },
  { label: 'Marketing', percent: 25, term: 'Promotion Campaign' },
];

export const keywordPalette = [
  {
    cardClass: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border-blue-100 dark:border-blue-800',
    labelClass: 'text-blue-600 dark:text-blue-300',
    percentClass: 'text-blue-400 dark:text-blue-500',
    barBgClass: 'bg-blue-100 dark:bg-blue-900',
    barFillClass: 'bg-blue-500',
    termClass: 'group-hover:text-blue-700 dark:group-hover:text-blue-200',
    termHighlightClass:
      'bg-blue-100/80 text-blue-700 border border-blue-200/80 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800/60',
  },
  {
    cardClass: 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border-yellow-100 dark:border-yellow-800',
    labelClass: 'text-yellow-600 dark:text-yellow-300',
    percentClass: 'text-yellow-500 dark:text-yellow-500',
    barBgClass: 'bg-yellow-100 dark:bg-yellow-900',
    barFillClass: 'bg-yellow-500',
    termClass: 'group-hover:text-yellow-700 dark:group-hover:text-yellow-200',
    termHighlightClass:
      'bg-yellow-100/80 text-yellow-700 border border-yellow-200/80 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-800/60',
  },
  {
    cardClass: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 border-green-100 dark:border-green-800',
    labelClass: 'text-green-600 dark:text-green-300',
    percentClass: 'text-green-500 dark:text-green-500',
    barBgClass: 'bg-green-100 dark:bg-green-900',
    barFillClass: 'bg-green-500',
    termClass: 'group-hover:text-green-700 dark:group-hover:text-green-200',
    termHighlightClass:
      'bg-green-100/80 text-green-700 border border-green-200/80 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800/60',
  },
  {
    cardClass: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 border-purple-100 dark:border-purple-800',
    labelClass: 'text-purple-600 dark:text-purple-300',
    percentClass: 'text-purple-400 dark:text-purple-500',
    barBgClass: 'bg-purple-100 dark:bg-purple-900',
    barFillClass: 'bg-purple-500',
    termClass: 'group-hover:text-purple-700 dark:group-hover:text-purple-200',
    termHighlightClass:
      'bg-purple-100/80 text-purple-700 border border-purple-200/80 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800/60',
  },
];

const normalizePercent = (value?: number | string | null) => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(parsed)) return null;
  const normalized = parsed <= 1 ? parsed * 100 : parsed;
  return Math.max(0, Math.min(100, normalized));
};

const Keywords: React.FC<KeywordsProps> = ({
  items = [],
  status = 'idle',
  errorMessage,
  showPlaceholder = false,
}) => {
  const hasItems = items.length > 0;
  const displayItems = hasItems ? items : showPlaceholder ? fallbackKeywords : [];
  const showLoading = status === 'loading' && !hasItems && !showPlaceholder;
  const showError = status === 'error' && !hasItems && !showPlaceholder;
  const showEmpty = !showLoading && !showError && displayItems.length === 0 && !showPlaceholder;

  return (
    <aside className="w-72 border-l border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 p-6 overflow-y-auto hidden lg:block">
      <div className="mb-6">
        <h4 className="font-bold text-secondary dark:text-white mb-4 flex items-center">
          <span className="material-icons-round text-lg mr-2 text-primary">label</span>
          Keywords
        </h4>
        {showLoading && (
          <div className="text-sm text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4">
            Generating keywords...
          </div>
        )}
        {showError && (
          <div className="text-sm text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-900/10 rounded-xl p-4">
            {errorMessage ?? 'Failed to load keywords.'}
          </div>
        )}
        {showEmpty && (
          <div className="text-sm text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4">
            No keywords yet.
          </div>
        )}
        {displayItems.length > 0 && (
          <div className="flex flex-col gap-3">
            {displayItems.map((item, index) => {
              const paletteItem = keywordPalette[index % keywordPalette.length];
              const percent = normalizePercent(item.percent);
              const percentLabel = percent === null ? '—' : `${Math.round(percent)}%`;
              const label = (item.label || 'Keyword').toString();
              const term = (item.term || '').toString();
              return (
                <div
                  key={`${label}-${term}-${index}`}
                  className={`border rounded-xl p-3 cursor-pointer transition-colors group ${paletteItem.cardClass}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wider ${paletteItem.labelClass}`}>
                      {label}
                    </span>
                    <span className={`text-xs ${paletteItem.percentClass}`}>{percentLabel}</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${paletteItem.barBgClass}`}>
                    <div
                      className={`h-full rounded-full ${paletteItem.barFillClass}`}
                      style={{ width: percent === null ? '0%' : `${percent}%` }}
                    ></div>
                  </div>
                  <p className={`text-sm text-secondary dark:text-gray-300 mt-2 transition-colors ${paletteItem.termClass}`}>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-semibold ${paletteItem.termHighlightClass}`}
                    >
                      {term || '—'}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Sentiment />
    </aside>
  );
};

export default Keywords;
