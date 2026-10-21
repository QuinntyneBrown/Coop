import { Routes } from '@angular/router';
import { adminLoginGuard } from './core/guards/admin-login.guard';
import { LayoutComponent } from './layout/layout.component';

/**
 * Addresses of the member pages, register and forgot-password the public site
 * once had. Members now do everything that needs signing in on the admin site,
 * so each of these opens the admin login (L2-REQ-110, L2-REQ-111, ADR 0016).
 */
const ADMIN_SITE_ADDRESSES = [
  'dashboard',
  'maintenance',
  'messaging',
  'profile',
  'onboarding',
  'register',
  'forgot-password',
];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'pages/:slug',
    loadComponent: () =>
      import('./pages/content-page/content-page.component').then((m) => m.ContentPageComponent),
  },
  // The public site has no login screen; /login leaves for the admin one.
  { path: 'login', canActivate: [adminLoginGuard], children: [] },
  ...ADMIN_SITE_ADDRESSES.map((path) => ({ path, canActivate: [adminLoginGuard], children: [] })),
  {
    path: 'documents',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/documents/documents.component').then((m) => m.DocumentsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
