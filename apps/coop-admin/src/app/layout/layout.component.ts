import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar class="layout-sidebar"></app-sidebar>
      <main class="layout-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }
    .layout-sidebar {
      flex-shrink: 0;
    }
    .layout-main {
      flex: 1;
      margin-left: 260px;
      min-height: 100vh;
      background: #F5F4F1;
    }
    @media (max-width: 768px) {
      .layout-sidebar {
        display: none;
      }
      .layout-main {
        margin-left: 0;
      }
    }
  `]
})
export class LayoutComponent {}
