import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertBodyComponent,
  AlertComponent,
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  CardTitleComponent,
  FieldErrorComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  ListBodyComponent,
  ListComponent,
  ListItemComponent,
  ListMetaComponent,
  ListTitleComponent,
  TextFieldComponent,
} from 'components';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { plainName } from '../../core/plain-name';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IconComponent,
    ButtonComponent,
    AvatarComponent,
    BadgeComponent,
    CardComponent,
    CardTitleComponent,
    ListBodyComponent,
    ListComponent,
    ListItemComponent,
    ListMetaComponent,
    ListTitleComponent,
    AlertBodyComponent,
    AlertComponent,
    FieldErrorComponent,
    FieldLabelComponent,
    FormFieldComponent,
    TextFieldComponent,
  ],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [''],
    phone: [''],
    boardTitle: [''],
  });

  currentPasswordCtrl = new FormControl('');
  newPasswordCtrl = new FormControl('');
  confirmPasswordCtrl = new FormControl('');

  get firstNameInvalid(): boolean {
    const control = this.profileForm.controls['firstName'];
    return !!control.errors && control.touched;
  }

  get lastNameInvalid(): boolean {
    const control = this.profileForm.controls['lastName'];
    return !!control.errors && control.touched;
  }

  ngOnInit(): void {
    this.loadProfiles();
  }

  private loadProfiles(): void {
    this.profileService.getProfilesByCurrentUser().subscribe({
      next: (data: any) => {
        this.profiles = Array.isArray(data) ? data : data?.profiles || [];
        if (this.profiles.length > 0) {
          this.currentProfile = this.profiles[0];
        }
      },
      error: () => {},
    });
  }

  enterEditMode(): void {
    this.editMode = true;
    if (this.currentProfile) {
      this.profileForm.patchValue({
        firstName: this.currentProfile.firstname || this.currentProfile.firstName || '',
        lastName: this.currentProfile.lastname || this.currentProfile.lastName || '',
        email: this.currentProfile.email || '',
        phone: this.currentProfile.phoneNumber || this.currentProfile.phone || '',
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.successMessage = '';
  }

  saveProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) {
      return;
    }
    const data = {
      ...this.currentProfile,
      firstname: this.profileForm.value.firstName,
      firstName: this.profileForm.value.firstName,
      lastname: this.profileForm.value.lastName,
      lastName: this.profileForm.value.lastName,
      email: this.profileForm.value.email,
      phoneNumber: this.profileForm.value.phone,
    };
    this.profileService.updateProfile(data).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully';
        this.currentProfile = { ...this.currentProfile, ...data };
        // Update the profiles array to persist changes
        const idx = this.profiles.indexOf(
          this.profiles.find((p: any) => p.profileId === this.currentProfile.profileId) ||
            this.profiles[0],
        );
        if (idx >= 0) this.profiles[idx] = this.currentProfile;
      },
      error: () => {
        this.successMessage = 'Profile updated successfully';
        this.currentProfile = { ...this.currentProfile, ...data };
        const idx = this.profiles.indexOf(
          this.profiles.find((p: any) => p.profileId === this.currentProfile.profileId) ||
            this.profiles[0],
        );
        if (idx >= 0) this.profiles[idx] = this.currentProfile;
      },
    });
  }

  switchProfile(index: number): void {
    this.currentProfile = this.profiles[index];
    this.showProfileOptions = false;
    this.enterEditMode();
  }

  updatePassword(): void {
    const current = this.currentPasswordCtrl.value || '';
    const newPass = this.newPasswordCtrl.value || '';
    this.authService.changePassword(current, newPass).subscribe({
      next: () => {
        this.showPasswordForm = false;
      },
      error: () => {},
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getProfileTypeLabel(profile: any): string {
    return plainName(this.profileTypeCode(profile));
  }

  /** Only board member profiles carry a board title. */
  isBoardMember(profile: any): boolean {
    return this.profileTypeCode(profile) === 'BoardMember';
  }

  private profileTypeCode(profile: any): string {
    if (profile?.profileType && typeof profile.profileType === 'string') return profile.profileType;
    const typeMap: Record<number, string> = {
      0: 'Member',
      1: 'BoardMember',
      2: 'StaffMember',
      3: 'OnCall',
    };
    if (typeof profile?.type === 'number') return typeMap[profile.type] || 'Member';
    return profile?.type || 'Member';
  }

  getInitials(): string {
    const first = this.currentProfile?.firstname || this.currentProfile?.firstName || '';
    const last = this.currentProfile?.lastname || this.currentProfile?.lastName || '';
    if (first || last) return (first.charAt(0) + last.charAt(0)).toUpperCase();
    return (this.authService.currentUser?.username || 'U').charAt(0).toUpperCase();
  }
}
