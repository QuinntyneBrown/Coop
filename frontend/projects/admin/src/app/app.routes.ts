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
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
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
          import('./features/profiles/profiles.component').then((m) => m.ProfilesComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'maintenance',
        loadComponent: () =>
          import('./features/maintenance/maintenance.component').then(
            (m) => m.MaintenanceComponent,
          ),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./features/documents/documents.component').then((m) => m.DocumentsComponent),
      },
      {
        path: 'pages',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/pages/pages.component').then((m) => m.PagesComponent),
      },
      {
        path: 'board',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/board/board.component').then((m) => m.BoardComponent),
      },
      {
        path: 'website',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/website/website.component').then((m) => m.WebsiteComponent),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/messaging/messaging.component').then((m) => m.MessagingComponent),
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
          import('./features/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'roles',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/roles/roles.component').then((m) => m.RolesComponent),
      },
      {
        path: 'profiles',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/profiles/profiles.component').then((m) => m.ProfilesComponent),
      },
      {
        path: 'assets',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/assets/assets.component').then((m) => m.AssetsComponent),
      },
      {
        path: 'invitations',
        canActivate: [officeGuard],
        loadComponent: () =>
          import('./features/invitations/invitations.component').then(
            (m) => m.InvitationsComponent,
          ),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./features/change-password/change-password.component').then(
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
