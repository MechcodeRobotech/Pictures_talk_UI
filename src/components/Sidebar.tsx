
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

interface SidebarProps {
  isDarkMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode }) => {
  const location = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    { name: t('home'), icon: 'home', path: '/' },
    { name: t('project'), icon: 'folder_open', path: '/projects' },
    { name: t('template'), icon: 'dashboard', path: '/templates' },
    { name: t('summary'), icon: 'article', path: '/summary' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // กำหนด URL โลโก้สำหรับแต่ละธีม (คุณสามารถเปลี่ยน URL ได้ที่นี่)
  const logoLight = "https://static.wixstatic.com/media/b69b08_d3e4b97f3ace4015866b1f2738fafdf0~mv2.png/v1/fill/w_159,h_44,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo_Secondary_onWhite_Secondary_onWhite.png";
  
  // หากมี URL สำหรับ Dark Mode โดยเฉพาะ สามารถนำมาใส่ที่นี่ได้เลยครับ
  const logoDark = "https://static.wixstatic.com/media/b69b08_d3e4b97f3ace4015866b1f2738fafdf0~mv2.png/v1/fill/w_159,h_44,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo_Secondary_onWhite_Secondary_onWhite.png";

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-gray-100 dark:border-white/5 flex flex-col h-auto md:h-screen transition-all z-30">
      <div className="p-6 md:p-8">
        <Link to="/" className="flex items-center group">
          <div className="h-10 w-auto flex items-center overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-300">
            <img 
              src={isDarkMode ? logoDark : logoLight} 
              alt="Pictures Talk" 
              className={`h-full w-auto object-contain transition-all ${isDarkMode ? 'brightness-200 grayscale-0' : ''}`}
            />
          </div>
        </Link>
      </div>

      <nav className="mt-2 md:mt-4 px-4 space-y-1.5 flex-grow">
        {menuItems.map((item) => (
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
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 space-y-6">
        <div className="bg-amber-50 dark:bg-primary/5 p-4 rounded-2xl border border-amber-100 dark:border-primary/10">
          <h3 className="text-sm font-bold text-secondary dark:text-white mb-2">{t('upgrade_plan')}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{t('upgrade_desc')}</p>
          <button className="w-full bg-secondary text-white dark:bg-primary dark:text-secondary text-xs font-black py-3 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wider">
            {t('upgrade_now')}
          </button>
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl p-2 transition-colors">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-gray-800 shadow-sm">
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src="https://picsum.photos/seed/user123/100/100"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-secondary dark:text-white truncate">Jane Doe</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">jane@picturestalk.ai</p>
            </div>
            <span className="material-icons-round text-slate-400 text-xl">more_vert</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
