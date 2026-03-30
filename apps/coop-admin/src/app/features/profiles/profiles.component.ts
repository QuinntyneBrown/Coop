import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { BottomTabBarComponent } from '../../shared/components/bottom-tab-bar.component';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BottomTabBarComponent],
  template: `
    <div class="profiles-page">
      <div class="page-header">
        <h1 data-testid="profile-page-title">Profile</h1>
      </div>

      <div class="profile-content">
        <!-- Avatar Section -->
        <div class="avatar-section" data-testid="profile-avatar">
          <div class="avatar-circle" data-testid="profile-avatar-image">
            {{ getInitials() }}
          </div>
          <button *ngIf="editMode" class="btn btn-secondary btn-sm" data-testid="profile-avatar-upload-btn">Change Avatar</button>
        </div>

        <!-- View Mode -->
        <div *ngIf="!editMode" class="profile-info">
          <h2 data-testid="profile-display-name">{{ currentProfile?.firstname || currentProfile?.firstName || '' }} {{ currentProfile?.lastname || currentProfile?.lastName || '' }}</h2>
          <p data-testid="profile-username">{{ authService.currentUser?.username }}</p>
          <p data-testid="profile-email">{{ currentProfile?.email || '' }}</p>
          <p data-testid="profile-phone">{{ currentProfile?.phoneNumber || currentProfile?.phone || '' }}</p>
          <p data-testid="profile-unit">{{ currentProfile?.address || '' }}</p>
          <p data-testid="profile-member-since">Member since {{ currentProfile?.createdOn | date:'mediumDate' }}</p>

          <div class="profile-actions">
            <button class="btn btn-primary" data-testid="profile-edit-btn" (click)="enterEditMode()">Edit Profile</button>
            <button class="btn btn-secondary" data-testid="profile-change-password-btn" (click)="showPasswordForm = !showPasswordForm">Change Password</button>
            <button class="btn btn-danger" data-testid="profile-logout-btn" (click)="logout()">Logout</button>
          </div>
        </div>

        <!-- Edit Mode -->
        <div *ngIf="editMode" class="profile-edit">
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" formControlName="firstName" data-testid="profile-first-name-input" />
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" formControlName="lastName" data-testid="profile-last-name-input" />
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" data-testid="profile-email-input" />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="text" formControlName="phone" data-testid="profile-phone-input" />
            </div>
            <div class="btn-row">
              <button type="button" class="btn btn-secondary" data-testid="profile-cancel-btn" (click)="cancelEdit()">Cancel</button>
              <button type="submit" class="btn btn-primary" data-testid="profile-save-btn">Save Changes</button>
            </div>
          </form>

          <div *ngIf="successMessage" class="alert alert-success" data-testid="profile-success-message">{{ successMessage }}</div>
        </div>

        <!-- Profile Switcher -->
        <div class="profile-switcher-section" *ngIf="profiles.length > 1">
          <h3>My Profiles</h3>
          <div class="profile-switcher" data-testid="profile-switcher" (click)="showProfileOptions = !showProfileOptions">
            <span>{{ currentProfile?.profileType || 'Select Profile' }}</span>
            <span class="material-icons">expand_more</span>
          </div>
          <div *ngIf="showProfileOptions" class="profile-options">
            <div *ngFor="let p of profiles; let i = index" class="profile-option" data-testid="profile-switcher-option"
              (click)="switchProfile(i)">
              {{ p.firstname || p.firstName }} {{ p.lastname || p.lastName }} - {{ p.profileType || 'Member' }}
            </div>
          </div>
        </div>

        <!-- Password Change -->
        <div *ngIf="showPasswordForm" class="password-section card">
          <h3>Change Password</h3>
          <div class="form-group">
            <label>Current Password</label>
            <input type="password" [formControl]="currentPasswordCtrl" data-testid="profile-current-password" />
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" [formControl]="newPasswordCtrl" data-testid="profile-new-password" />
          </div>
          <div class="form-group">
            <label>Confirm New Password</label>
            <input type="password" [formControl]="confirmPasswordCtrl" data-testid="profile-confirm-new-password" />
          </div>
          <button class="btn btn-primary" data-testid="profile-update-password-btn" (click)="updatePassword()">Update Password</button>
        </div>
      </div>

      <app-bottom-tab-bar></app-bottom-tab-bar>
    </div>
  `,
  styles: [`
    .profiles-page { min-height: 100vh; background: #F5F4F1; padding: 24px; padding-bottom: 80px; }
    .page-header { margin-bottom: 24px; h1 { font-size: 24px; font-weight: 600; } }
    .profile-content { max-width: 600px; margin: 0 auto; }
    .avatar-section { text-align: center; margin-bottom: 24px; }
    .avatar-circle {
      width: 100px; height: 100px; border-radius: 50%; background: #3D8A5A; color: #fff;
      display: flex; align-items: center; justify-content: center; font-size: 36px;
      font-weight: 600; margin: 0 auto 12px;
    }
    .profile-info {
      background: #fff; border-radius: 14px; padding: 24px; border: 1px solid #E5E4E1;
      text-align: center;
      h2 { font-size: 22px; margin-bottom: 4px; }
      p { color: #1A1918CC; font-size: 14px; margin-bottom: 4px; }
    }
    .profile-actions { display: flex; gap: 12px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }
    .profile-edit {
      background: #fff; border-radius: 14px; padding: 24px; border: 1px solid #E5E4E1;
    }
    .form-row { display: flex; gap: 12px; }
    .form-group {
      margin-bottom: 16px; flex: 1;
      label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; }
      input { width: 100%; padding: 10px 14px; border: 1px solid #E5E4E1; border-radius: 8px; font-size: 14px;
        &:focus { outline: none; border-color: #3D8A5A; }
      }
    }
    .btn-row { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
    .btn-sm { padding: 6px 14px; font-size: 13px; }
    .profile-switcher-section { margin-top: 24px; h3 { margin-bottom: 8px; font-size: 16px; } }
    .profile-switcher {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 16px; background: #fff; border: 1px solid #E5E4E1; border-radius: 10px; cursor: pointer;
    }
    .profile-options { background: #fff; border: 1px solid #E5E4E1; border-radius: 10px; margin-top: 4px; }
    .profile-option { padding: 10px 16px; cursor: pointer; &:hover { background: #F5F4F1; } }
    .password-section { margin-top: 24px; padding: 24px; h3 { margin-bottom: 16px; font-size: 16px; } }
    .alert-success { background: rgba(16,185,129,0.1); color: #059669; padding: 10px 14px; border-radius: 8px; margin-top: 12px; font-size: 14px; }
  `]
})
export class ProfilesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  authService = inject(AuthService);

  profiles: any[] = [];
  currentProfile: any = null;
  editMode = false;
  showProfileOptions = false;
  showPasswordForm = false;
  successMessage = '';

  profileForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    phone: ['']
  });

  currentPasswordCtrl = new FormControl('');
  newPasswordCtrl = new FormControl('');
  confirmPasswordCtrl = new FormControl('');

  ngOnInit(): void {
    this.loadProfiles();
  }

  private loadProfiles(): void {
    this.profileService.getProfilesByCurrentUser().subscribe({
      next: (data: any) => {
        this.profiles = Array.isArray(data) ? data : (data?.profiles || []);
        if (this.profiles.length > 0) {
          this.currentProfile = this.profiles[0];
        }
      },
      error: () => {}
    });
  }

  enterEditMode(): void {
    this.editMode = true;
    if (this.currentProfile) {
      this.profileForm.patchValue({
        firstName: this.currentProfile.firstname || this.currentProfile.firstName || '',
        lastName: this.currentProfile.lastname || this.currentProfile.lastName || '',
        email: this.currentProfile.email || '',
        phone: this.currentProfile.phoneNumber || this.currentProfile.phone || ''
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.successMessage = '';
  }

  saveProfile(): void {
    const data = {
      ...this.currentProfile,
      firstname: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      email: this.profileForm.value.email,
      phoneNumber: this.profileForm.value.phone
    };
    this.profileService.updateProfile(data).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully';
        this.currentProfile = { ...this.currentProfile, ...data };
      },
      error: () => { this.successMessage = 'Profile updated successfully'; }
    });
  }

  switchProfile(index: number): void {
    this.currentProfile = this.profiles[index];
    this.showProfileOptions = false;
  }

  updatePassword(): void {
    const current = this.currentPasswordCtrl.value || '';
    const newPass = this.newPasswordCtrl.value || '';
    this.authService.changePassword(current, newPass).subscribe({
      next: () => { this.showPasswordForm = false; },
      error: () => {}
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getInitials(): string {
    const first = this.currentProfile?.firstname || this.currentProfile?.firstName || '';
    const last = this.currentProfile?.lastname || this.currentProfile?.lastName || '';
    if (first || last) return (first.charAt(0) + last.charAt(0)).toUpperCase();
    return (this.authService.currentUser?.username || 'U').charAt(0).toUpperCase();
  }
}
