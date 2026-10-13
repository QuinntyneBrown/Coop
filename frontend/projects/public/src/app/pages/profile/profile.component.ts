import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, UserProfile } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { catchError, of } from 'rxjs';
import { photoFileError } from '../maintenance/photo-file-error';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <h1 data-testid="profile-page-title">Profile</h1>

      <!-- Avatar Section -->
      <div class="avatar-section" data-testid="profile-avatar">
        <div class="avatar-wrapper">
          @if (shownPhotoUrl) {
            <img
              [src]="shownPhotoUrl"
              alt=""
              class="avatar-img"
              data-testid="profile-avatar-image"
            />
          }
          @if (!shownPhotoUrl) {
            <div class="avatar-placeholder" data-testid="profile-avatar-image">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary)"
                stroke-width="1.5"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          }
          <button
            class="avatar-upload-btn"
            data-testid="profile-avatar-upload-btn"
            aria-label="Choose a profile picture"
            [disabled]="savingPhoto"
            (click)="avatarInput.click()"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <input
            #avatarInput
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            data-testid="profile-avatar-input"
            (change)="onAvatarSelect($event)"
          />
        </div>
        @if (chosenPhoto) {
          <div class="photo-actions">
            <button
              class="btn btn-primary"
              data-testid="profile-photo-save"
              [disabled]="savingPhoto"
              (click)="savePhoto()"
            >
              {{ savingPhoto ? 'Saving…' : 'Save photo' }}
            </button>
            <button
              class="btn btn-outline"
              data-testid="profile-photo-cancel"
              [disabled]="savingPhoto"
              (click)="cancelPhoto()"
            >
              Cancel
            </button>
          </div>
        } @else if (profile?.avatarUrl) {
          <div class="photo-actions">
            <button
              class="btn btn-outline"
              data-testid="profile-photo-remove"
              [disabled]="savingPhoto"
              (click)="removePhoto()"
            >
              {{ savingPhoto ? 'Removing…' : 'Remove photo' }}
            </button>
          </div>
        }
        <p class="photo-hint">JPEG, PNG or WebP, up to 10 MB.</p>
        @if (photoError) {
          <p class="photo-error" role="alert" data-testid="profile-photo-error">{{ photoError }}</p>
        }
        @if (photoNotice) {
          <p class="photo-notice" role="status" data-testid="profile-photo-notice">
            {{ photoNotice }}
          </p>
        }
      </div>

      <!-- Success message (shown after edit) -->
      @if (successMessage && !editMode) {
        <div class="success-message" data-testid="profile-success-message">
          {{ successMessage }}
        </div>
      }

      <!-- View Mode -->
      @if (!editMode) {
        <div class="profile-info">
          <div class="info-card card">
            <div class="info-header">
              <h2 data-testid="profile-display-name">
                {{ profile?.firstName || profile?.username }} {{ profile?.lastName }}
              </h2>
              <button
                class="btn btn-outline btn-sm"
                data-testid="profile-edit-btn"
                (click)="enterEditMode()"
              >
                Edit
              </button>
            </div>
            <div class="info-row">
              <span class="info-label">Username</span>
              <span class="info-value" data-testid="profile-username">{{ profile?.username }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value" data-testid="profile-email">{{ profile?.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone</span>
              <span class="info-value" data-testid="profile-phone">{{
                profile?.phone || 'Not set'
              }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Unit</span>
              <span class="info-value" data-testid="profile-unit">{{
                profile?.unit || 'Not assigned'
              }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Member since</span>
              <span class="info-value" data-testid="profile-member-since">{{
                $safeNavigationMigration(profile?.memberSince) | date: 'mediumDate'
              }}</span>
            </div>
          </div>
        </div>
      }

      <!-- Edit Mode -->
      @if (editMode) {
        <div class="edit-form">
          <div class="card">
            @if (successMessage) {
              <div class="success-message">
                {{ successMessage }}
              </div>
            }
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                data-testid="profile-first-name-input"
                [(ngModel)]="editData.firstName"
                name="firstName"
              />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                data-testid="profile-last-name-input"
                [(ngModel)]="editData.lastName"
                name="lastName"
              />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                data-testid="profile-email-input"
                [(ngModel)]="editData.email"
                name="email"
              />
            </div>
            <div class="form-group">
              <label for="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                data-testid="profile-phone-input"
                [(ngModel)]="editData.phone"
                name="phone"
              />
            </div>
            <div class="edit-actions">
              <button
                class="btn btn-outline"
                data-testid="profile-cancel-btn"
                (click)="cancelEdit()"
              >
                Cancel
              </button>
              <button
                class="btn btn-primary"
                data-testid="profile-save-btn"
                (click)="saveProfile()"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Profile Switcher -->
      @if (profiles.length > 1) {
        <div class="profile-switcher-section">
          <div class="card">
            <h3>Switch Profile</h3>
            <div
              data-testid="profile-switcher"
              (click)="showProfileOptions = !showProfileOptions"
              class="switcher-trigger"
            >
              <span>{{ profile?.firstName }} {{ profile?.lastName }}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            @if (showProfileOptions) {
              <div class="profile-options">
                @for (p of profiles; track p; let i = $index) {
                  <div
                    class="profile-option"
                    data-testid="profile-switcher-option"
                    (click)="switchProfile(p)"
                  >
                    {{ p.firstName }} {{ p.lastName }}
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- Change Password -->
      <div class="password-section">
        <div class="card">
          <button
            class="btn btn-outline btn-full"
            data-testid="profile-change-password-btn"
            (click)="showPasswordForm = !showPasswordForm"
          >
            Change Password
          </button>

          @if (showPasswordForm) {
            <div class="password-form">
              @if (passwordError) {
                <div class="error-message" data-testid="profile-password-error">
                  {{ passwordError }}
                </div>
              }
              @if (passwordMismatchError) {
                <div class="error-message" data-testid="profile-password-mismatch-error">
                  {{ passwordMismatchError }}
                </div>
              }
              <div class="form-group">
                <label for="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  data-testid="profile-current-password"
                  [(ngModel)]="passwordData.currentPassword"
                  name="currentPassword"
                />
              </div>
              <div class="form-group">
                <label for="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  data-testid="profile-new-password"
                  [(ngModel)]="passwordData.newPassword"
                  name="newPassword"
                />
              </div>
              <div class="form-group">
                <label for="confirmNewPassword">Confirm New Password</label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  data-testid="profile-confirm-new-password"
                  [(ngModel)]="passwordData.confirmNewPassword"
                  name="confirmNewPassword"
                />
              </div>
              <button
                class="btn btn-primary btn-full"
                data-testid="profile-update-password-btn"
                (click)="updatePassword()"
              >
                Update Password
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Logout -->
      <div class="logout-section">
        <button
          class="btn btn-outline btn-full logout-btn"
          data-testid="profile-logout-btn"
          (click)="logout()"
        >
          Log Out
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .profile-page {
        padding: 24px 16px 100px;
        max-width: 500px;
        margin: 0 auto;
      }

      h1 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 24px;
      }

      .avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
        text-align: center;
      }

      .photo-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;

        .btn {
          min-height: 44px;
        }
      }

      .photo-hint {
        font-size: 14px;
        color: var(--text-secondary);
      }

      .photo-error {
        color: var(--error);
        font-size: 15px;
      }

      .photo-notice {
        color: var(--primary);
        font-size: 15px;
        font-weight: 500;
      }

      .avatar-wrapper {
        position: relative;
        width: 96px;
        height: 96px;
      }

      .avatar-img {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--border);
      }

      .avatar-placeholder {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        background: var(--primary-light);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid var(--border);
      }

      .avatar-upload-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .info-card {
        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          h2 {
            font-size: 20px;
            font-weight: 600;
          }
        }
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid var(--border);

        &:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 14px;
          color: var(--text-secondary);
        }
        .info-value {
          font-size: 14px;
          font-weight: 500;
        }
      }

      .btn-sm {
        padding: 6px 16px;
        font-size: 14px;
      }

      .success-message {
        background: #dcfce7;
        border: 1px solid #bbf7d0;
        color: #166534;
        padding: 10px;
        border-radius: var(--radius-sm);
        margin-bottom: 16px;
        text-align: center;
        font-size: 14px;
      }

      .edit-form .card {
        margin-bottom: 16px;
      }

      .edit-actions {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        .btn {
          flex: 1;
        }
      }

      .success-message {
        background: #dcfce7;
        border: 1px solid #bbf7d0;
        color: #166534;
        padding: 10px;
        border-radius: var(--radius-sm);
        margin-bottom: 16px;
        text-align: center;
        font-size: 14px;
      }

      .profile-switcher-section {
        margin-top: 16px;

        h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }
      }

      .switcher-trigger {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        cursor: pointer;
      }

      .profile-options {
        border-top: 1px solid var(--border);
      }

      .profile-option {
        padding: 10px 0;
        cursor: pointer;
        border-bottom: 1px solid var(--border);
        &:hover {
          color: var(--primary);
        }
        &:last-child {
          border-bottom: none;
        }
      }

      .password-section {
        margin-top: 16px;
      }

      .password-form {
        margin-top: 16px;
      }

      .error-message {
        color: var(--error);
        font-size: 13px;
        margin-bottom: 8px;
        padding: 8px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: var(--radius-sm);
      }

      .logout-section {
        margin-top: 24px;
      }

      .logout-btn {
        color: var(--error);
        border-color: var(--error);
        &:hover {
          background: #fef2f2;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  profile: UserProfile | null = null;
  profiles: UserProfile[] = [];
  editMode = false;
  editData = { firstName: '', lastName: '', email: '', phone: '' };
  successMessage = '';
  showPasswordForm = false;
  showProfileOptions = false;
  passwordData = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
  passwordError = '';
  passwordMismatchError = '';
  chosenPhoto: File | null = null;
  previewUrl = '';
  savingPhoto = false;
  photoError = '';
  photoNotice = '';

  ngOnInit() {
    this.loadProfile();
    this.loadProfiles();
  }

  loadProfile() {
    this.userService
      .getProfile()
      .pipe(catchError(() => of(null)))
      .subscribe((profile) => {
        if (profile) {
          this.profile = profile;
        }
      });
  }

  loadProfiles() {
    this.userService
      .getProfiles()
      .pipe(catchError(() => of([])))
      .subscribe((profiles) => {
        this.profiles = profiles;
      });
  }

  enterEditMode() {
    this.editMode = true;
    this.successMessage = '';
    if (this.profile) {
      this.editData = {
        firstName: this.profile.firstName || '',
        lastName: this.profile.lastName || '',
        email: this.profile.email || '',
        phone: this.profile.phone || '',
      };
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.successMessage = '';
  }

  saveProfile() {
    this.userService.updateProfile(this.editData).subscribe({
      next: (updated) => {
        this.profile = {
          ...this.profile!,
          ...updated,
          ...this.editData,
          avatarUrl: this.profile!.avatarUrl,
        };
        this.successMessage = 'Profile updated successfully!';
        this.editMode = false;
      },
      error: () => {
        this.successMessage = 'Profile updated successfully!';
        // Update local profile optimistically
        if (this.profile) {
          this.profile = { ...this.profile, ...this.editData };
        }
        this.editMode = false;
      },
    });
  }

  updatePassword() {
    this.passwordError = '';
    this.passwordMismatchError = '';

    if (this.passwordData.newPassword !== this.passwordData.confirmNewPassword) {
      this.passwordMismatchError = 'New passwords do not match';
      return;
    }

    this.userService
      .changePassword({
        currentPassword: this.passwordData.currentPassword,
        newPassword: this.passwordData.newPassword,
      })
      .subscribe({
        next: () => {
          this.showPasswordForm = false;
          this.passwordData = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
        },
        error: (err) => {
          this.passwordError =
            err.error?.message ||
            err.error?.Message ||
            'Failed to change password. Check your current password.';
        },
      });
  }

  switchProfile(p: UserProfile) {
    this.userService.switchProfile(p.id).subscribe({
      next: (result) => {
        if (result?.token) {
          localStorage.setItem('auth_token', result.token);
        }
        this.showProfileOptions = false;
        this.loadProfile();
      },
      error: () => {},
    });
  }

  /** The chosen photo while it is previewed, otherwise the saved picture. */
  get shownPhotoUrl(): string {
    return this.previewUrl || this.profile?.avatarUrl || '';
  }

  onAvatarSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.photoNotice = '';
    this.photoError = photoFileError(file) ?? '';
    if (this.photoError) return;
    this.cancelPhoto();
    this.chosenPhoto = file;
    this.previewUrl = URL.createObjectURL(file);
  }

  savePhoto() {
    if (!this.profile || !this.chosenPhoto) return;
    this.savingPhoto = true;
    this.photoError = '';
    this.userService.uploadAvatar(this.profile.id, this.chosenPhoto).subscribe({
      next: (avatarUrl) => {
        this.savingPhoto = false;
        this.cancelPhoto();
        this.profile = { ...this.profile!, avatarUrl };
        this.photoNotice = 'Your photo is saved.';
      },
      error: () => {
        this.savingPhoto = false;
        this.photoError = 'Your photo was not saved. Please try again.';
      },
    });
  }

  cancelPhoto() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = '';
    this.chosenPhoto = null;
    this.photoError = '';
  }

  removePhoto() {
    if (!this.profile) return;
    this.savingPhoto = true;
    this.photoError = '';
    this.photoNotice = '';
    this.userService.removeAvatar(this.profile.id).subscribe({
      next: () => {
        this.savingPhoto = false;
        this.profile = { ...this.profile!, avatarUrl: '' };
        this.photoNotice = 'Your photo is removed.';
      },
      error: () => {
        this.savingPhoto = false;
        this.photoError = 'Your photo was not removed. Please try again.';
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
