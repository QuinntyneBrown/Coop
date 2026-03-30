import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-page">
      <div class="register-header" data-testid="register-hero-panel">
        <div class="header-content">
          <span class="material-icons header-icon">apartment</span>
          <h1 data-testid="register-hero-title">Join Your Cooperative</h1>
          <p>Join your cooperative</p>
        </div>
      </div>

      <div class="register-form-panel">
        <div class="form-container">
          <h2 data-testid="register-heading">Create account</h2>
          <p class="form-subtitle" data-testid="register-subtitle">Enter your invitation token and details to create your account</p>

          <div *ngIf="registrationError" class="alert alert-danger" data-testid="register-form-error">
            {{ registrationError }}
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="invitationToken">Invitation Token</label>
              <input id="invitationToken" type="text" formControlName="invitationToken"
                data-testid="register-invitation-token" placeholder="Enter your invitation token"
                [class.invalid]="submitted && f['invitationToken'].errors" />
              <div *ngIf="submitted && f['invitationToken'].errors" class="error-message" data-testid="register-token-error">
                Invitation token is required
              </div>
            </div>

            <div class="form-group">
              <label for="username">Username</label>
              <input id="username" type="text" formControlName="username"
                data-testid="register-username" placeholder="Choose a username"
                [class.invalid]="submitted && f['username'].errors" />
              <div *ngIf="submitted && f['username'].errors" class="error-message" data-testid="register-username-error">
                Username is required
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input id="password" type="password" formControlName="password"
                data-testid="register-password" placeholder="Create a password"
                [class.invalid]="submitted && f['password'].errors" />
              <div *ngIf="submitted && f['password'].errors" class="error-message" data-testid="register-password-error">
                Password is required
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" formControlName="confirmPassword"
                data-testid="register-confirm-password" placeholder="Confirm your password"
                [class.invalid]="submitted && f['confirmPassword'].errors" />
              <div *ngIf="submitted && f['confirmPassword'].errors?.['required']" class="error-message" data-testid="register-confirm-password-error">
                Please confirm your password
              </div>
              <div *ngIf="submitted && f['confirmPassword'].errors?.['passwordMismatch']" class="error-message" data-testid="register-confirm-password-error">
                Passwords do not match
              </div>
            </div>

            <div class="form-group terms-group">
              <label class="checkbox-label" data-testid="register-terms-label">
                <input type="checkbox" formControlName="termsAccepted" data-testid="register-terms" />
                <span>I agree to the Terms and Conditions</span>
              </label>
              <div *ngIf="submitted && f['termsAccepted'].errors" class="error-message" data-testid="register-terms-error">
                You must accept the terms and conditions
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" data-testid="register-submit" [disabled]="loading">
              {{ loading ? 'Creating...' : 'Create Account' }}
            </button>
          </form>

          <p class="sign-in-text">
            Already have an account?
            <a routerLink="/login" data-testid="register-signin-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page { display: flex; min-height: 100vh; }
    .register-header {
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
    .register-form-panel {
      flex: 1; display: flex; align-items: center; justify-content: center;
      background: #fff; padding: 40px; overflow-y: auto;
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
        &:focus { outline: none; border-color: #3D8A5A; }
        &.invalid { border-color: #DC3545; }
      }
      .error-message { color: #DC3545; font-size: 12px; margin-top: 4px; }
    }
    .checkbox-label {
      display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer;
      input { cursor: pointer; }
    }
    .btn-block { width: 100%; padding: 12px; font-size: 16px; font-weight: 600; border-radius: 12px; }
    .sign-in-text {
      text-align: center; margin-top: 24px; font-size: 14px; color: #1A1918CC;
      a { color: #3D8A5A; font-weight: 500; }
    }
    .alert-danger {
      background: rgba(220,53,69,0.1); color: #DC3545; padding: 10px 14px;
      border-radius: 8px; font-size: 14px; margin-bottom: 16px;
    }
    @media (max-width: 768px) {
      .register-page { flex-direction: column; }
      .register-header { flex: none; padding: 40px 20px; }
      .register-form-panel { padding: 24px; }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    invitationToken: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    termsAccepted: [false, Validators.requiredTrue]
  }, { validators: this.passwordMatchValidator });

  submitted = false;
  loading = false;
  registrationError = '';

  get f() { return this.registerForm.controls; }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.registrationError = '';
    if (this.registerForm.invalid) return;

    this.loading = true;
    const { invitationToken, username, password } = this.registerForm.value;
    this.authService.register({ username, password, invitationToken }).subscribe({
      next: () => {
        // Auto-login after registration
        this.authService.login(username, password).subscribe({
          next: () => this.router.navigate(['/onboarding']),
          error: () => this.router.navigate(['/login'])
        });
      },
      error: (err) => {
        this.loading = false;
        this.registrationError = err.error?.message || err.error?.title || 'Registration failed. Please check your invitation token.';
      }
    });
  }
}
