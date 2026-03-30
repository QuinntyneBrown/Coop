import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-tab-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bottom-tab-bar" data-testid="bottom-tab-bar">
      <a routerLink="/dashboard" routerLinkActive="active" data-testid="tab-home" class="tab-item">
        <span class="material-icons">home</span>
        <span class="tab-label">Home</span>
      </a>
      <a routerLink="/maintenance" routerLinkActive="active" data-testid="tab-requests" class="tab-item">
        <span class="material-icons">build</span>
        <span class="tab-label">Requests</span>
      </a>
      <a routerLink="/documents" routerLinkActive="active" data-testid="tab-docs" class="tab-item">
        <span class="material-icons">description</span>
        <span class="tab-label">Docs</span>
      </a>
      <a routerLink="/messaging" routerLinkActive="active" data-testid="tab-messages" class="tab-item">
        <span class="material-icons">chat</span>
        <span class="tab-label">Messages</span>
      </a>
      <a routerLink="/profile" routerLinkActive="active" data-testid="tab-profile" class="tab-item">
        <span class="material-icons">person</span>
        <span class="tab-label">Profile</span>
      </a>
    </nav>
  `,
  styles: [`
    .bottom-tab-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #fff;
      border-top: 1px solid #E5E4E1;
      padding: 8px 0;
      padding-bottom: env(safe-area-inset-bottom, 8px);
      z-index: 1000;
    }
    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 4px 12px;
      color: #1A1918CC;
      text-decoration: none;
      font-size: 11px;
      border-radius: 8px;
      transition: color 0.2s;
    }
    .tab-item.active {
      color: #3D8A5A;
    }
    .tab-item .material-icons {
      font-size: 24px;
    }
    .tab-label {
      font-weight: 500;
    }
  `]
})
export class BottomTabBarComponent {}
