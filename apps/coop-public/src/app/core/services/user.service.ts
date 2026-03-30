import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  unit: string;
  avatarUrl: string;
  memberSince: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getProfile(): Observable<UserProfile> {
    return this.api.get<UserProfile>('user/profile');
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.api.put<UserProfile>('user/profile', data);
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.api.post<void>('user/change-password', data);
  }

  getProfiles(): Observable<UserProfile[]> {
    return this.api.get<UserProfile[]>('user/profiles');
  }

  switchProfile(profileId: string): Observable<{ token: string }> {
    return this.api.post<{ token: string }>('user/switch-profile', { profileId });
  }

  uploadAvatar(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.http.post<{ url: string }>(`${this.api.baseUrl}/user/avatar`, formData);
  }
}
