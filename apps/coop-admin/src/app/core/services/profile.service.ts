import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private api: ApiService) {}

  getProfiles(): Observable<any> {
    return this.api.get('/profile');
  }

  getProfileById(id: string): Observable<any> {
    return this.api.get(`/profile/${id}`);
  }

  getProfilesByCurrentUser(): Observable<any> {
    return this.api.get('/profile/current');
  }

  getProfilesByType(type: string): Observable<any> {
    return this.api.get(`/profile/type/${type}`);
  }

  createProfile(data: any): Observable<any> {
    return this.api.post('/profile', data);
  }

  updateProfile(data: any): Observable<any> {
    return this.api.put('/profile', data);
  }

  deleteProfile(id: string): Observable<any> {
    return this.api.delete(`/profile/${id}`);
  }

  setAvatar(profileId: string, formData: FormData): Observable<any> {
    return this.api.upload(`/profile/${profileId}/avatar`, formData);
  }
}
