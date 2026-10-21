import { Component, inject, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  AvatarComponent,
  IconComponent,
  LogoMarkComponent,
  NavLinkComponent,
  SidebarBrandComponent,
  SidebarComponent as LibSidebarComponent,
  SidebarFooterComponent,
  SidebarNavComponent,
  SidebarUserComponent,
  SidebarUserNameComponent,
  SidebarUserRoleComponent,
} from 'components';
import { AuthService } from '../core/services/auth.service';
import { userRoleNames } from '../core/user-role-names';
import { SidebarLink } from './sidebar-link';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AvatarComponent,
    IconComponent,
    LibSidebarComponent,
    LogoMarkComponent,
    NavLinkComponent,
    SidebarBrandComponent,
    SidebarFooterComponent,
    SidebarNavComponent,
    SidebarUserComponent,
    SidebarUserNameComponent,
    SidebarUserRoleComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly role = signal('');

  readonly links: SidebarLink[] = [
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

  ngOnInit(): void {
    this.authService
      .getCurrentUserFromApi()
      .subscribe((response) => this.role.set(userRoleNames(response?.user)));
  }

  get username(): string {
    return this.authService.currentUser?.username || 'User';
  }

  get userInitial(): string {
    return this.username.charAt(0).toUpperCase();
  }

  isActive(path: string): string {
    return this.router.url.startsWith(path) ? 'true' : 'false';
  }
}
