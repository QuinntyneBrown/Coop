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
  CheckboxComponent,
  CheckboxTextComponent,
  FieldErrorComponent,
  FieldHelpComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  ListBodyComponent,
  ListComponent,
  ListItemComponent,
  ListMetaComponent,
  ListTitleComponent,
  PhotoPickerActionsComponent,
  PhotoPickerBodyComponent,
  PhotoPickerComponent,
  TextFieldComponent,
} from 'components';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { plainName } from '../../../core/plain-name';
import { photoFileError } from '../../operations/maintenance/photo-file-error';
import { noticeChoiceError, noticeChoiceLabel } from './notice-choice';

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
    CheckboxComponent,
    CheckboxTextComponent,
    FieldHelpComponent,
    PhotoPickerActionsComponent,
    PhotoPickerBodyComponent,
    PhotoPickerComponent,
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

  // The picture and the notice choice on the person's own profile (L2-REQ-116).
  chosenPhoto: File | null = null;
  previewUrl = '';
  savingPhoto = false;
  photoError = '';
  photoStatus = '';
  noticeByEmail = false;
  noticeByText = false;
  noticesError = '';
  readonly noticeChoiceLabel = noticeChoiceLabel;

  profileForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [''],
    phone: [''],
    boardTitle: [''],
    noticeByEmail: [false],
    noticeByText: [false],
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
    this.profileService.getNoticeChoice().subscribe({
      next: (choice) => {
        this.noticeByEmail = choice.noticeByEmail;
        this.noticeByText = choice.noticeByText;
      },
      error: () => {},
    });
  }

  /** The picture shown in the circle: the previewed photo, else the saved one. */
  get photoAddress(): string {
    return this.previewUrl || this.profileService.avatarAddress(this.currentProfile);
  }

  choosePhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.photoStatus = '';
    this.photoError = photoFileError(file) ?? '';
    if (this.photoError) return;
    this.cancelPhoto();
    this.chosenPhoto = file;
    this.previewUrl = URL.createObjectURL(file);
  }

  savePhoto(): void {
    const profileId = this.currentProfile?.profileId;
    if (!profileId || !this.chosenPhoto) return;
    this.savingPhoto = true;
    this.photoError = '';
    this.profileService.uploadAvatar(profileId, this.chosenPhoto).subscribe({
      next: (resp: any) => {
        this.savingPhoto = false;
        this.currentProfile = { ...this.currentProfile, avatarUrl: resp?.profile?.avatarUrl };
        this.cancelPhoto();
        this.photoStatus = 'Your photo is saved.';
      },
      error: () => {
        this.savingPhoto = false;
        this.photoError = 'Your photo was not saved. Please try again.';
      },
    });
  }

  cancelPhoto(): void {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = '';
    this.chosenPhoto = null;
    this.photoError = '';
  }

  removePhoto(): void {
    const profileId = this.currentProfile?.profileId;
    if (!profileId) return;
    this.savingPhoto = true;
    this.photoError = '';
    this.photoStatus = '';
    this.profileService.removeAvatar(profileId).subscribe({
      next: () => {
        this.savingPhoto = false;
        this.currentProfile = { ...this.currentProfile, avatarUrl: null };
        this.photoStatus = 'Your photo is removed.';
      },
      error: () => {
        this.savingPhoto = false;
        this.photoError = 'Your photo was not removed. Please try again.';
      },
    });
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
        noticeByEmail: this.noticeByEmail,
        noticeByText: this.noticeByText,
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.successMessage = '';
    this.noticesError = '';
  }

  saveProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) {
      return;
    }
    const form = this.profileForm.value;
    this.noticesError = noticeChoiceError({
      email: form.email || '',
      phone: form.phone || '',
      noticeByEmail: !!form.noticeByEmail,
      noticeByText: !!form.noticeByText,
    });
    if (this.noticesError) return;
    const data = {
      ...this.currentProfile,
      firstname: this.profileForm.value.firstName,
      firstName: this.profileForm.value.firstName,
      lastname: this.profileForm.value.lastName,
      lastName: this.profileForm.value.lastName,
      email: this.profileForm.value.email,
      phoneNumber: this.profileForm.value.phone,
    };
    const choice = { noticeByEmail: !!form.noticeByEmail, noticeByText: !!form.noticeByText };
    // As before, the profile counts as saved even when the update fails (design-system drift D21).
    this.profileService.updateProfile(data).subscribe({
      next: () => this.profileSaved(data, choice),
      error: () => this.profileSaved(data, choice),
    });
  }

  private profileSaved(data: any, choice: { noticeByEmail: boolean; noticeByText: boolean }): void {
    this.currentProfile = { ...this.currentProfile, ...data };
    // Update the profiles array to persist changes
    const idx = this.profiles.indexOf(
      this.profiles.find((p: any) => p.profileId === this.currentProfile.profileId) ||
        this.profiles[0],
    );
    if (idx >= 0) this.profiles[idx] = this.currentProfile;
    this.profileService.saveNoticeChoice(choice).subscribe({
      next: () => {
        this.noticeByEmail = choice.noticeByEmail;
        this.noticeByText = choice.noticeByText;
        this.successMessage = 'Your profile is saved.';
      },
      error: () => {
        this.noticesError = 'How you get notices was not saved. Please try again.';
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
