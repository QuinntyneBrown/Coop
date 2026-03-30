import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="onboarding-page">
      <div class="onboarding-card card">
        <div class="step-indicator" data-testid="onboarding-step-indicator">
          <div *ngFor="let s of [1,2,3]" class="step-dot" [class.active]="step >= s" [class.current]="step === s"></div>
        </div>
        <div data-testid="onboarding-current-step">Step {{ step }} of 3</div>

        <!-- Welcome Step -->
        <div *ngIf="step === 1" class="step-content">
          <h2 data-testid="onboarding-welcome-title">Welcome to Your Cooperative!</h2>
          <p data-testid="onboarding-welcome-message">Let's get your profile set up so you can start managing your cooperative community.</p>
          <button class="btn btn-primary" data-testid="onboarding-get-started-btn" (click)="nextStep()">Get Started</button>
        </div>

        <!-- Profile Step -->
        <div *ngIf="step === 2" class="step-content" data-testid="onboarding-profile-section">
          <h2>Set Up Your Profile</h2>
          <form [formGroup]="profileForm">
            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" formControlName="firstName" data-testid="onboarding-first-name" />
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" formControlName="lastName" data-testid="onboarding-last-name" />
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" data-testid="onboarding-email" />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="text" formControlName="phone" data-testid="onboarding-phone" />
            </div>
            <div class="form-group">
              <label>Avatar</label>
              <input type="file" data-testid="onboarding-avatar-upload" accept="image/*" />
            </div>
          </form>
          <div class="btn-row">
            <button class="btn btn-secondary" data-testid="onboarding-back-btn" (click)="prevStep()">Back</button>
            <button class="btn btn-secondary" data-testid="onboarding-skip-btn" (click)="nextStep()">Skip</button>
            <button class="btn btn-primary" data-testid="onboarding-next-btn" (click)="nextStep()">Next</button>
          </div>
        </div>

        <!-- Unit/Confirmation Step -->
        <div *ngIf="step === 3" class="step-content" data-testid="onboarding-confirmation">
          <div data-testid="onboarding-unit-section">
            <h2>Select Your Unit</h2>
            <div class="unit-options" data-testid="onboarding-unit-selector">
              <div *ngFor="let unit of units; let i = index"
                class="unit-option" [class.selected]="selectedUnit === i"
                (click)="selectUnit(i)" data-testid="onboarding-unit-option">
                {{ unit }}
              </div>
            </div>
          </div>
          <p data-testid="onboarding-confirmation-message">You're all set! Click below to go to your dashboard.</p>
          <div class="btn-row">
            <button class="btn btn-secondary" data-testid="onboarding-back-btn" (click)="prevStep()">Back</button>
            <button class="btn btn-primary" data-testid="onboarding-go-to-dashboard-btn" (click)="finish()">Go to Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #F5F4F1; padding: 20px;
    }
    .onboarding-card { width: 100%; max-width: 560px; padding: 40px; text-align: center; }
    .step-indicator { display: flex; gap: 8px; justify-content: center; margin-bottom: 12px; }
    .step-dot {
      width: 10px; height: 10px; border-radius: 50%; background: #E5E4E1;
      &.active { background: #3D8A5A; }
      &.current { box-shadow: 0 0 0 3px rgba(61,138,90,0.2); }
    }
    .step-content { margin-top: 24px;
      h2 { font-size: 22px; margin-bottom: 12px; }
      p { color: #1A1918CC; margin-bottom: 20px; }
    }
    .form-row { display: flex; gap: 12px; }
    .form-group {
      margin-bottom: 16px; text-align: left; flex: 1;
      label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; }
      input { width: 100%; padding: 10px 14px; border: 1px solid #E5E4E1; border-radius: 8px; font-size: 14px;
        &:focus { outline: none; border-color: #3D8A5A; }
      }
    }
    .btn-row { display: flex; gap: 12px; justify-content: center; margin-top: 24px; }
    .unit-options { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 16px 0; }
    .unit-option {
      padding: 10px 20px; border: 1px solid #E5E4E1; border-radius: 10px; cursor: pointer;
      &.selected { background: #3D8A5A; color: #fff; border-color: #3D8A5A; }
      &:hover { border-color: #3D8A5A; }
    }
  `]
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
    phone: ['']
  });

  nextStep(): void { if (this.step < 3) this.step++; }
  prevStep(): void { if (this.step > 1) this.step--; }
  selectUnit(i: number): void { this.selectedUnit = i; }

  finish(): void {
    if (this.profileForm.valid) {
      this.profileService.createProfile(this.profileForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => this.router.navigate(['/dashboard'])
      });
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
