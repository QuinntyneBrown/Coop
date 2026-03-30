import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PrivilegeService {
  constructor(private api: ApiService) {}

  getPrivileges(): Observable<any> {
    return this.api.get('/privilege');
  }

  getPrivilegesPage(pageIndex: number, pageSize: number): Observable<any> {
    return this.api.get(`/privilege/page/${pageSize}/${pageIndex}`);
  }

  getPrivilegeById(id: string): Observable<any> {
    return this.api.get(`/privilege/${id}`);
  }

  createPrivilege(data: any): Observable<any> {
    return this.api.post('/privilege', data);
  }

  updatePrivilege(data: any): Observable<any> {
    return this.api.put('/privilege', data);
  }

  deletePrivilege(id: string): Observable<any> {
    return this.api.delete(`/privilege/${id}`);
  }
}
