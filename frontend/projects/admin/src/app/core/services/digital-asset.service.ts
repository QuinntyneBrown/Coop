import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DigitalAssetService {
  constructor(private api: ApiService) {}

  getDigitalAssets(): Observable<any> {
    return this.api.get('/digitalasset/page/100/0');
  }

  getDigitalAssetsPage(pageIndex: number, pageSize: number): Observable<any> {
    return this.api.get(`/digital-asset/page/${pageSize}/${pageIndex}`);
  }

  getDigitalAssetById(id: string): Observable<any> {
    return this.api.get(`/digital-asset/${id}`);
  }

  upload(formData: FormData): Observable<any> {
    return this.api.upload('/digitalasset/upload', formData);
  }

  deleteDigitalAsset(id: string): Observable<any> {
    return this.api.delete(`/digital-asset/${id}`);
  }

  getServeUrl(id: string): string {
    return `${this.api.apiUrl}/digital-asset/serve/${id}`;
  }
}
