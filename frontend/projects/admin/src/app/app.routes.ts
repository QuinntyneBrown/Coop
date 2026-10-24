import { Routes } from '@angular/router';
import { APP_PATHS } from './core/app-paths';
import { APP_TITLES } from './core/app-titles';
import { authGuard } from './core/guards/auth.guard';
import { officeGuard } from './core/guards/office.guard';
import { LayoutComponent } from './layout/layout.component';

/** A route path without its leading slash, as the router config wants it. */
const segment = (path: string) => path.slice(1);

/** The Website area (L2-REQ-118, ADR 0020): one office-only branch under /website. */
const websiteRoutes: Routes = [
  {
    path: '',
    title: APP_TITLES.website,
    loadComponent: () =>
      import('./features/website/website.component').then((m) => m.WebsiteComponent),
  },
  {
    path: 'home',
    title: APP_TITLES.websiteHome,
    data: { mode: 'home' },
    loadComponent: () =>
      import('./features/website/page-editor/page-editor.component').then(
        (m) => m.PageEditorComponent,
      ),
  },
  {
    path: 'menu-and-footer',
    title: APP_TITLES.websiteMenu,
    data: { mode: 'menu' },
    loadComponent: () =>
      import('./features/website/page-editor/page-editor.component').then(
        (m) => m.PageEditorComponent,
      ),
  },
  { path: 'pages', redirectTo: '', pathMatch: 'full' },
  {
    path: 'pages/new',
    title: APP_TITLES.websitePageNew,
    data: { mode: 'page' },
    loadComponent: () =>
      import('./features/website/page-editor/page-editor.component').then(
        (m) => m.PageEditorComponent,
      ),
  },
  {
    path: 'pages/:pageId',
    title: APP_TITLES.websitePages,
    data: { mode: 'page' },
    loadComponent: () =>
      import('./features/website/page-editor/page-editor.component').then(
        (m) => m.PageEditorComponent,
      ),
  },
  {
    path: 'board',
    title: APP_TITLES.websiteBoard,
    loadComponent: () =>
      import('./features/website/board/board.component').then((m) => m.BoardComponent),
  },
  {
    path: 'photos',
    title: APP_TITLES.websitePhotos,
    loadComponent: () =>
      import('./features/website/photos/photos.component').then((m) => m.PhotosComponent),
  },
  {
    path: 'look',
    title: APP_TITLES.websiteLook,
    loadComponent: () =>
      import('./features/settings/settings.component').then((m) => m.SettingsComponent),
  },
];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: segment(APP_PATHS.login),
    title: APP_TITLES.login,
    loadComponent: () =>
      import('./features/access/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: segment(APP_PATHS.register),
    title: APP_TITLES.register,
    loadComponent: () =>
      import('./features/access/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: segment(APP_PATHS.forgotPassword),
    title: APP_TITLES.forgotPassword,
    loadComponent: () =>
      import('./features/access/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: segment(APP_PATHS.onboarding),
    title: APP_TITLES.onboarding,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/access/onboarding/onboarding.component').then(
        (m) => m.OnboardingComponent,
      ),
  },
  // Routes with sidebar layout
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: segment(APP_PATHS.profile),
        title: APP_TITLES.profile,
        loadComponent: () =>
          import('./features/community/profiles/profiles.component').then(
            (m) => m.ProfilesComponent,
          ),
      },
      {
        path: segment(APP_PATHS.dashboard),
        title: APP_TITLES.dashboard,
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: segment(APP_PATHS.maintenance),
        title: APP_TITLES.maintenance,
        loadComponent: () =>
          import('./features/operations/maintenance/maintenance.component').then(
            (m) => m.MaintenanceComponent,
          ),
      },
      {
        path: segment(APP_PATHS.documents),
        title: APP_TITLES.documents,
        loadComponent: () =>
          import('./features/community/documents/documents.component').then(
            (m) => m.DocumentsComponent,
          ),
      },
      {
        path: segment(APP_PATHS.website),
        canActivate: [officeGuard],
        children: websiteRoutes,
      },
      // The addresses the Website area replaced (L2-REQ-118 AC4).
      { path: 'pages', redirectTo: segment(APP_PATHS.website), pathMatch: 'full' },
      { path: 'board', redirectTo: segment(APP_PATHS.websiteBoard), pathMatch: 'full' },
      { path: 'assets', redirectTo: segment(APP_PATHS.websitePhotos), pathMatch: 'full' },
      {
        path: segment(APP_PATHS.messages),
        title: APP_TITLES.messages,
        loadComponent: () =>
          import('./features/community/messaging/messaging.component').then(
            (m) => m.MessagingComponent,
          ),
      },
      {
        path: 'messaging',
        redirectTo: segment(APP_PATHS.messages),
        pathMatch: 'full',
      },
      {
        path: segment(APP_PATHS.users),
        title: APP_TITLES.users,
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/access/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: segment(APP_PATHS.roles),
        title: APP_TITLES.roles,
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/access/roles/roles.component').then((m) => m.RolesComponent),
      },
      {
        path: segment(APP_PATHS.profiles),
        title: APP_TITLES.profiles,
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/community/profiles/profiles.component').then(
            (m) => m.ProfilesComponent,
          ),
      },
      {
        path: segment(APP_PATHS.invitations),
        title: APP_TITLES.invitations,
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/access/invitations/invitations.component').then(
            (m) => m.InvitationsComponent,
          ),
      },
      {
        path: segment(APP_PATHS.changePassword),
        title: APP_TITLES.changePassword,
        loadComponent: () =>
          import('./features/access/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent,
          ),
      },
      {
        path: segment(APP_PATHS.settings),
        title: APP_TITLES.settings,
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
