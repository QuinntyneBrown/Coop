import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  getUsers(): Observable<any> {
    return this.api.get('/user');
  }

  getUsersPage(pageIndex: number, pageSize: number): Observable<any> {
    return this.api.get(`/user/page/${pageSize}/${pageIndex}`);
  }

  getUserById(id: string): Observable<any> {
    return this.api.get(`/user/${id}`);
  }

  getCurrentUser(): Observable<any> {
    return this.api.get('/user/current');
  }

  createUser(data: any): Observable<any> {
    return this.api.post('/user', data);
  }

  updateUser(data: any): Observable<any> {
    return this.api.put('/user', data);
  }

  deleteUser(id: string): Observable<any> {
    return this.api.delete(`/user/${id}`);
  }
}
