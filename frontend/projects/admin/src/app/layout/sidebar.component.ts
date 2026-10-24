import { Component, inject, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  AvatarComponent,
  IconComponent,
  LogoMarkComponent,
  NavLinkComponent,
  SidebarBrandComponent,
  SidebarComponent as LibSidebarComponent,
  SidebarGroupComponent,
  SidebarFooterComponent,
  SidebarNavComponent,
  SidebarUserComponent,
  SidebarUserNameComponent,
  SidebarUserRoleComponent,
} from 'components';
import { AuthService } from '../core/services/auth.service';
import { userRoleNames } from '../core/user-role-names';
import { APP_PATHS } from '../core/app-paths';
import { MEMBER_LINK_GROUPS } from './member-links';
import { OFFICE_LINK_GROUPS } from './office-link-groups';
import { SidebarGroup } from './sidebar-group';

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
    SidebarGroupComponent,
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

  readonly dashboardPath = APP_PATHS.dashboard;

  /** Member areas until the server says the person is the office. */
  readonly groups = signal<SidebarGroup[]>(MEMBER_LINK_GROUPS);

  ngOnInit(): void {
    this.authService
      .getCurrentUserFromApi()
      .subscribe((response) => this.role.set(userRoleNames(response?.user)));
    this.authService.office$.subscribe((office) =>
      this.groups.set(office ? OFFICE_LINK_GROUPS : MEMBER_LINK_GROUPS),
    );
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
