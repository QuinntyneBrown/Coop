import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import type { WebsitePage } from '../models/website-page';
import type { WebsitePageDraft } from '../models/website-page-draft';

/** Website page management (`/api/pages`, L2-REQ-080, L2-REQ-123); the office reads every page, published or not. */
@Injectable({ providedIn: 'root' })
export class PageService {
  private readonly api = inject(ApiService);

  getAll(): Observable<WebsitePage[]> {
    return this.api
      .get<{ pages?: WebsitePage[] }>('/pages')
      .pipe(map((response) => response?.pages ?? []));
  }

  create(draft: WebsitePageDraft): Observable<WebsitePage> {
    return this.api
      .post<{ page: WebsitePage }>('/pages', this.payload(draft))
      .pipe(map((response) => response.page));
  }

  update(pageId: string, draft: WebsitePageDraft): Observable<WebsitePage> {
    return this.api
      .put<{ page: WebsitePage }>('/pages', { pageId, ...this.payload(draft) })
      .pipe(map((response) => response.page));
  }

  remove(pageId: string): Observable<unknown> {
    return this.api.delete(`/pages/${pageId}`);
  }

  private payload(draft: WebsitePageDraft) {
    return {
      title: draft.title.trim(),
      heroImageUrl: draft.heroImageUrl.trim() || null,
      heroImageAlt: draft.heroImageUrl.trim() ? draft.heroImageAlt.trim() || null : null,
      published: draft.published,
      sections: draft.sections,
    };
  }
}
