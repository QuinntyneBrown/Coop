import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar" data-testid="topbar">
      <div class="topbar-left">
        <h1 class="page-title" data-testid="topbar-title">{{ title }}</h1>
      </div>
      <div class="topbar-right">
        <div class="search-bar" data-testid="topbar-search">
          <span class="material-icons">search</span>
          <input type="text" placeholder="Search..." data-testid="topbar-search-input" />
        </div>
        <button class="notification-btn" data-testid="topbar-notification">
          <span class="material-icons">notifications</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background: #fff;
      border-bottom: 1px solid #E5E4E1;
    }
    .page-title {
      font-size: 20px;
      font-weight: 600;
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: #F5F4F1;
      border-radius: 10px;
      border: 1px solid #E5E4E1;
    }
    .search-bar .material-icons {
      font-size: 18px;
      color: #1A1918CC;
    }
    .search-bar input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      width: 200px;
    }
    .notification-btn {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 10px;
      cursor: pointer;
      color: #1A1918CC;
    }
    .notification-btn:hover {
      background: #F5F4F1;
    }
  `]
})
export class TopbarComponent {
  @Input() title = '';
}
