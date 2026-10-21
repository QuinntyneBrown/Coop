import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  AlertBodyComponent,
  AlertComponent,
  ButtonComponent,
  CardComponent,
  CheckboxComponent,
  CheckboxTextComponent,
  FieldErrorComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  LogoMarkComponent,
  TextFieldComponent,
} from 'components';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IconComponent,
    ButtonComponent,
    CardComponent,
    AlertBodyComponent,
    AlertComponent,
    CheckboxComponent,
    CheckboxTextComponent,
    FieldErrorComponent,
    FieldLabelComponent,
    FormFieldComponent,
    TextFieldComponent,
    LogoMarkComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group(
    {
      invitationToken: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue],
    },
    { validators: this.passwordMatchValidator },
  );

  submitted = false;
  loading = false;
  registrationError = '';

  get f() {
    return this.registerForm.controls;
  }

  invalid(name: string): boolean {
    return this.submitted && !!this.f[name].errors;
  }

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
          error: () => this.router.navigate(['/login']),
        });
      },
      error: (err) => {
        this.loading = false;
        this.registrationError =
          err.error?.message ||
          err.error?.title ||
          'Registration failed. Please check your invitation token.';
      },
    });
  }
}
