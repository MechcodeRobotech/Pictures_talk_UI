import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';

type MeetingItem = {
  id: number;
  title?: string | null;
  created_at?: string | null;
  has_transcript?: boolean;
  has_summary?: boolean;
};

const ResultsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const [items, setItems] = React.useState<MeetingItem[]>([]);
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isActive = true;
    const fetchMeetings = async () => {
      try {
        const meetingsUrl = apiBaseUrl
          ? new URL('/api/meetings?limit=20', apiBaseUrl).toString()
          : '/api/meetings?limit=20';
        const response = await fetch(meetingsUrl);
        if (!response.ok) {
          throw new Error('Failed to load results.');
        }
        const payload = (await response.json()) as { items?: MeetingItem[] };
        if (!isActive) return;
        setItems(payload.items ?? []);
        setStatus('ready');
        setErrorMessage(null);
      } catch (error) {
        if (!isActive) return;
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load results.');
      }
    };

    fetchMeetings();

    return () => {
      isActive = false;
    };
  }, [apiBaseUrl]);

  const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-fadeIn">
      <nav className="flex items-center space-x-2 text-sm text-slate-400 dark:text-slate-500 mb-2">
        <span className="hover:text-secondary dark:hover:text-white cursor-pointer">{t('home')}</span>
        <span className="material-icons-round text-base">chevron_right</span>
        <span className="hover:text-secondary dark:hover:text-white cursor-pointer">{t('summary')}</span>
        <span className="material-icons-round text-base">chevron_right</span>
        <span className="font-medium text-secondary dark:text-white">{t('results')}</span>
      </nav>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary dark:text-white">{t('results')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Latest transcripts processed from Fireflies.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {status === 'loading' && (
          <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            Loading results...
          </div>
        )}
        {status === 'error' && (
          <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-900/10 text-rose-600 dark:text-rose-300">
            {errorMessage ?? 'Failed to load results.'}
          </div>
        )}
        {status === 'ready' && items.length === 0 && (
          <div className="p-10 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
            No results yet. Upload an audio file to start.
          </div>
        )}
        {status === 'ready' && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => {
              const ready = Boolean(item.has_transcript);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(`/results/${item.id}`)}
                  className="text-left p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-surface-dark/80 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-secondary dark:text-white line-clamp-2">
                        {item.title || `Meeting #${item.id}`}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ready
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                      }`}
                    >
                      {ready ? 'Ready' : 'Processing'}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{item.has_summary ? 'Summary ready' : 'Summary pending'}</span>
                    <span className="flex items-center gap-1 text-primary font-semibold">
                      Open
                      <span className="material-icons-round text-base">chevron_right</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
