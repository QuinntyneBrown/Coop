import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { officeGuard } from './core/guards/office.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/access/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/access/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/access/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'onboarding',
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
        path: 'profile',
        loadComponent: () =>
          import('./features/community/profiles/profiles.component').then(
            (m) => m.ProfilesComponent,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'maintenance',
        loadComponent: () =>
          import('./features/operations/maintenance/maintenance.component').then(
            (m) => m.MaintenanceComponent,
          ),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./features/community/documents/documents.component').then(
            (m) => m.DocumentsComponent,
          ),
      },
      {
        path: 'pages',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/cms/pages/pages.component').then((m) => m.PagesComponent),
      },
      {
        path: 'board',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/community/board/board.component').then((m) => m.BoardComponent),
      },
      {
        path: 'website',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/cms/website/website.component').then((m) => m.WebsiteComponent),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/community/messaging/messaging.component').then(
            (m) => m.MessagingComponent,
          ),
      },
      {
        path: 'messaging',
        redirectTo: 'messages',
        pathMatch: 'full',
      },
      {
        path: 'users',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/access/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'roles',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/access/roles/roles.component').then((m) => m.RolesComponent),
      },
      {
        path: 'profiles',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/community/profiles/profiles.component').then(
            (m) => m.ProfilesComponent,
          ),
      },
      {
        path: 'assets',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/operations/assets/assets.component').then((m) => m.AssetsComponent),
      },
      {
        path: 'invitations',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/access/invitations/invitations.component').then(
            (m) => m.InvitationsComponent,
          ),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./features/access/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent,
          ),
      },
      {
        path: 'settings',
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
