
import React, { useEffect, useMemo, useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';

interface SidebarProps {
  isDarkMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { t } = useLanguage();
  const [summaryItems, setSummaryItems] = useState<{ id: string; name: string; createdAt: number }[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const storageKey = 'summaryResults';

  const menuItems = [
    { name: t('home'), icon: 'home', path: '/home' },
    { name: t('project'), icon: 'folder_open', path: '/projects' },
    { name: t('template'), icon: 'dashboard', path: '/templates' },
    { name: t('summary'), icon: 'article', path: '/summary' },
  ];

  const isActive = (path: string) => {
    if (path === '/summary') {
      return location.pathname === '/summary' || location.pathname.startsWith('/summary/') || location.pathname.startsWith('/results');
    }
    return location.pathname === path;
  };
  const isSummaryRoute = isActive('/summary');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as { id: string; name: string; createdAt: number }[]) : [];
      setSummaryItems(parsed);
    } catch {
      setSummaryItems([]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isSummaryRoute && summaryItems.length > 0) {
      setIsSummaryOpen(true);
    }
  }, [isSummaryRoute, summaryItems.length]);

  const summaryChildren = useMemo(() => summaryItems.slice(0, 8), [summaryItems]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-[#f5f6f6] dark:bg-[#242526] border-r border-gray-100 dark:border-white/5 flex flex-col h-full self-stretch transition-all z-30">
      <nav className="mt-4 px-4 space-y-1.5 flex-grow">
        {menuItems.map((item) => {
          if (item.path === '/summary') {
            const rowClassName = `flex items-center px-4 py-3 rounded-xl transition-all ${
              isSummaryRoute
                ? 'bg-primary/10 text-primary font-bold dark:bg-primary/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-secondary dark:hover:text-white'
            }`;
            return (
              <div key={item.path} className="space-y-1">
                <div className={rowClassName}>
                  <Link to={item.path} className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="material-icons-round">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                  {summaryChildren.length > 0 && (
                    <button
                      type="button"
                      className="ml-2 text-slate-400 hover:text-primary transition-colors"
                      onClick={() => setIsSummaryOpen((prev) => !prev)}
                      aria-label={isSummaryOpen ? 'Collapse summary list' : 'Expand summary list'}
                    >
                      <span className="material-icons-round text-base">
                        {isSummaryOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                  )}
                </div>
                {isSummaryOpen && summaryChildren.length > 0 && (
                  <div className="ml-7 pl-4 border-l border-gray-200 dark:border-gray-700 flex flex-col gap-1">
                    {summaryChildren.map((summary) => (
                      <Link
                        key={summary.id}
                        to={`/summary/${summary.id}`}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                          location.pathname === `/summary/${summary.id}`
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-secondary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{summary.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary font-bold dark:bg-primary/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-secondary dark:hover:text-white'
              }`}
            >
              <span className="material-icons-round mr-3">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl p-2 transition-colors">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-gray-800 shadow-sm">
              <img
                alt="Profile"
                className="w-full h-full object-contain p-2"
                src="/person.svg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-secondary dark:text-white truncate">
                {user?.fullName ?? user?.firstName ?? 'user'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user?.primaryEmailAddress?.emailAddress ?? ''}
              </p>
            </div>
            <span className="material-icons-round text-slate-400 text-xl">more_vert</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-black text-white py-2 text-xs font-bold uppercase tracking-wider hover:bg-black/90 transition-colors"
          >
            <span className="material-icons-round text-sm">logout</span>
            {t('logout')}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
