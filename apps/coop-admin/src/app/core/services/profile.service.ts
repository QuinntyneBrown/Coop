import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
