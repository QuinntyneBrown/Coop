import { SidebarLink } from './sidebar-link';

/** A member's sidebar: only the member areas (L2-REQ-104). */
export const MEMBER_LINKS: SidebarLink[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', testId: 'dashboard' },
  { path: '/maintenance', label: 'Maintenance', icon: 'maintenance', testId: 'maintenance' },
  { path: '/documents', label: 'Documents', icon: 'documents', testId: 'documents' },
  { path: '/messages', label: 'Messages', icon: 'messages', testId: 'messages' },
  { path: '/profile', label: 'My profile', icon: 'profile', testId: 'profile' },
];
