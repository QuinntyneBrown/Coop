import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  comments: MaintenanceComment[];
  attachments: MaintenanceAttachment[];
}

export interface MaintenanceComment {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
}

export interface MaintenanceAttachment {
  id: string;
  fileName: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private api = inject(ApiService);

  getMyRequests(): Observable<MaintenanceRequest[]> {
    return this.api.get<any>('maintenance-requests/my').pipe(
      map((resp: any) => {
        const items = Array.isArray(resp) ? resp : resp?.maintenanceRequests ?? [];
        return items.map((r: any) => this.mapRequest(r));
      }),
    );
  }

  getRequest(id: string): Observable<MaintenanceRequest> {
    return this.api.get<any>(`maintenance-requests/${id}`).pipe(
      map((resp: any) => {
        const r = resp?.maintenanceRequest ?? resp;
        return this.mapRequest(r);
      }),
    );
  }

  createRequest(data: { title: string; description: string; priority?: string; category?: string }): Observable<MaintenanceRequest> {
    return this.api.post<any>('maintenance-requests', data).pipe(
      map((resp: any) => {
        const r = resp?.maintenanceRequest ?? resp;
        return this.mapRequest(r);
      }),
    );
  }

  addComment(requestId: string, content: string): Observable<MaintenanceComment> {
    return this.api.post<any>(`maintenance-requests/${requestId}/comments`, { content }).pipe(
      map((resp: any) => ({
        id: resp.id || resp.maintenanceRequestCommentId || '',
        content: resp.content || resp.body || '',
        createdAt: resp.createdAt || resp.createdOn || '',
        authorName: resp.authorName || 'Member',
      })),
    );
  }

  uploadPhoto(requestId: string, file: File): Observable<MaintenanceAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.http.post<MaintenanceAttachment>(
      `${this.api.baseUrl}/maintenance-requests/${requestId}/attachments`,
      formData,
    );
  }

  private mapRequest(r: any): MaintenanceRequest {
    return {
      id: r.id || r.maintenanceRequestId || '',
      title: r.title || '',
      description: r.description || '',
      status: r.status || 'New',
      priority: r.priority || 'Medium',
      category: r.category || 'General',
      createdAt: r.createdAt || r.date || '',
      updatedAt: r.updatedAt || r.date || '',
      comments: (r.comments || []).map((c: any) => ({
        id: c.id || c.maintenanceRequestCommentId || '',
        content: c.content || c.body || '',
        createdAt: c.createdAt || c.createdOn || '',
        authorName: c.authorName || 'Member',
      })),
      attachments: (r.attachments || r.digitalAssets || []).map((a: any) => ({
        id: a.id || a.maintenanceRequestDigitalAssetId || '',
        fileName: a.fileName || a.name || 'attachment',
        url: a.url || '',
      })),
    };
  }
}
