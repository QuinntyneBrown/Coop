import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  constructor(private api: ApiService) {}

  getMaintenanceRequests(): Observable<any> {
    return this.api.get('/maintenancerequest');
  }

  getMaintenanceRequestsPage(pageIndex: number, pageSize: number): Observable<any> {
    return this.api.get(`/maintenancerequest/page/${pageSize}/${pageIndex}`);
  }

  getMaintenanceRequestById(id: string): Observable<any> {
    return this.api.get(`/maintenancerequest/${id}`);
  }

  getCurrentUserMaintenanceRequests(): Observable<any> {
    return this.api.get('/maintenancerequest/my');
  }

  createMaintenanceRequest(data: any): Observable<any> {
    return this.api.post('/maintenancerequest', data);
  }

  updateMaintenanceRequest(data: any): Observable<any> {
    return this.api.put('/maintenancerequest', data);
  }

  deleteMaintenanceRequest(id: string): Observable<any> {
    return this.api.delete(`/maintenancerequest/${id}`);
  }

  receiveMaintenanceRequest(id: string): Observable<any> {
    return this.api.put('/maintenancerequest/receive', { maintenanceRequestId: id });
  }

  startMaintenanceRequest(id: string): Observable<any> {
    return this.api.put('/maintenancerequest/start', { maintenanceRequestId: id });
  }

  completeMaintenanceRequest(id: string): Observable<any> {
    return this.api.put('/maintenancerequest/complete', { maintenanceRequestId: id });
  }

  addComment(requestId: string, body: string): Observable<any> {
    return this.api.post('/maintenancerequestcomment', { maintenanceRequestId: requestId, body });
  }

  getComments(requestId: string): Observable<any> {
    return this.api.get('/maintenancerequestcomment');
  }

  addDigitalAsset(requestId: string, formData: FormData): Observable<any> {
    return this.api.upload('/maintenancerequestdigitalasset', formData);
  }
}
