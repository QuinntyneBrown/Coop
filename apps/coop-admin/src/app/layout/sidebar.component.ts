import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" data-testid="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="material-icons logo-icon">apartment</span>
          <span class="logo-text">Coop Manager</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" data-testid="nav-dashboard">
          <span class="material-icons">dashboard</span>
          <span>Dashboard</span>
        </a>
        <a routerLink="/maintenance" routerLinkActive="active" class="nav-item" data-testid="nav-maintenance">
          <span class="material-icons">build</span>
          <span>Maintenance</span>
        </a>
        <a routerLink="/documents" routerLinkActive="active" class="nav-item" data-testid="nav-documents">
          <span class="material-icons">description</span>
          <span>Documents</span>
        </a>
        <a routerLink="/messaging" routerLinkActive="active" class="nav-item" data-testid="nav-messages">
          <span class="material-icons">chat</span>
          <span>Messages</span>
        </a>
        <a routerLink="/users" routerLinkActive="active" class="nav-item" data-testid="nav-users">
          <span class="material-icons">people</span>
          <span>Users</span>
        </a>
        <a routerLink="/roles" routerLinkActive="active" class="nav-item" data-testid="nav-roles">
          <span class="material-icons">admin_panel_settings</span>
          <span>Roles & Privileges</span>
        </a>
        <a routerLink="/profiles" routerLinkActive="active" class="nav-item" data-testid="nav-profiles">
          <span class="material-icons">badge</span>
          <span>Profiles</span>
        </a>
        <a routerLink="/assets" routerLinkActive="active" class="nav-item" data-testid="nav-assets">
          <span class="material-icons">perm_media</span>
          <span>Assets</span>
        </a>
        <a routerLink="/invitations" routerLinkActive="active" class="nav-item" data-testid="nav-invitations">
          <span class="material-icons">mail</span>
          <span>Invitations</span>
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="nav-item" data-testid="nav-settings">
          <span class="material-icons">settings</span>
          <span>Settings</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info" data-testid="sidebar-user-info">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-details">
            <span class="user-name">{{ username }}</span>
            <span class="user-role">Member</span>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background: #fff;
      border-right: 1px solid #E5E4E1;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
    }
    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #E5E4E1;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-icon {
      color: #3D8A5A;
      font-size: 28px;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #1A1918;
    }
    .sidebar-nav {
      flex: 1;
      padding: 12px;
      overflow-y: auto;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 10px;
      color: #1A1918CC;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 2px;
      transition: all 0.2s ease;
    }
    .nav-item:hover {
      background: #F5F4F1;
      text-decoration: none;
    }
    .nav-item.active {
      background: #3D8A5A;
      color: #fff;
    }
    .nav-item .material-icons {
      font-size: 20px;
    }
    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid #E5E4E1;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #3D8A5A;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }
    .user-details {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-size: 14px;
      font-weight: 500;
    }
    .user-role {
      font-size: 12px;
      color: #1A1918CC;
    }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);

  get username(): string {
    return this.authService.currentUser?.username || 'User';
  }

  get userInitial(): string {
    return this.username.charAt(0).toUpperCase();
  }
}
