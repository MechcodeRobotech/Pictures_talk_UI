import React from 'react';

interface SidebarLogoutProps {
  label: string;
  isCollapsed: boolean;
  onLogout: () => void;
}

const SidebarLogout: React.FC<SidebarLogoutProps> = ({ label, isCollapsed, onLogout }) => (
  <button
    type="button"
    onClick={onLogout}
    className="logout-button"
  >
    <span className="material-icons-round logout-icon">
      {isCollapsed ? 'exit_to_app' : 'logout'}
    </span>
    {!isCollapsed && label}
  </button>
);

export default SidebarLogout;
