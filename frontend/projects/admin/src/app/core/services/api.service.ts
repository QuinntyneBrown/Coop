import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`, { params });
  }

  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, body);
  }

  put<T>(path: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`);
  }

  getBlob(path: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${path}`, { responseType: 'blob' });
  }

  /** Turns an address the API returns, such as "/api/digitalasset/serve/{id}", into one an image can load. */
  assetUrl(path: string | null | undefined): string {
    return path ? new URL(path, this.apiUrl).href : '';
  }

  upload<T>(path: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, formData);
  }
}
