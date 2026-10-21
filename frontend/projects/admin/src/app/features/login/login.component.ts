import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent, CardComponent, IconComponent } from 'components';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IconComponent, ButtonComponent, CardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  submitted = false;
  loading = false;
  loginError = '';

  get f() {
    return this.loginForm.controls;
  }

  get usernameInvalid(): boolean {
    return this.submitted && !!this.f['username'].errors;
  }

  get passwordInvalid(): boolean {
    return this.submitted && !!this.f['password'].errors;
  }

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
      },
    });
  }
}
