import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BottomTabBarComponent } from '../../shared/components/bottom-tab-bar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BottomTabBarComponent],
  template: `
    <div class="login-page">
      <div class="login-header" data-testid="login-hero-panel">
        <div class="header-content">
          <span class="material-icons header-icon" data-testid="login-hero-icon">apartment</span>
          <h1 data-testid="login-hero-title">Coop Management</h1>
          <p data-testid="login-hero-description">Cooperative management</p>
        </div>
      </div>

      <div class="login-form-panel" data-testid="login-form-panel">
        <div class="form-container">
          <h2 data-testid="login-heading">Welcome back</h2>
          <p class="form-subtitle" data-testid="login-subtitle">Sign in to your account</p>

          <div *ngIf="loginError" class="alert alert-danger" data-testid="login-form-error">
            {{ loginError }}
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                id="username"
                type="text"
                formControlName="username"
                data-testid="login-username"
                placeholder="Enter your username"
                [class.invalid]="submitted && f['username'].errors"
              />
              <div *ngIf="submitted && f['username'].errors" class="error-message" data-testid="login-username-error">
                Username is required
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                data-testid="login-password"
                placeholder="Enter your password"
                [class.invalid]="submitted && f['password'].errors"
              />
              <div *ngIf="submitted && f['password'].errors" class="error-message" data-testid="login-password-error">
                Password is required
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="rememberMe" data-testid="login-remember-me" />
                <span>Remember me</span>
              </label>
              <a routerLink="/forgot-password" class="forgot-link" data-testid="login-forgot-password">Forgot password?</a>
            </div>

            <button type="submit" class="btn btn-primary btn-block sign-in-btn" data-testid="login-submit" [disabled]="loading">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <p class="sign-up-text">
            Don't have an account?
            <a routerLink="/register" data-testid="login-signup-link">Sign up</a>
          </p>
        </div>
      </div>

      <app-bottom-tab-bar class="mobile-only"></app-bottom-tab-bar>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex; min-height: 100vh;
    }
    .login-header {
      flex: 1; background: linear-gradient(135deg, #3D8A5A 0%, #2D6B44 100%);
      display: flex; align-items: center; justify-content: center;
      color: #fff; padding: 40px;
    }
    .header-content {
      text-align: center;
      .material-icons.header-icon { font-size: 64px; margin-bottom: 16px; }
      h1 { font-size: 36px; font-weight: 700; margin-bottom: 8px; }
      p { font-size: 18px; opacity: 0.9; }
    }
    .login-form-panel {
      flex: 1; display: flex; align-items: center; justify-content: center;
      background: #fff; padding: 40px;
    }
    .form-container {
      width: 100%; max-width: 400px;
      h2 { font-size: 28px; font-weight: 600; margin-bottom: 8px; }
      .form-subtitle { color: #1A1918CC; margin-bottom: 24px; }
    }
    .form-group {
      margin-bottom: 20px;
      label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #1A1918CC; }
      input[type="text"], input[type="password"] {
        width: 100%; padding: 12px 14px; border: 1px solid #E5E4E1; border-radius: 10px;
        font-size: 14px; transition: border-color 0.2s;
        &:focus { outline: none; border-color: #3D8A5A; box-shadow: 0 0 0 3px rgba(61,138,90,0.1); }
        &.invalid { border-color: #DC3545; }
      }
      .error-message { color: #DC3545; font-size: 12px; margin-top: 4px; }
    }
    .form-options {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
    }
    .checkbox-label {
      display: flex; align-items: center; gap: 6px; font-size: 14px; cursor: pointer;
      input { cursor: pointer; }
    }
    .forgot-link { font-size: 14px; color: #3D8A5A; text-decoration: none; }
    .sign-in-btn {
      width: 100%; padding: 12px; font-size: 16px; font-weight: 600; border-radius: 12px;
    }
    .sign-up-text {
      text-align: center; margin-top: 24px; font-size: 14px; color: #1A1918CC;
      a { color: #3D8A5A; font-weight: 500; }
    }
    .alert-danger {
      background: rgba(220,53,69,0.1); color: #DC3545; padding: 10px 14px;
      border-radius: 8px; font-size: 14px; margin-bottom: 16px;
    }
    .mobile-only { display: none; }
    @media (max-width: 768px) {
      .login-page { flex-direction: column; }
      .login-header { flex: none; padding: 40px 20px; }
      .login-form-panel { padding: 24px; padding-bottom: 80px; }
      .mobile-only { display: block; }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  submitted = false;
  loading = false;
  loginError = '';

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = '';
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.loginError = err.error?.message || err.error?.title || 'Invalid username or password';
      }
    });
  }
}
