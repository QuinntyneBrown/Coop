import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Invitation {
  id: string;
  token: string;
  email: string;
  isValid: boolean;
}

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private api = inject(ApiService);

  validate(token: string): Observable<Invitation> {
    return this.api.get<Invitation>(`invitation/validate/${token}`);
  }
}
