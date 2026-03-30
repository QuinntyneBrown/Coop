import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="header">
      <h1>Coop</h1>
      <p>Password Recovery</p>
    </div>
    <div class="body">
      <h2>Reset your password</h2>
      <p class="hint">Enter your username or email and we'll send you a link to reset your password.</p>
      <div class="form-group">
        <label for="email">Username or Email</label>
        <input id="email" type="text" [(ngModel)]="email" name="email" placeholder="Enter your username or email" />
      </div>
      <button class="btn btn-primary btn-full" (click)="onSubmit()">Send Reset Link</button>
      <div class="back-row">
        <a routerLink="/login">Back to Sign In</a>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; background: var(--background); }
    .header {
      background: linear-gradient(135deg, var(--primary) 0%, #2D6B44 100%);
      color: white; padding: 48px 24px 40px; text-align: center; border-radius: 0 0 24px 24px;
      h1 { font-size: 32px; font-weight: 700; }
      p { font-size: 16px; opacity: 0.9; margin-top: 4px; }
    }
    .body { flex: 1; padding: 32px 24px; max-width: 400px; width: 100%; margin: 0 auto; }
    h2 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
    .hint { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }
    .back-row { text-align: center; margin-top: 20px; font-size: 14px; }
  `],
})
export class ForgotPasswordComponent {
  email = '';
  onSubmit() {
    // stub
  }
}
