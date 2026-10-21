import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from 'components';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OnboardingComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private profileService = inject(ProfileService);

  step = 1;
  selectedUnit = -1;
  units = ['Unit 101', 'Unit 102', 'Unit 201', 'Unit 202', 'Unit 301'];

  profileForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [''],
    phone: [''],
  });

  nextStep(): void {
    if (this.step < 3) this.step++;
  }
  prevStep(): void {
    if (this.step > 1) this.step--;
  }
  selectUnit(i: number): void {
    this.selectedUnit = i;
  }

  finish(): void {
    if (this.profileForm.valid) {
      this.profileService.createProfile(this.profileForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => this.router.navigate(['/dashboard']),
      });
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
