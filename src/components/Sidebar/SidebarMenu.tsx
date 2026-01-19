import React from 'react';
import { Link } from 'react-router-dom';

export interface SidebarMenuItem {
  name: string;
  icon: string;
  path: string;
}

interface SummaryItem {
  id: string;
  name: string;
}

interface SidebarMenuProps {
  items: SidebarMenuItem[];
  isActive: (path: string) => boolean;
  isSummaryRoute: boolean;
  isSummaryOpen: boolean;
  onToggleSummary: () => void;
  summaryChildren: SummaryItem[];
  currentPathname: string;
  isCollapsed: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  items,
  isActive,
  isSummaryRoute,
  isSummaryOpen,
  onToggleSummary,
  summaryChildren,
  currentPathname,
  isCollapsed,
}) => (
  <nav className="sidebar-nav">
    {items.map((item) => {
      if (item.path === '/summary') {
        return (
          <div key={item.path} className="menu-group">
            <div className={`menu-row ${isSummaryRoute ? 'active' : 'inactive'}`}>
              <Link to={item.path} className="menu-link-content">
                <span className="material-icons-round menu-icon">{item.icon}</span>
                <span className="menu-text">{item.name}</span>
              </Link>
              {!isCollapsed && summaryChildren.length > 0 && (
                <button
                  type="button"
                  className="summary-toggle"
                  onClick={onToggleSummary}
                  aria-label={isSummaryOpen ? 'Collapse summary list' : 'Expand summary list'}
                >
                  <span className="material-icons-round summary-toggle-icon">
                    {isSummaryOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
              )}
            </div>
            {!isCollapsed && isSummaryOpen && summaryChildren.length > 0 && (
              <div className="summary-children">
                {summaryChildren.map((summary) => (
                  <Link
                    key={summary.id}
                    to={`/summary/${summary.id}`}
                    className={`summary-link ${currentPathname === `/summary/${summary.id}` ? 'active' : 'inactive'}`}
                  >
                    <span className="menu-text">{summary.name}</span>
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
          className={`menu-link ${isActive(item.path) ? 'active' : 'inactive'}`}
        >
          <span className="material-icons-round menu-icon">{item.icon}</span>
          <span className="menu-text">{item.name}</span>
        </Link>
      );
    })}
  </nav>
);

export default SidebarMenu;
