import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ButtonComponent,
  CardComponent,
  FieldLabelComponent,
  FormFieldComponent,
  TextFieldComponent,
} from 'components';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    FieldLabelComponent,
    FormFieldComponent,
    TextFieldComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
