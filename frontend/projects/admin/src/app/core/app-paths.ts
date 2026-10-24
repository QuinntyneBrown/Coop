/**
 * Every route path of the admin, in one place (L2-REQ-118 AC5, ADR 0020).
 * Routes, links, the sidebar, the tab bar and the site tree read from here
 * instead of repeating route strings.
 */
export const APP_PATHS = {
  landing: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  profile: '/profile',
  changePassword: '/change-password',
  maintenance: '/maintenance',
  documents: '/documents',
  messages: '/messages',
  profiles: '/profiles',
  users: '/users',
  roles: '/roles',
  invitations: '/invitations',
  settings: '/settings',
  website: '/website',
  websiteHome: '/website/home',
  websiteMenu: '/website/menu-and-footer',
  websitePages: '/website/pages',
  websitePageNew: '/website/pages/new',
  websitePage: (pageId: string) => `/website/pages/${pageId}`,
  websiteBoard: '/website/board',
  websitePhotos: '/website/photos',
  websiteLook: '/website/look',
} as const;
