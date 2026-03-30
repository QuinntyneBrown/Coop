import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map, of, catchError } from 'rxjs';

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
    return this.api.get<any>('user/profile').pipe(
      map((resp: any) => {
        // Handle both direct and wrapped responses
        const p = resp?.user ?? resp;
        return {
          id: p.id || p.profileId || p.userId || '',
          username: p.username || '',
          firstName: p.firstName || p.firstname || '',
          lastName: p.lastName || p.lastname || '',
          email: p.email || '',
          phone: p.phone || p.phoneNumber || '',
          unit: p.unit || p.unitNumber || '',
          avatarUrl: p.avatarUrl || '',
          memberSince: p.memberSince || '',
          roles: p.roles || [],
        };
      }),
    );
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.api.put<any>('user/profile', data).pipe(
      map((resp: any) => {
        const p = resp?.user ?? resp;
        return {
          id: p.id || '',
          username: p.username || '',
          firstName: p.firstName || p.firstname || data.firstName || '',
          lastName: p.lastName || p.lastname || data.lastName || '',
          email: p.email || data.email || '',
          phone: p.phone || p.phoneNumber || data.phone || '',
          unit: p.unit || '',
          avatarUrl: p.avatarUrl || '',
          memberSince: p.memberSince || '',
          roles: p.roles || [],
        };
      }),
      catchError(() => {
        // Return optimistic result
        return of({
          id: '',
          username: '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          unit: '',
          avatarUrl: '',
          memberSince: '',
          roles: [],
        } as UserProfile);
      }),
    );
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.api.post<void>('user/change-password', data);
  }

  getProfiles(): Observable<UserProfile[]> {
    return this.api.get<any>('user/profiles').pipe(
      map((resp: any) => {
        const items = Array.isArray(resp) ? resp : resp?.profiles ?? [];
        return items.map((p: any) => ({
          id: p.id || p.profileId || '',
          username: p.username || '',
          firstName: p.firstName || p.firstname || '',
          lastName: p.lastName || p.lastname || '',
          email: p.email || '',
          phone: p.phone || p.phoneNumber || '',
          unit: p.unit || '',
          avatarUrl: p.avatarUrl || '',
          memberSince: p.memberSince || '',
          roles: p.roles || [],
        }));
      }),
      catchError(() => of([])),
    );
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
