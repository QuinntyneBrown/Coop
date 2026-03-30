import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  constructor(private api: ApiService) {}

  getMaintenanceRequests(): Observable<any> {
    return this.api.get('/maintenance-request');
  }

  getMaintenanceRequestsPage(pageIndex: number, pageSize: number): Observable<any> {
    return this.api.get(`/maintenance-request/page/${pageSize}/${pageIndex}`);
  }

  getMaintenanceRequestById(id: string): Observable<any> {
    return this.api.get(`/maintenance-request/${id}`);
  }

  getCurrentUserMaintenanceRequests(): Observable<any> {
    return this.api.get('/maintenance-request/current');
  }

  createMaintenanceRequest(data: any): Observable<any> {
    return this.api.post('/maintenance-request', data);
  }

  updateMaintenanceRequest(data: any): Observable<any> {
    return this.api.put('/maintenance-request', data);
  }

  deleteMaintenanceRequest(id: string): Observable<any> {
    return this.api.delete(`/maintenance-request/${id}`);
  }

  receiveMaintenanceRequest(id: string): Observable<any> {
    return this.api.put(`/maintenance-request/${id}/receive`, {});
  }

  startMaintenanceRequest(id: string): Observable<any> {
    return this.api.put(`/maintenance-request/${id}/start`, {});
  }

  completeMaintenanceRequest(id: string): Observable<any> {
    return this.api.put(`/maintenance-request/${id}/complete`, {});
  }

  addComment(requestId: string, body: string): Observable<any> {
    return this.api.post(`/maintenance-request/${requestId}/comment`, { body });
  }

  getComments(requestId: string): Observable<any> {
    return this.api.get(`/maintenance-request/${requestId}/comment`);
  }

  addDigitalAsset(requestId: string, formData: FormData): Observable<any> {
    return this.api.upload(`/maintenance-request/${requestId}/digital-asset`, formData);
  }
}
