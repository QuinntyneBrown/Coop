import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class JsonContentService {
  constructor(private api: ApiService) {}

  getAll(): Observable<any> {
    return this.api.get('/json-content');
  }

  getById(id: string): Observable<any> {
    return this.api.get(`/json-content/${id}`);
  }

  getByName(name: string): Observable<any> {
    return this.api.get(`/json-content/name/${name}`);
  }

  create(data: any): Observable<any> {
    return this.api.post('/json-content', data);
  }

  update(data: any): Observable<any> {
    return this.api.put('/json-content', data);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`/json-content/${id}`);
  }
}
