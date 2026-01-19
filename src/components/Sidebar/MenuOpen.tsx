import React from 'react';

interface MenuOpenProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const MenuOpen: React.FC<MenuOpenProps> = ({ isCollapsed, onToggle }) => (
  <div className="sidebar-header">
    <button
      type="button"
      className="collapse-toggle"
      onClick={onToggle}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <span className="material-icons-round">menu_open</span>
    </button>
  </div>
);

export default MenuOpen;
