import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="forgot-page">
      <div class="forgot-card card">
        <span class="material-icons lock-icon">lock_reset</span>
        <h2>Forgot Password</h2>
        <p>Enter your username and we'll help you reset your password.</p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" type="text" formControlName="username" placeholder="Enter your username" data-testid="forgot-username" />
          </div>
          <button type="submit" class="btn btn-primary btn-block" data-testid="forgot-submit-btn">Reset Password</button>
        </form>
        <p class="back-link"><a routerLink="/login">Back to Sign In</a></p>
      </div>
    </div>
  `,
  styles: [`
    .forgot-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #F5F4F1; padding: 20px;
    }
    .forgot-card {
      width: 100%; max-width: 440px; padding: 40px; text-align: center;
      h2 { font-size: 24px; margin-bottom: 8px; }
      p { color: #1A1918CC; margin-bottom: 24px; font-size: 14px; }
    }
    .lock-icon { font-size: 48px; color: #3D8A5A; margin-bottom: 16px; }
    .form-group {
      margin-bottom: 20px; text-align: left;
      label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; }
      input { width: 100%; padding: 12px 14px; border: 1px solid #E5E4E1; border-radius: 10px; font-size: 14px;
        &:focus { outline: none; border-color: #3D8A5A; }
      }
    }
    .btn-block { width: 100%; padding: 12px; font-size: 16px; border-radius: 12px; }
    .back-link { margin-top: 16px; font-size: 14px; }
  `]
})
export class ForgotPasswordComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({ username: ['', Validators.required] });
  }

  onSubmit(): void {
    // Placeholder - API may not support this
  }
}
