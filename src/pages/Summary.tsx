import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

const Summary: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const fileName = (location.state as { fileName?: string } | null)?.fileName;
  const [isEditing, setIsEditing] = React.useState(false);
  const [summaryText, setSummaryText] = React.useState(
    [
      'In this meeting, the team discussed Marketing Strategy for Q4, focusing on preparing for the new product launch at the end of the year, which is a key period for generating sales.',
      'A key point raised was regarding the Advertising Budget. The finance department proposed reducing the budget for print media and reallocating it to online media and social media.',
      'Additionally, the development team updated the progress of Project Alpha, stating that it is currently in final system testing and is expected to be ready for a soft launch in the next 2 weeks.',
      'Finally, the meeting summarized the operational plan for next week, assigning the marketing department to accelerate Promotion Campaigns with partners to build momentum before the actual product launch.',
      'The meeting concluded with a follow-up in the next 2 weeks to evaluate progress and adjust plans if necessary.',
    ].join('\n\n'),
  );
  const summaryTextAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (isEditing && summaryTextAreaRef.current) {
      summaryTextAreaRef.current.focus();
      summaryTextAreaRef.current.selectionStart = summaryTextAreaRef.current.value.length;
    }
  }, [isEditing]);

  const keywords = [
    {
      label: 'Strategy',
      percent: '45%',
      term: 'Marketing Strategy',
      cardClass: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border-blue-100 dark:border-blue-800',
      labelClass: 'text-blue-600 dark:text-blue-300',
      percentClass: 'text-blue-400 dark:text-blue-500',
      barBgClass: 'bg-blue-100 dark:bg-blue-900',
      barFillClass: 'bg-blue-500 w-[45%]',
      termClass: 'group-hover:text-blue-700 dark:group-hover:text-blue-200',
    },
    {
      label: 'Finance',
      percent: '30%',
      term: 'Budget',
      cardClass: 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border-yellow-100 dark:border-yellow-800',
      labelClass: 'text-yellow-600 dark:text-yellow-300',
      percentClass: 'text-yellow-500 dark:text-yellow-500',
      barBgClass: 'bg-yellow-100 dark:bg-yellow-900',
      barFillClass: 'bg-yellow-500 w-[30%]',
      termClass: 'group-hover:text-yellow-700 dark:group-hover:text-yellow-200',
    },
    {
      label: 'Product',
      percent: '60%',
      term: 'Project Alpha',
      cardClass: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 border-green-100 dark:border-green-800',
      labelClass: 'text-green-600 dark:text-green-300',
      percentClass: 'text-green-500 dark:text-green-500',
      barBgClass: 'bg-green-100 dark:bg-green-900',
      barFillClass: 'bg-green-500 w-[60%]',
      termClass: 'group-hover:text-green-700 dark:group-hover:text-green-200',
    },
    {
      label: 'Marketing',
      percent: '25%',
      term: 'Promotion Campaign',
      cardClass: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 border-purple-100 dark:border-purple-800',
      labelClass: 'text-purple-600 dark:text-purple-300',
      percentClass: 'text-purple-400 dark:text-purple-500',
      barBgClass: 'bg-purple-100 dark:bg-purple-900',
      barFillClass: 'bg-purple-500 w-[25%]',
      termClass: 'group-hover:text-purple-700 dark:group-hover:text-purple-200',
    },
  ];

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
                onChange={(event) => setSummaryText(event.target.value)}
                rows={14}
                className="w-full min-h-[360px] px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-secondary dark:text-gray-200 placeholder-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
              />
            ) : (
              <article className="prose prose-slate dark:prose-invert max-w-none">
                {summaryText.split(/\n\s*\n/).map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 24)}-${index}`} className="text-lg leading-relaxed text-secondary dark:text-gray-200 mb-6">
                    {paragraph}
                  </p>
                ))}
              </article>
            )}
          </div>

          <aside className="w-72 border-l border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 p-6 overflow-y-auto hidden lg:block">
            <div className="mb-6">
              <h4 className="font-bold text-secondary dark:text-white mb-4 flex items-center">
                <span className="material-icons-round text-lg mr-2 text-primary">label</span>
                Keywords
              </h4>
              <div className="flex flex-col gap-3">
                {keywords.map((item) => (
                  <div
                    key={item.label}
                    className={`border rounded-xl p-3 cursor-pointer transition-colors group ${item.cardClass}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider ${item.labelClass}`}>{item.label}</span>
                      <span className={`text-xs ${item.percentClass}`}>{item.percent}</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${item.barBgClass}`}>
                      <div className={`h-full rounded-full ${item.barFillClass}`}></div>
                    </div>
                    <p className={`text-sm text-secondary dark:text-gray-300 mt-2 transition-colors ${item.termClass}`}>
                      {item.term}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-secondary dark:text-white mb-4 flex items-center">
                <span className="material-icons-round text-lg mr-2 text-primary">bar_chart</span>
                Sentiment
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-icons-round text-green-500 text-sm">sentiment_satisfied_alt</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[70%]"></div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">70%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-red-400 text-sm">sentiment_dissatisfied</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 w-[10%]"></div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">10%</span>
              </div>
            </div>
          </aside>
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
