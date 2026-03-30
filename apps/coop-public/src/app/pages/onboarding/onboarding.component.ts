import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { UserService } from '../../core/services/user.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="onboarding-container">
      <!-- Step Indicator -->
      <div class="step-indicator" data-testid="onboarding-step-indicator">
        <div class="step-dots">
          <span *ngFor="let s of steps; let i = index"
            class="step-dot"
            [class.active]="i === currentStep"
            [class.completed]="i < currentStep"
          ></span>
        </div>
        <span class="step-label" data-testid="onboarding-current-step">Step {{ currentStep + 1 }} of {{ steps.length }}</span>
      </div>

      <!-- Step 1: Welcome -->
      <div *ngIf="currentStep === 0" class="step-content">
        <div class="welcome-step">
          <div class="welcome-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h1 data-testid="onboarding-welcome-title">Welcome to Coop!</h1>
          <p data-testid="onboarding-welcome-message">
            Let's set up your profile so you can start using your cooperative's management platform.
            This will only take a few minutes.
          </p>
          <button class="btn btn-primary btn-full" data-testid="onboarding-get-started-btn" (click)="nextStep()">
            Get Started
          </button>
        </div>
      </div>

      <!-- Step 2: Profile Setup -->
      <div *ngIf="currentStep === 1" class="step-content" data-testid="onboarding-profile-section">
        <h2>Set up your profile</h2>
        <p class="step-desc">Tell us a little about yourself.</p>

        <div class="form-group">
          <label for="firstName">First Name</label>
          <input id="firstName" type="text" data-testid="onboarding-first-name" [(ngModel)]="profileData.firstName" name="firstName" placeholder="First name" />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input id="lastName" type="text" data-testid="onboarding-last-name" [(ngModel)]="profileData.lastName" name="lastName" placeholder="Last name" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" data-testid="onboarding-email" [(ngModel)]="profileData.email" name="email" placeholder="your@email.com" />
        </div>

        <div class="form-group">
          <label for="phone">Phone (optional)</label>
          <input id="phone" type="tel" data-testid="onboarding-phone" [(ngModel)]="profileData.phone" name="phone" placeholder="555-0100" />
        </div>

        <div class="avatar-upload" data-testid="onboarding-avatar-upload">
          <label>Profile Photo (optional)</label>
          <div class="upload-area">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Upload photo</span>
            <input type="file" accept="image/*" (change)="onAvatarSelect($event)" />
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-outline" data-testid="onboarding-back-btn" (click)="prevStep()">Back</button>
          <button class="btn btn-primary" data-testid="onboarding-next-btn" (click)="nextStep()">Next</button>
          <button class="btn btn-outline skip-btn" data-testid="onboarding-skip-btn" (click)="skipToConfirmation()">Skip</button>
        </div>
      </div>

      <!-- Step 3: Unit Selection -->
      <div *ngIf="currentStep === 2" class="step-content" data-testid="onboarding-unit-section">
        <h2>Select your unit</h2>
        <p class="step-desc">Choose the unit you're associated with.</p>

        <div class="unit-selector" data-testid="onboarding-unit-selector">
          <div
            *ngFor="let unit of units; let i = index"
            class="unit-option card"
            [class.selected]="selectedUnit === i"
            data-testid="onboarding-unit-option"
            (click)="selectUnit(i)"
          >
            <span class="unit-name">{{ unit.name || unit.number || 'Unit ' + (i + 1) }}</span>
            <span class="unit-number" *ngIf="unit.number">{{ unit.number }}</span>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-outline" data-testid="onboarding-back-btn" (click)="prevStep()">Back</button>
          <button class="btn btn-primary" data-testid="onboarding-next-btn" (click)="nextStep()">Next</button>
        </div>
      </div>

      <!-- Step 4: Confirmation -->
      <div *ngIf="currentStep === 3" class="step-content" data-testid="onboarding-confirmation">
        <div class="confirmation-step">
          <div class="confirmation-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 data-testid="onboarding-confirmation-message">You're all set!</h2>
          <p>Your profile has been set up successfully. You can now access all features of your cooperative.</p>
          <button class="btn btn-primary btn-full" data-testid="onboarding-go-to-dashboard-btn" (click)="goToDashboard()">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-container {
      max-width: 480px;
      margin: 0 auto;
      padding: 24px 16px;
      min-height: calc(100vh - 120px);
    }

    .step-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 32px;
    }

    .step-dots {
      display: flex;
      gap: 8px;
    }

    .step-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--border);
      transition: all 0.3s;

      &.active { background: var(--primary); transform: scale(1.2); }
      &.completed { background: var(--primary); opacity: 0.5; }
    }

    .step-label {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .step-content {
      h2 { font-size: 22px; font-weight: 600; margin-bottom: 8px; }
      .step-desc { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }
    }

    .welcome-step, .confirmation-step {
      text-align: center;
      padding: 40px 0;

      h1, h2 { font-size: 26px; margin: 16px 0 12px; }
      p { color: var(--text-secondary); font-size: 15px; line-height: 1.6; margin-bottom: 32px; }
    }

    .welcome-icon, .confirmation-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .avatar-upload {
      margin-bottom: 24px;

      label { display: block; font-size: 14px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px; }

      .upload-area {
        border: 2px dashed var(--border);
        border-radius: var(--radius-md);
        padding: 24px;
        text-align: center;
        cursor: pointer;
        position: relative;

        &:hover { border-color: var(--primary); }

        span { display: block; margin-top: 8px; font-size: 14px; color: var(--text-secondary); }

        input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }
      }
    }

    .unit-selector {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 24px;
    }

    .unit-option {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;

      &:hover { border-color: var(--primary); }
      &.selected { border-color: var(--primary); background: var(--primary-light); }

      .unit-name { font-weight: 500; }
      .unit-number { font-size: 13px; color: var(--text-secondary); }
    }

    .step-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;

      .btn { flex: 1; }
      .skip-btn { flex: 0; white-space: nowrap; }
    }
  `],
})
export class OnboardingComponent implements OnInit {
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private userService = inject(UserService);

  steps = ['welcome', 'profile', 'unit', 'confirmation'];
  currentStep = 0;
  profileData = { firstName: '', lastName: '', email: '', phone: '' };
  units: { id: string; name: string; number: string }[] = [];
  selectedUnit = -1;

  ngOnInit() {
    this.profileService.getUnits().pipe(
      catchError(() => of([
        { id: '1', name: 'Unit 101', number: '101' },
        { id: '2', name: 'Unit 102', number: '102' },
        { id: '3', name: 'Unit 103', number: '103' },
      ])),
    ).subscribe(units => {
      this.units = units;
    });
  }

  nextStep() {
    if (this.currentStep === 1) {
      // Save profile data
      this.userService.updateProfile(this.profileData).pipe(
        catchError(() => of(null)),
      ).subscribe();
    }

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  selectUnit(index: number) {
    this.selectedUnit = index;
  }

  skipToConfirmation() {
    this.currentStep = this.steps.length - 1;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onAvatarSelect(event: Event) {
    // Avatar upload stub
  }
}
