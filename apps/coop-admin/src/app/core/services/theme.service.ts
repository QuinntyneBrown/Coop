import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor(private api: ApiService) {}

  getThemes(): Observable<any> {
    return this.api.get('/theme');
  }

  getThemeById(id: string): Observable<any> {
    return this.api.get(`/theme/${id}`);
  }

  getDefaultTheme(): Observable<any> {
    return this.api.get('/theme/default');
  }

  createTheme(data: any): Observable<any> {
    return this.api.post('/theme', data);
  }

  updateTheme(data: any): Observable<any> {
    return this.api.put('/theme', data);
  }

  deleteTheme(id: string): Observable<any> {
    return this.api.delete(`/theme/${id}`);
  }
}
