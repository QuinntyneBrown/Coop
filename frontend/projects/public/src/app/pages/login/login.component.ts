import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
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
          @if (submitted && !username) {
            <div class="error-message" data-testid="login-username-error">Username is required</div>
          }
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
          @if (submitted && !password) {
            <div class="error-message" data-testid="login-password-error">Password is required</div>
          }
        </div>

        <div class="forgot-row">
          <a routerLink="/forgot-password" data-testid="login-forgot-password">Forgot password?</a>
        </div>

        @if (loginError) {
          <div class="error-message login-error" data-testid="login-error">
            {{ loginError }}
          </div>
        }

        <button
          type="submit"
          class="btn btn-primary btn-full sign-in-btn"
          data-testid="login-sign-in-btn"
          [disabled]="loading"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="sign-up-row">
        Don't have an account?
        <a routerLink="/register" data-testid="login-sign-up-link">Sign up</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: var(--background);
      }

      .login-header {
        background: linear-gradient(135deg, var(--primary) 0%, #2d6b44 100%);
        color: white;
        padding: 48px 24px 40px;
        text-align: center;
        border-radius: 0 0 24px 24px;

        h1 {
          font-size: 32px;
          font-weight: 700;
        }
        p {
          font-size: 16px;
          opacity: 0.9;
          margin-top: 4px;
        }
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
        a {
          font-size: 14px;
          color: var(--primary);
        }
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
        a {
          color: var(--primary);
          font-weight: 500;
        }
      }

      input.invalid {
        border-color: var(--error);
      }
    `,
  ],
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
        this.loginError =
          err.error?.message || err.error?.Message || 'Invalid username or password';
      },
    });
  }
}
