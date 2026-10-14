import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import type { SiteContent } from '../models/site-content';

/** The public site content (`/api/site-content`, L2-REQ-099). */
@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private readonly api = inject(ApiService);

  get(): Observable<SiteContent> {
    return this.api
      .get<{ siteContent: SiteContent }>('/site-content')
      .pipe(map((response) => response.siteContent));
  }

  /** Replaces the whole content. */
  save(content: SiteContent): Observable<SiteContent> {
    return this.api
      .put<{ siteContent?: SiteContent }>('/site-content', { siteContent: content })
      .pipe(map((response) => response?.siteContent ?? content));
  }
}
