import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map, of, catchError } from 'rxjs';

export interface CoopDocument {
  id: string;
  title: string;
  type: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  fileUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private api = inject(ApiService);

  getPublishedDocuments(): Observable<CoopDocument[]> {
    return this.getAllDocuments();
  }

  getAllDocuments(): Observable<CoopDocument[]> {
    return this.api.get<any>('documents').pipe(
      map((resp: any) => {
        const items = Array.isArray(resp) ? resp : resp?.documents ?? [];
        return items.map((d: any) => this.mapDoc(d));
      }),
      catchError(() => of([])),
    );
  }

  getDocument(id: string): Observable<CoopDocument> {
    return this.api.get<any>(`documents/${id}`).pipe(
      map((resp: any) => this.mapDoc(resp?.document ?? resp)),
    );
  }

  private mapDoc(d: any): CoopDocument {
    return {
      id: d.id || d.documentId || '',
      title: d.title || d.name || '',
      type: d.type || 'notices',
      content: d.content || d.body || '',
      published: d.published ?? true,
      createdAt: d.createdAt || d.createdOn || '',
      updatedAt: d.updatedAt || d.createdOn || '',
      fileUrl: d.fileUrl || '',
    };
  }
}
