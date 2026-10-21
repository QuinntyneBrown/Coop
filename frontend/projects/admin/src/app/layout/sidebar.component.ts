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
import { MEMBER_LINKS } from './member-links';
import { OFFICE_LINKS } from './office-links';
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

  /** Member areas until the server says the person is the office. */
  readonly links = signal<SidebarLink[]>(MEMBER_LINKS);

  ngOnInit(): void {
    this.authService
      .getCurrentUserFromApi()
      .subscribe((response) => this.role.set(userRoleNames(response?.user)));
    this.authService.office$.subscribe((office) =>
      this.links.set(office ? OFFICE_LINKS : MEMBER_LINKS),
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
