import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="change-password-page">
      <div class="change-password-card card" data-testid="change-password-card">
        <span class="material-icons lock-icon" data-testid="change-password-icon">lock</span>
        <h2 data-testid="change-password-heading">Change Password</h2>
        <p class="subtitle" data-testid="change-password-subtitle">Enter your current password and choose a new one</p>

        <div *ngIf="successMsg" class="alert alert-success" data-testid="change-password-success">{{ successMsg }}</div>
        <div *ngIf="errorMsg" class="alert alert-danger" data-testid="change-password-form-error">{{ errorMsg }}</div>

        <p class="password-hint" data-testid="change-password-hint">Password must be at least 8 characters long</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Current Password</label>
            <input type="password" formControlName="currentPassword" data-testid="change-password-current" />
            <div *ngIf="submitted && form.controls['currentPassword'].errors" class="error-message" data-testid="change-password-current-error">Current password is required</div>
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" formControlName="newPassword" data-testid="change-password-new" />
            <div *ngIf="submitted && form.controls['newPassword'].errors" class="error-message" data-testid="change-password-new-error">
              {{ form.controls['newPassword'].errors?.['required'] ? 'New password is required' : 'Password must be at least 8 characters' }}
            </div>
          </div>
          <div class="form-group">
            <label>Confirm New Password</label>
            <input type="password" formControlName="confirmNewPassword" data-testid="change-password-confirm" />
            <div *ngIf="(submitted && form.controls['confirmNewPassword'].errors) || passwordMismatch" class="error-message" data-testid="change-password-confirm-error">
              {{ passwordMismatch ? 'Passwords do not match' : 'Please confirm your new password' }}
            </div>
          </div>
          <div class="btn-row">
            <a routerLink="/dashboard" class="btn btn-secondary" data-testid="change-password-cancel">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading" data-testid="change-password-submit">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .change-password-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #F5F4F1; padding: 20px;
    }
    .change-password-card {
      width: 100%; max-width: 440px; padding: 40px; text-align: center;
      h2 { font-size: 24px; margin-bottom: 8px; }
      .subtitle { color: #1A1918CC; margin-bottom: 24px; font-size: 14px; }
    }
    .lock-icon { font-size: 48px; color: #3D8A5A; margin-bottom: 16px; }
    .form-group {
      margin-bottom: 16px; text-align: left;
      label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; }
      input { width: 100%; padding: 12px 14px; border: 1px solid #E5E4E1; border-radius: 10px; font-size: 14px;
        &:focus { outline: none; border-color: #3D8A5A; }
      }
    }
    .btn-row { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
    .alert-success { background: rgba(16,185,129,0.1); color: #059669; padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; }
    .alert-danger { background: rgba(220,53,69,0.1); color: #DC3545; padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; }
  `]
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmNewPassword: ['', Validators.required]
  });

  loading = false;
  submitted = false;
  successMsg = '';
  errorMsg = '';
  passwordMismatch = false;

  onSubmit(): void {
    this.submitted = true;
    this.passwordMismatch = false;
    if (this.form.invalid) return;
    const { currentPassword, newPassword, confirmNewPassword } = this.form.value;
    if (newPassword !== confirmNewPassword) {
      this.passwordMismatch = true;
      this.errorMsg = 'Passwords do not match';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Password updated successfully';
        this.form.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Failed to update password';
      }
    });
  }
}
