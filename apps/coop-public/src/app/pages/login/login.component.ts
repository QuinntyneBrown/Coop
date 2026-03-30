import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Green header -->
    <div class="login-header" data-testid="login-header">
      <h1 data-testid="login-header-title">Coop</h1>
      <p data-testid="login-header-subtitle">Cooperative management</p>
    </div>

    <div class="login-body">
      <h2 class="welcome" data-testid="login-welcome-heading">Welcome back</h2>

      <form (ngSubmit)="onSubmit()" novalidate>
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            data-testid="login-username"
            [(ngModel)]="username"
            name="username"
            placeholder="Enter your username"
            [class.invalid]="submitted && !username"
          />
          <div class="error-message" *ngIf="submitted && !username" data-testid="login-username-error">
            Username is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            data-testid="login-password"
            [(ngModel)]="password"
            name="password"
            placeholder="Enter your password"
            [class.invalid]="submitted && !password"
          />
          <div class="error-message" *ngIf="submitted && !password" data-testid="login-password-error">
            Password is required
          </div>
        </div>

        <div class="forgot-row">
          <a routerLink="/forgot-password" data-testid="login-forgot-password">Forgot password?</a>
        </div>

        <div class="error-message login-error" *ngIf="loginError" data-testid="login-error">
          {{ loginError }}
        </div>

        <button type="submit" class="btn btn-primary btn-full sign-in-btn" data-testid="login-sign-in-btn" [disabled]="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="sign-up-row">
        Don't have an account?
        <a routerLink="/register" data-testid="login-sign-up-link">Sign up</a>
      </div>
    </div>

    <!-- Bottom tab bar -->
    <nav class="bottom-tab-bar" data-testid="bottom-tab-bar">
      <a routerLink="/dashboard" class="tab-item" data-testid="tab-home">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span>Home</span>
      </a>
      <a routerLink="/maintenance" class="tab-item" data-testid="tab-requests">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        <span>Requests</span>
      </a>
      <a routerLink="/documents" class="tab-item" data-testid="tab-docs">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span>Docs</span>
      </a>
      <a routerLink="/messaging" class="tab-item" data-testid="tab-messages">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>Messages</span>
      </a>
      <a routerLink="/profile" class="tab-item" data-testid="tab-profile">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Profile</span>
      </a>
    </nav>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--background);
    }

    .login-header {
      background: linear-gradient(135deg, var(--primary) 0%, #2D6B44 100%);
      color: white;
      padding: 48px 24px 40px;
      text-align: center;
      border-radius: 0 0 24px 24px;

      h1 { font-size: 32px; font-weight: 700; }
      p { font-size: 16px; opacity: 0.9; margin-top: 4px; }
    }

    .login-body {
      flex: 1;
      padding: 32px 24px;
      max-width: 400px;
      width: 100%;
      margin: 0 auto;
    }

    .welcome {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .forgot-row {
      text-align: right;
      margin-bottom: 8px;
      a { font-size: 14px; color: var(--primary); }
    }

    .login-error {
      margin-bottom: 12px;
      padding: 10px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: var(--radius-sm);
      text-align: center;
    }

    .sign-in-btn {
      margin-top: 8px;
      height: 48px;
      font-size: 16px;
    }

    .sign-up-row {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: var(--text-secondary);
      a { color: var(--primary); font-weight: 500; }
    }

    input.invalid {
      border-color: var(--error);
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
      min-width: 56px;

      &:hover { text-decoration: none; color: var(--primary); }
    }

    @media (min-width: 1024px) {
      .bottom-tab-bar { display: none; }
    }
  `],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  submitted = false;
  loading = false;
  loginError = '';

  onSubmit() {
    this.submitted = true;
    this.loginError = '';

    if (!this.username || !this.password) {
      return;
    }

    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.loginError = err.error?.message || err.error?.Message || 'Invalid username or password';
      },
    });
  }
}
