import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Green header -->
    <div class="register-header" data-testid="register-header">
      <h1 data-testid="register-header-title">Coop</h1>
      <p data-testid="register-header-subtitle">Join your cooperative</p>
    </div>

    <div class="register-body">
      <h2 class="heading" data-testid="register-heading">Create account</h2>

      <form (ngSubmit)="onSubmit()" novalidate>
        <div class="form-group">
          <label for="token">Invitation Token</label>
          <input
            id="token"
            type="text"
            data-testid="register-invitation-token"
            [(ngModel)]="token"
            name="token"
            placeholder="Enter your invitation token"
            [class.invalid]="submitted && !token"
          />
          <div class="error-message" *ngIf="submitted && !token" data-testid="register-token-error">
            Invitation token is required
          </div>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            data-testid="register-username"
            [(ngModel)]="username"
            name="username"
            placeholder="Choose a username"
            [class.invalid]="submitted && !username"
          />
          <div class="error-message" *ngIf="submitted && !username" data-testid="register-username-error">
            Username is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            data-testid="register-password"
            [(ngModel)]="password"
            name="password"
            placeholder="Create a password"
            [class.invalid]="submitted && !password"
          />
          <div class="error-message" *ngIf="submitted && !password" data-testid="register-password-error">
            Password is required
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            data-testid="register-confirm-password"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            [class.invalid]="submitted && passwordMismatch"
          />
          <div class="error-message" *ngIf="submitted && passwordMismatch" data-testid="register-confirm-password-error">
            Passwords do not match
          </div>
        </div>

        <div class="terms-row">
          <input
            type="checkbox"
            id="terms"
            data-testid="register-terms-checkbox"
            [(ngModel)]="acceptTerms"
            name="acceptTerms"
          />
          <label for="terms" data-testid="register-terms-label">I agree to the Terms and Conditions</label>
        </div>
        <div class="error-message" *ngIf="submitted && !acceptTerms" data-testid="register-terms-error">
          You must accept the terms
        </div>

        <div class="error-message register-error" *ngIf="registrationError" data-testid="register-error">
          {{ registrationError }}
        </div>

        <button type="submit" class="btn btn-primary btn-full create-btn" data-testid="register-create-account-btn" [disabled]="loading">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <div class="sign-in-row">
        Already have an account?
        <a routerLink="/login" data-testid="register-sign-in-link">Sign in</a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--background);
    }

    .register-header {
      background: linear-gradient(135deg, var(--primary) 0%, #2D6B44 100%);
      color: white;
      padding: 40px 24px 32px;
      text-align: center;
      border-radius: 0 0 24px 24px;

      h1 { font-size: 32px; font-weight: 700; }
      p { font-size: 16px; opacity: 0.9; margin-top: 4px; }
    }

    .register-body {
      flex: 1;
      padding: 24px 24px 80px;
      max-width: 400px;
      width: 100%;
      margin: 0 auto;
    }

    .heading {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .terms-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary);
      }

      label {
        font-size: 14px;
        color: var(--text-secondary);
        cursor: pointer;
      }
    }

    .register-error {
      margin: 12px 0;
      padding: 10px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: var(--radius-sm);
      text-align: center;
    }

    .create-btn {
      margin-top: 16px;
      height: 48px;
    }

    .sign-in-row {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: var(--text-secondary);
      a { color: var(--primary); font-weight: 500; }
    }

    input.invalid {
      border-color: var(--error);
    }
  `],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  token = '';
  username = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;
  submitted = false;
  loading = false;
  registrationError = '';

  get passwordMismatch(): boolean {
    return this.password !== this.confirmPassword && !!this.confirmPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.registrationError = '';

    if (!this.token || !this.username || !this.password || this.passwordMismatch || !this.acceptTerms) {
      return;
    }

    this.loading = true;
    this.authService.register({
      invitationToken: this.token,
      username: this.username,
      password: this.password,
    }).subscribe({
      next: () => {
        this.router.navigate(['/onboarding']);
      },
      error: (err) => {
        this.loading = false;
        this.registrationError = err.error?.message || err.error?.Message || 'Registration failed. Please check your invitation token.';
      },
    });
  }
}
