import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, forkJoin, map } from 'rxjs';

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
    return forkJoin([
      this.api.get<CoopDocument[]>('notice/published').pipe(map(docs => docs.map(d => ({ ...d, type: d.type || 'notices' })))),
      this.api.get<CoopDocument[]>('bylaw/published').pipe(map(docs => docs.map(d => ({ ...d, type: d.type || 'bylaws' })))),
      this.api.get<CoopDocument[]>('report/published').pipe(map(docs => docs.map(d => ({ ...d, type: d.type || 'reports' })))),
    ]).pipe(
      map(([notices, bylaws, reports]) => [...notices, ...bylaws, ...reports]),
    );
  }

  getAllDocuments(): Observable<CoopDocument[]> {
    return this.api.get<CoopDocument[]>('documents').pipe(
      map(docs => docs || []),
    );
  }

  getDocument(id: string): Observable<CoopDocument> {
    return this.api.get<CoopDocument>(`documents/${id}`);
  }
}
