import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private api: ApiService) {}

  getProfiles(): Observable<any> {
    return this.api.get('/profiles');
  }

  getProfileById(id: string): Observable<any> {
    return this.api.get(`/profiles/${id}`);
  }

  /** The address of a profile's picture, or '' when it has none. */
  getAvatarUrl(id: string): Observable<string> {
    return this.getProfileById(id).pipe(
      map((resp: any) => this.api.assetUrl(resp?.profile?.avatarUrl)),
    );
  }

  getProfilesByCurrentUser(): Observable<any> {
    return this.api.get('/profiles');
  }

  getProfilesByType(type: string): Observable<any> {
    return this.api.get(`/profiles/type/${type}`);
  }

  createProfile(data: any): Observable<any> {
    return this.api.post('/members', data);
  }

  updateProfile(data: any): Observable<any> {
    return this.api.put('/members', data);
  }

  deleteProfile(id: string): Observable<any> {
    return this.api.delete(`/profiles/${id}`);
  }

  setAvatar(profileId: string, formData: FormData): Observable<any> {
    return this.api.put('/profiles/avatar', formData);
  }

  /** The address an image loads a profile's picture from, or '' when it has none. */
  avatarAddress(profile: { avatarUrl?: string | null } | null | undefined): string {
    return this.api.assetUrl(profile?.avatarUrl);
  }

  /** Sets the picture on a profile the caller owns (L2-REQ-091); answers with the profile. */
  uploadAvatar(profileId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.api.upload(`/profiles/${profileId}/avatar`, formData);
  }

  removeAvatar(profileId: string): Observable<any> {
    return this.api.delete(`/profiles/${profileId}/avatar`);
  }

  /** How new notices reach the signed-in person (L2-REQ-092). */
  getNoticeChoice(): Observable<{ noticeByEmail: boolean; noticeByText: boolean }> {
    return this.api.get('/user/profile').pipe(
      map((resp: any) => ({
        noticeByEmail: !!resp?.noticeByEmail,
        noticeByText: !!resp?.noticeByText,
      })),
    );
  }

  saveNoticeChoice(choice: { noticeByEmail: boolean; noticeByText: boolean }): Observable<any> {
    return this.api.put('/user/profile', choice);
  }
}
