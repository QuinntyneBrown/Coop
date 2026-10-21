import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent, IconComponent } from 'components';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IconComponent, ButtonComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmNewPassword: ['', Validators.required],
  });

  loading = false;
  submitted = false;
  successMsg = '';
  errorMsg = '';
  passwordMismatch = false;

  get currentInvalid(): boolean {
    return this.submitted && !!this.form.controls['currentPassword'].errors;
  }

  get newInvalid(): boolean {
    return this.submitted && !!this.form.controls['newPassword'].errors;
  }

  get confirmInvalid(): boolean {
    return (
      (this.submitted && !!this.form.controls['confirmNewPassword'].errors) || this.passwordMismatch
    );
  }

  onSubmit(): void {
    this.submitted = true;
    this.passwordMismatch = false;
    if (this.form.invalid) return;
    const { currentPassword, newPassword, confirmNewPassword } = this.form.value;
    if (newPassword !== confirmNewPassword) {
      this.passwordMismatch = true;
      this.errorMsg = '';
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
      },
    });
  }
}
