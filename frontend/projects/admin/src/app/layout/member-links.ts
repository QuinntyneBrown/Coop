import { APP_PATHS } from '../core/app-paths';
import { APP_TITLES } from '../core/app-titles';
import { SidebarGroup } from './sidebar-group';

/** A member's sidebar: only the member areas, in one group (L2-REQ-112). */
export const MEMBER_LINK_GROUPS: SidebarGroup[] = [
  {
    links: [
      {
        path: APP_PATHS.dashboard,
        label: APP_TITLES.dashboard,
        icon: 'dashboard',
        testId: 'dashboard',
      },
      {
        path: APP_PATHS.maintenance,
        label: APP_TITLES.maintenance,
        icon: 'maintenance',
        testId: 'maintenance',
      },
      {
        path: APP_PATHS.documents,
        label: APP_TITLES.documents,
        icon: 'documents',
        testId: 'documents',
      },
      {
        path: APP_PATHS.messages,
        label: APP_TITLES.messages,
        icon: 'messages',
        testId: 'messages',
      },
      { path: APP_PATHS.profile, label: APP_TITLES.profile, icon: 'profile', testId: 'profile' },
    ],
  },
];
