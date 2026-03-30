import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface MemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  unit: string;
  avatarUrl: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = inject(ApiService);

  getProfile(): Observable<MemberProfile> {
    return this.api.get<MemberProfile>('user/profile');
  }

  updateProfile(data: Partial<MemberProfile>): Observable<MemberProfile> {
    return this.api.put<MemberProfile>('user/profile', data);
  }

  getUnits(): Observable<{ id: string; name: string; number: string }[]> {
    return this.api.get<{ id: string; name: string; number: string }[]>('units');
  }
}
