import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        background: #fff;
        border-bottom: 1px solid #e5e4e1;
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
        background: #f5f4f1;
        border-radius: 10px;
        border: 1px solid #e5e4e1;
      }
      .search-bar .material-icons {
        font-size: 18px;
        color: #1a1918cc;
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
        color: #1a1918cc;
      }
      .notification-btn:hover {
        background: #f5f4f1;
      }
    `,
  ],
})
export class TopbarComponent {
  @Input() title = '';
}
