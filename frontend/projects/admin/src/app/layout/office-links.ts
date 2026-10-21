import { SidebarLink } from './sidebar-link';

/** The office's sidebar: every section of the admin. */
export const OFFICE_LINKS: SidebarLink[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', testId: 'dashboard' },
  { path: '/maintenance', label: 'Maintenance', icon: 'maintenance', testId: 'maintenance' },
  { path: '/documents', label: 'Documents', icon: 'documents', testId: 'documents' },
  { path: '/pages', label: 'Pages', icon: 'pages', testId: 'pages' },
  { path: '/board', label: 'Board', icon: 'board', testId: 'board' },
  { path: '/website', label: 'Website', icon: 'website', testId: 'website' },
  { path: '/messages', label: 'Messages', icon: 'messages', testId: 'messages' },
  { path: '/users', label: 'Users', icon: 'users', testId: 'users' },
  { path: '/roles', label: 'Roles & Privileges', icon: 'roles', testId: 'roles' },
  { path: '/profiles', label: 'Profiles', icon: 'profiles', testId: 'profiles' },
  { path: '/assets', label: 'Assets', icon: 'assets', testId: 'assets' },
  { path: '/invitations', label: 'Invitations', icon: 'invitations', testId: 'invitations' },
  { path: '/settings', label: 'Settings', icon: 'settings', testId: 'settings' },
];
