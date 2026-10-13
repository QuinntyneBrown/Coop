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
}
