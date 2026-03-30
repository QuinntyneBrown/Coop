import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

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
    return this.api.get<MaintenanceRequest[]>('maintenance-requests/my');
  }

  getRequest(id: string): Observable<MaintenanceRequest> {
    return this.api.get<MaintenanceRequest>(`maintenance-requests/${id}`);
  }

  createRequest(data: { title: string; description: string; priority?: string; category?: string }): Observable<MaintenanceRequest> {
    return this.api.post<MaintenanceRequest>('maintenance-requests', data);
  }

  addComment(requestId: string, content: string): Observable<MaintenanceComment> {
    return this.api.post<MaintenanceComment>(`maintenance-requests/${requestId}/comments`, { content });
  }

  uploadPhoto(requestId: string, file: File): Observable<MaintenanceAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.http.post<MaintenanceAttachment>(
      `${this.api.baseUrl}/maintenance-requests/${requestId}/attachments`,
      formData,
    );
  }
}
