import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private api: ApiService) {}

  getRoles(): Observable<any> {
    return this.api.get('/role');
  }

  getRolesPage(pageIndex: number, pageSize: number): Observable<any> {
    return this.api.get(`/role/page/${pageSize}/${pageIndex}`);
  }

  getRoleById(id: string): Observable<any> {
    return this.api.get(`/role/${id}`);
  }

  createRole(data: any): Observable<any> {
    return this.api.post('/role', data);
  }

  updateRole(data: any): Observable<any> {
    return this.api.put('/role', data);
  }

  deleteRole(id: string): Observable<any> {
    return this.api.delete(`/role/${id}`);
  }
}
