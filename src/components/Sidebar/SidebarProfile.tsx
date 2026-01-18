import React from 'react';

interface SidebarProfileProps {
  avatarSrc: string;
  name: string;
  email: string;
  isCollapsed: boolean;
}

const SidebarProfile: React.FC<SidebarProfileProps> = ({ avatarSrc, name, email, isCollapsed }) => (
  <div className="profile-row">
    <div className="profile-avatar">
      <img
        alt="Profile"
        className="profile-avatar-image"
        src={avatarSrc}
      />
    </div>
    {!isCollapsed && (
      <>
        <div className="profile-info">
          <p className="profile-name">{name}</p>
          <p className="profile-email">{email}</p>
        </div>
        <span className="material-icons-round profile-more">more_vert</span>
      </>
    )}
  </div>
);

export default SidebarProfile;
