import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { ApiService } from './api.service';
import type { CoopDocument } from '../models/coop-document';

/** One published-documents endpoint and the key its answer lists the documents under. */
const PUBLISHED_ENDPOINTS: { path: string; key: string; type: string }[] = [
  { path: 'notice/published', key: 'notices', type: 'notices' },
  { path: 'bylaw/published', key: 'byLaws', type: 'bylaws' },
  { path: 'report/published', key: 'reports', type: 'reports' },
];

/**
 * The published documents visitors may read (L2-REQ-035, L2-REQ-126): the
 * published notices, by-laws and reports together, newest first. A request
 * that fails leaves its documents out; when all three fail the call errors,
 * so the page can say so.
 */
@Injectable({ providedIn: 'root' })
export class DocumentService {
  private api = inject(ApiService);

  getPublishedDocuments(): Observable<CoopDocument[]> {
    return forkJoin(
      PUBLISHED_ENDPOINTS.map(({ path, key, type }) =>
        this.api.get<Record<string, unknown>>(path).pipe(
          map((response) => {
            const items = response?.[key];
            return Array.isArray(items) ? items.map((d) => this.mapDoc(d, type)) : [];
          }),
          catchError(() => of(null)),
        ),
      ),
    ).pipe(
      map((lists) => {
        if (lists.every((list) => list === null)) throw new Error('No documents could be loaded.');
        return lists
          .flatMap((list) => list ?? [])
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }),
    );
  }

  private mapDoc(d: any, type: string): CoopDocument {
    return {
      id: d.documentId || d.id || '',
      title: d.name || d.title || '',
      type,
      content: d.body || d.content || '',
      published: true,
      createdAt: d.createdOn || d.createdAt || '',
      updatedAt: d.createdOn || d.updatedAt || '',
      fileUrl: d.fileUrl || '',
    };
  }
}
