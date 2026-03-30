import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface DigitalAsset {
  id: string;
  fileName: string;
  contentType: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class DigitalAssetService {
  private api = inject(ApiService);

  upload(file: File): Observable<DigitalAsset> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.http.post<DigitalAsset>(`${this.api.baseUrl}/digital-assets`, formData);
  }

  get(id: string): Observable<DigitalAsset> {
    return this.api.get<DigitalAsset>(`digital-assets/${id}`);
  }
}
