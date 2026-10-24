import { APP_PATHS } from '../core/app-paths';
import { APP_TITLES } from '../core/app-titles';
import { SidebarGroup } from './sidebar-group';

/**
 * The office's sidebar, grouped as the feature folders are (L2-REQ-118 AC1,
 * ADR 0020): Dashboard, Website, Community, Operations, Access, Settings.
 */
export const OFFICE_LINK_GROUPS: SidebarGroup[] = [
  {
    links: [
      {
        path: APP_PATHS.dashboard,
        label: APP_TITLES.dashboard,
        icon: 'dashboard',
        testId: 'dashboard',
      },
      { path: APP_PATHS.website, label: APP_TITLES.website, icon: 'website', testId: 'website' },
    ],
  },
  {
    heading: 'Community',
    links: [
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
      {
        path: APP_PATHS.profiles,
        label: APP_TITLES.profiles,
        icon: 'profiles',
        testId: 'profiles',
      },
    ],
  },
  {
    heading: 'Operations',
    links: [
      {
        path: APP_PATHS.maintenance,
        label: APP_TITLES.maintenance,
        icon: 'maintenance',
        testId: 'maintenance',
      },
    ],
  },
  {
    heading: 'Access',
    links: [
      { path: APP_PATHS.users, label: APP_TITLES.users, icon: 'users', testId: 'users' },
      { path: APP_PATHS.roles, label: APP_TITLES.roles, icon: 'roles', testId: 'roles' },
      {
        path: APP_PATHS.invitations,
        label: APP_TITLES.invitations,
        icon: 'invitations',
        testId: 'invitations',
      },
    ],
  },
  {
    links: [
      {
        path: APP_PATHS.settings,
        label: APP_TITLES.settings,
        icon: 'settings',
        testId: 'settings',
      },
    ],
  },
];
