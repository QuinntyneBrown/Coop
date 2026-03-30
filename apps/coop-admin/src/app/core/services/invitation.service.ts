import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  constructor(private api: ApiService) {}

  getInvitations(): Observable<any> {
    return this.api.get('/invitation-token');
  }

  getInvitationsPage(pageIndex: number, pageSize: number): Observable<any> {
    return this.api.get(`/invitation-token/page/${pageSize}/${pageIndex}`);
  }

  getInvitationById(id: string): Observable<any> {
    return this.api.get(`/invitation-token/${id}`);
  }

  createInvitation(data: any): Observable<any> {
    return this.api.post('/invitation-token', data);
  }

  updateInvitation(data: any): Observable<any> {
    return this.api.put('/invitation-token', data);
  }

  deleteInvitation(id: string): Observable<any> {
    return this.api.delete(`/invitation-token/${id}`);
  }

  validateToken(value: string): Observable<any> {
    return this.api.get(`/invitation-token/validate/${value}`);
  }
}
