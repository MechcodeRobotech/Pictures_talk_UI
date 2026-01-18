import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';
import MenuOpen from '../Sidebar/MenuOpen';
import SidebarMenu, { SidebarMenuItem } from '../Sidebar/SidebarMenu';
import SidebarProfile from '../Sidebar/SidebarProfile';
import SidebarLogout from '../Sidebar/SidebarLogout';

const SIDEBAR_WIDTH_MD_PX = 256;
const SIDEBAR_WIDTH_COLLAPSED_PX = 80;
const SIDEBAR_Z_INDEX = 30;
const NAV_MARGIN_TOP_PX = 16;
const NAV_PADDING_X_PX = 16;
const NAV_GAP_PX = 6;
const MENU_PADDING_X_PX = 16;
const MENU_PADDING_Y_PX = 12;
const MENU_RADIUS_PX = 12;
const MENU_ICON_GAP_PX = 12;
const MENU_ICON_SIZE_PX = 24;
const SUMMARY_GROUP_GAP_PX = 4;
const SUMMARY_TOGGLE_MARGIN_LEFT_PX = 8;
const SUMMARY_CHILD_MARGIN_LEFT_PX = 28;
const SUMMARY_CHILD_PADDING_LEFT_PX = 16;
const SUMMARY_CHILD_GAP_PX = 4;
const SUMMARY_CHILD_PADDING_X_PX = 12;
const SUMMARY_CHILD_PADDING_Y_PX = 8;
const SUMMARY_CHILD_RADIUS_PX = 8;
const FOOTER_PADDING_PX = 16;
const FOOTER_TOP_PADDING_PX = 8;
const PROFILE_ROW_PADDING_X_PX = 8;
const PROFILE_ROW_PADDING_Y_PX = 4;
const PROFILE_ROW_RADIUS_PX = 12;
const PROFILE_ROW_GAP_PX = 12;
const PROFILE_AVATAR_SIZE_PX = 40;
const PROFILE_AVATAR_RING_PX = 2;
const PROFILE_AVATAR_IMAGE_PADDING_PX = 8;
const PROFILE_NAME_FONT_SIZE_PX = 14;
const PROFILE_EMAIL_FONT_SIZE_PX = 11;
const PROFILE_MORE_ICON_SIZE_PX = 20;
const LOGOUT_MARGIN_TOP_PX = 12;
const LOGOUT_PADDING_Y_PX = 8;
const LOGOUT_RADIUS_PX = 12;
const LOGOUT_FONT_SIZE_PX = 12;
const LOGOUT_ICON_SIZE_PX = 14;
const LOGOUT_LETTER_SPACING_PX = 0.6;
const BASE_TEXT_SIZE_PX = 16;
const TEXT_SM_SIZE_PX = 14;
const BREAKPOINT_MD_PX = 768;
const TRANSITION_MS = 150;

const COLOR_PRIMARY = '#F8AF24';
const COLOR_SECONDARY = '#111111';
const COLOR_WHITE = '#ffffff';
const COLOR_BLACK = '#000000';
const COLOR_SLATE_400 = '#94a3b8';
const COLOR_SLATE_500 = '#64748b';
const COLOR_GRAY_50 = '#f9fafb';
const COLOR_GRAY_100 = '#f3f4f6';
const COLOR_GRAY_200 = '#e5e7eb';
const COLOR_GRAY_700 = '#374151';
const COLOR_GRAY_800 = '#1f2937';
const COLOR_PRIMARY_10 = 'rgba(248, 175, 36, 0.1)';
const COLOR_PRIMARY_20 = 'rgba(248, 175, 36, 0.2)';
const COLOR_WHITE_05 = 'rgba(255, 255, 255, 0.05)';
const COLOR_BLACK_90 = 'rgba(0, 0, 0, 0.9)';
const SIDEBAR_BG_LIGHT = '#f5f6f6';
const SIDEBAR_BG_DARK = '#242526';
const STORAGE_KEY = 'summaryResults';

interface SidebarProps {
  isDarkMode?: boolean;
}

const SidebarContainer = styled.aside`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;
  align-self: stretch;
  transition: all ${TRANSITION_MS}ms ease;
  z-index: ${SIDEBAR_Z_INDEX};
  background: ${SIDEBAR_BG_LIGHT};
  border-right: 1px solid ${COLOR_GRAY_100};

  @media (min-width: ${BREAKPOINT_MD_PX}px) {
    width: ${SIDEBAR_WIDTH_MD_PX}px;
  }

  &.collapsed {
    @media (min-width: ${BREAKPOINT_MD_PX}px) {
      width: ${SIDEBAR_WIDTH_COLLAPSED_PX}px;
    }
  }

  &.dark {
    background: ${SIDEBAR_BG_DARK};
    border-right-color: ${COLOR_WHITE_05};
  }

  .sidebar-header {
    margin-top: ${NAV_MARGIN_TOP_PX}px;
    padding: 0 ${NAV_PADDING_X_PX}px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .collapse-toggle {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${COLOR_SLATE_500};
    border: none;
    background: transparent;
    cursor: pointer;
    transition: color ${TRANSITION_MS}ms ease, background-color ${TRANSITION_MS}ms ease;
  }

  .collapse-toggle:hover {
    background: ${COLOR_GRAY_50};
    color: ${COLOR_SECONDARY};
  }

  &.dark .collapse-toggle {
    color: ${COLOR_SLATE_400};
  }

  &.dark .collapse-toggle:hover {
    background: ${COLOR_WHITE_05};
    color: ${COLOR_WHITE};
  }

  .sidebar-nav {
    margin-top: ${NAV_MARGIN_TOP_PX}px;
    padding: 0 ${NAV_PADDING_X_PX}px;
    display: flex;
    flex-direction: column;
    gap: ${NAV_GAP_PX}px;
    flex-grow: 1;
  }

  .menu-group {
    display: flex;
    flex-direction: column;
    gap: ${SUMMARY_GROUP_GAP_PX}px;
  }

  .menu-row,
  .menu-link {
    display: flex;
    align-items: center;
    padding: ${MENU_PADDING_Y_PX}px ${MENU_PADDING_X_PX}px;
    border-radius: ${MENU_RADIUS_PX}px;
    transition: all ${TRANSITION_MS}ms ease;
    color: ${COLOR_SLATE_500};
    text-decoration: none;
  }

  .menu-row.active,
  .menu-link.active {
    background: ${COLOR_PRIMARY_10};
    color: ${COLOR_PRIMARY};
    font-weight: 700;
  }

  &.dark .menu-row.active,
  &.dark .menu-link.active {
    background: ${COLOR_PRIMARY_20};
  }

  .menu-row.inactive:hover,
  .menu-link.inactive:hover {
    background: ${COLOR_GRAY_50};
    color: ${COLOR_SECONDARY};
  }

  &.dark .menu-row.inactive,
  &.dark .menu-link.inactive {
    color: ${COLOR_SLATE_400};
  }

  &.dark .menu-row.inactive:hover,
  &.dark .menu-link.inactive:hover {
    background: ${COLOR_WHITE_05};
    color: ${COLOR_WHITE};
  }

  .menu-link-content {
    display: flex;
    align-items: center;
    gap: ${MENU_ICON_GAP_PX}px;
    flex: 1;
    min-width: 0;
    color: inherit;
    text-decoration: none;
  }

  .menu-icon {
    font-size: ${MENU_ICON_SIZE_PX}px;
  }

  .menu-link {
    gap: ${MENU_ICON_GAP_PX}px;
  }

  .menu-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .summary-toggle {
    margin-left: ${SUMMARY_TOGGLE_MARGIN_LEFT_PX}px;
    color: ${COLOR_SLATE_400};
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: color ${TRANSITION_MS}ms ease;
    display: inline-flex;
    align-items: center;
  }

  .summary-toggle:hover {
    color: ${COLOR_PRIMARY};
  }

  .summary-toggle-icon {
    font-size: ${BASE_TEXT_SIZE_PX}px;
  }

  .summary-children {
    margin-left: ${SUMMARY_CHILD_MARGIN_LEFT_PX}px;
    padding-left: ${SUMMARY_CHILD_PADDING_LEFT_PX}px;
    border-left: 1px solid ${COLOR_GRAY_200};
    display: flex;
    flex-direction: column;
    gap: ${SUMMARY_CHILD_GAP_PX}px;
  }

  &.dark .summary-children {
    border-left-color: ${COLOR_GRAY_700};
  }

  .summary-link {
    display: flex;
    align-items: center;
    padding: ${SUMMARY_CHILD_PADDING_Y_PX}px ${SUMMARY_CHILD_PADDING_X_PX}px;
    border-radius: ${SUMMARY_CHILD_RADIUS_PX}px;
    font-size: ${TEXT_SM_SIZE_PX}px;
    transition: color ${TRANSITION_MS}ms ease, background-color ${TRANSITION_MS}ms ease;
    color: ${COLOR_SLATE_500};
    text-decoration: none;
  }

  .summary-link.active {
    background: ${COLOR_PRIMARY_10};
    color: ${COLOR_PRIMARY};
    font-weight: 600;
  }

  .summary-link.inactive:hover {
    background: ${COLOR_GRAY_50};
    color: ${COLOR_SECONDARY};
  }

  &.dark .summary-link {
    color: ${COLOR_SLATE_400};
  }

  &.dark .summary-link.inactive:hover {
    background: ${COLOR_WHITE_05};
    color: ${COLOR_WHITE};
  }

  .footer {
    padding: ${FOOTER_PADDING_PX}px;
  }

  .profile-section {
    padding-top: ${FOOTER_TOP_PADDING_PX}px;
    border-top: 1px solid ${COLOR_GRAY_100};
  }

  &.dark .profile-section {
    border-top-color: ${COLOR_WHITE_05};
  }

  .profile-row {
    display: flex;
    align-items: center;
    gap: ${PROFILE_ROW_GAP_PX}px;
    padding: ${PROFILE_ROW_PADDING_Y_PX}px ${PROFILE_ROW_PADDING_X_PX}px;
    border-radius: ${PROFILE_ROW_RADIUS_PX}px;
    cursor: pointer;
    transition: background-color ${TRANSITION_MS}ms ease, color ${TRANSITION_MS}ms ease;
  }

  .profile-row:hover {
    background: ${COLOR_GRAY_50};
  }

  &.dark .profile-row:hover {
    background: ${COLOR_WHITE_05};
  }

  .profile-avatar {
    width: ${PROFILE_AVATAR_SIZE_PX}px;
    height: ${PROFILE_AVATAR_SIZE_PX}px;
    border-radius: 9999px;
    overflow: hidden;
    border: ${PROFILE_AVATAR_RING_PX}px solid ${COLOR_GRAY_100};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;
  }

  &.dark .profile-avatar {
    border-color: ${COLOR_GRAY_800};
  }

  .profile-avatar-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: ${PROFILE_AVATAR_IMAGE_PADDING_PX}px;
  }

  .profile-info {
    flex: 1;
    min-width: 0;
  }

  .profile-name {
    font-size: ${PROFILE_NAME_FONT_SIZE_PX}px;
    font-weight: 700;
    color: ${COLOR_SECONDARY};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.dark .profile-name {
    color: ${COLOR_WHITE};
  }

  .profile-email {
    font-size: ${PROFILE_EMAIL_FONT_SIZE_PX}px;
    color: ${COLOR_SLATE_500};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.dark .profile-email {
    color: ${COLOR_SLATE_400};
  }

  .profile-more {
    font-size: ${PROFILE_MORE_ICON_SIZE_PX}px;
    color: ${COLOR_SLATE_400};
  }

  .logout-button {
    margin-top: ${LOGOUT_MARGIN_TOP_PX}px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${MENU_ICON_GAP_PX}px;
    border-radius: ${LOGOUT_RADIUS_PX}px;
    background: ${COLOR_BLACK};
    color: ${COLOR_WHITE};
    padding: ${LOGOUT_PADDING_Y_PX}px 0;
    font-size: ${LOGOUT_FONT_SIZE_PX}px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: ${LOGOUT_LETTER_SPACING_PX}px;
    border: none;
    cursor: pointer;
    transition: background-color ${TRANSITION_MS}ms ease;
  }

  .logout-button:hover {
    background: ${COLOR_BLACK_90};
  }

  .logout-icon {
    font-size: ${LOGOUT_ICON_SIZE_PX}px;
  }

  &.collapsed {
    .sidebar-nav {
      padding: 0 ${NAV_PADDING_X_PX / 2}px;
    }

    .menu-row,
    .menu-link {
      justify-content: center;
      padding: ${MENU_PADDING_Y_PX}px ${MENU_PADDING_X_PX / 2}px;
    }

    .menu-link-content {
      justify-content: center;
    }

    .menu-text,
    .summary-toggle,
    .summary-children,
    .profile-info,
    .profile-more {
      display: none;
    }

    .profile-row {
      justify-content: center;
    }

    .logout-button {
      padding: ${LOGOUT_PADDING_Y_PX}px 0;
    }
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [summaryItems, setSummaryItems] = useState<{ id: string; name: string; createdAt: number }[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const menuItems: SidebarMenuItem[] = [
    { name: t('home'), icon: 'home', path: '/home' },
    { name: t('project'), icon: 'folder_open', path: '/projects' },
    { name: t('template'), icon: 'dashboard', path: '/templates' },
    { name: t('summary'), icon: 'article', path: '/summary' },
    { name: t('canvas'), icon: 'draw', path: '/canvas' },
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
      const raw = localStorage.getItem(STORAGE_KEY);
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

  const themeClassName = `${isDarkMode ? 'dark' : 'light'}${isCollapsed ? ' collapsed' : ''}`;

  return (
    <SidebarContainer className={themeClassName}>
      <MenuOpen isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((prev) => !prev)} />
      <SidebarMenu
        items={menuItems}
        isActive={isActive}
        isSummaryRoute={isSummaryRoute}
        isSummaryOpen={isSummaryOpen}
        onToggleSummary={() => setIsSummaryOpen((prev) => !prev)}
        summaryChildren={summaryChildren}
        currentPathname={location.pathname}
        isCollapsed={isCollapsed}
      />

      <div className="footer">
        <div className="profile-section">
          <SidebarProfile
            avatarSrc={isDarkMode ? '/PersonLight.svg' : '/PersonDark.svg'}
            name={user?.fullName ?? user?.firstName ?? 'user'}
            email={user?.primaryEmailAddress?.emailAddress ?? ''}
            isCollapsed={isCollapsed}
          />
          <SidebarLogout
            label={t('logout')}
            isCollapsed={isCollapsed}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;
