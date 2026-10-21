import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterOutlet } from '@angular/router';

/**
 * The plain layout of the public documents page: a top bar with the co-op's
 * logo and name, and the page. The public site has no signed-in parts
 * (L2-REQ-110).
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="top-bar" data-testid="site-top-bar">
      <div class="top-bar-inner">
        <div class="logo" data-testid="site-logo">
          <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
            <rect width="48" height="48" rx="14" fill="#B4502A" />
            <circle cx="17" cy="27" r="8" fill="#F6A98A" />
            <circle cx="31" cy="27" r="8" fill="#F0B35A" />
            <circle cx="24" cy="17" r="8" fill="#FBF7F0" />
          </svg>
          <span class="logo-text">OWN Housing <span class="nowrap">Co-op</span></span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-outlet />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
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

        /* Keep "Co-op" whole when the name wraps on a narrow phone. */
        .nowrap {
          white-space: nowrap;
        }
      }

      .main-content {
        flex: 1;
        overflow-y: auto;
      }
    `,
  ],
})
export class LayoutComponent {}
