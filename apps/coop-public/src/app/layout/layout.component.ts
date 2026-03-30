import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { UserService, UserProfile } from '../core/services/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile Header -->
    <header class="top-bar" data-testid="dashboard-top-bar">
      <div class="top-bar-inner">
        <div class="logo" data-testid="dashboard-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="var(--primary)"/>
            <text x="14" y="19" text-anchor="middle" fill="white" font-size="14" font-weight="600" font-family="Outfit">C</text>
          </svg>
          <span class="logo-text">Coop</span>
        </div>
        <div class="top-bar-actions">
          <button class="icon-btn" data-testid="dashboard-notification-bell" (click)="onBellClick()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="notification-badge" data-testid="dashboard-notification-badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
          </button>
          <button class="icon-btn hamburger" data-testid="dashboard-hamburger-menu" (click)="toggleMenu()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Sidebar (desktop) -->
    <aside class="sidebar" [class.open]="menuOpen">
      <div class="sidebar-header">
        <div class="logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="var(--primary)"/>
            <text x="14" y="19" text-anchor="middle" fill="white" font-size="14" font-weight="600" font-family="Outfit">C</text>
          </svg>
          <span class="logo-text">Coop</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="sidebar-link" (click)="menuOpen = false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span>Home</span>
        </a>
        <a routerLink="/maintenance" routerLinkActive="active" class="sidebar-link" (click)="menuOpen = false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          <span>Requests</span>
        </a>
        <a routerLink="/documents" routerLinkActive="active" class="sidebar-link" (click)="menuOpen = false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span>Documents</span>
        </a>
        <a routerLink="/messaging" routerLinkActive="active" class="sidebar-link" (click)="menuOpen = false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Messages</span>
        </a>
        <a routerLink="/profile" routerLinkActive="active" class="sidebar-link" (click)="menuOpen = false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Profile</span>
        </a>
      </nav>
    </aside>

    <!-- Backdrop for mobile sidebar -->
    <div class="sidebar-backdrop" *ngIf="menuOpen" (click)="menuOpen = false"></div>

    <!-- Main Content -->
    <main class="main-content">
      <router-outlet />
    </main>

    <!-- Bottom Tab Bar (mobile) -->
    <nav class="bottom-tab-bar" data-testid="bottom-tab-bar">
      <a routerLink="/dashboard" routerLinkActive="active" class="tab-item" data-testid="tab-home">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        <span>Home</span>
      </a>
      <a routerLink="/maintenance" routerLinkActive="active" class="tab-item" data-testid="tab-requests">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        <span>Requests</span>
      </a>
      <a routerLink="/documents" routerLinkActive="active" class="tab-item" data-testid="tab-docs">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <span>Docs</span>
      </a>
      <a routerLink="/messaging" routerLinkActive="active" class="tab-item" data-testid="tab-messages">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Messages</span>
      </a>
      <a routerLink="/profile" routerLinkActive="active" class="tab-item" data-testid="tab-profile">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Profile</span>
      </a>
    </nav>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      min-height: 100vh;
    }

    .top-bar {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .top-bar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      max-width: 1440px;
      margin: 0 auto;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .top-bar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-btn {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 8px;
      color: var(--text-primary);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover { background: var(--primary-light); }
    }

    .notification-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background: var(--error);
      color: #fff;
      font-size: 10px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Sidebar */
    .sidebar {
      display: none;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: 260px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      z-index: 200;
      flex-direction: column;
      padding: 20px 0;
    }

    .sidebar-header {
      padding: 0 20px 20px;
      border-bottom: 1px solid var(--border);
    }

    .sidebar-nav {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;

      &:hover { background: var(--primary-light); color: var(--primary); text-decoration: none; }
      &.active { background: var(--primary-light); color: var(--primary); }
    }

    .sidebar-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 199;
    }

    /* Main content */
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 72px;
    }

    /* Bottom tab bar */
    .bottom-tab-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--surface);
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-around;
      padding: 8px 0 calc(8px + env(safe-area-inset-bottom, 0px));
      z-index: 100;
    }

    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 4px 12px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 11px;
      font-weight: 500;
      transition: color 0.2s;
      min-width: 56px;

      &.active { color: var(--primary); }
      &:hover { text-decoration: none; color: var(--primary); }

      svg { width: 24px; height: 24px; }
    }

    /* Desktop layout */
    @media (min-width: 1024px) {
      :host {
        flex-direction: row;
      }

      .top-bar {
        display: none;
      }

      .sidebar {
        display: flex;
      }

      .main-content {
        margin-left: 260px;
        padding-bottom: 0;
        flex: 1;
      }

      .bottom-tab-bar {
        display: none;
      }
    }

    /* Mobile sidebar overlay */
    @media (max-width: 1023px) {
      .sidebar.open {
        display: flex;
      }

      .sidebar-backdrop {
        &:host-context(.sidebar.open) { display: block; }
      }
    }
  `],
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  menuOpen = false;
  notificationCount = 0;
  user: UserProfile | null = null;

  ngOnInit() {
    if (this.authService.isAuthenticated) {
      this.userService.getProfile().subscribe({
        next: (profile) => this.user = profile,
        error: () => {},
      });
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onBellClick() {
    // notifications stub
  }
}
