import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import type { PreviewToken } from '../models/preview-token';
import type { SiteContent } from '../models/site-content';
import type { SiteContentDraft } from '../models/site-content-draft';

/**
 * The public site content and its draft (`/api/site-content`, L2-REQ-099,
 * L2-REQ-121, ADR 0018). Every call keeps `hasDraft` current, so the publish
 * bar on each Website screen reads one shared state.
 */
@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private readonly api = inject(ApiService);

  private readonly draftState = signal(false);

  /** True while unpublished changes exist. */
  readonly hasDraft = this.draftState.asReadonly();

  /** The draft when one exists, else the published copy (L2-REQ-121 AC9). */
  getDraft(): Observable<SiteContent> {
    return this.api.get<SiteContentDraft>('/site-content?draft=true').pipe(
      tap((response) => this.draftState.set(response.hasDraft)),
      map((response) => response.siteContent),
    );
  }

  /** Replaces the whole draft (L2-REQ-121 AC1). */
  save(content: SiteContent): Observable<SiteContent> {
    return this.api
      .put<{ siteContent?: SiteContent }>('/site-content', { siteContent: content })
      .pipe(
        tap(() => this.draftState.set(true)),
        map((response) => response?.siteContent ?? content),
      );
  }

  /** Copies the draft to the published copy; harmless when there is none (L2-REQ-121 AC4). */
  publish(): Observable<SiteContent> {
    return this.api.post<SiteContentDraft>('/site-content/publish', {}).pipe(
      tap(() => this.draftState.set(false)),
      map((response) => response.siteContent),
    );
  }

  /** Drops the draft; harmless when there is none (L2-REQ-121 AC5). */
  discard(): Observable<SiteContent> {
    return this.api.delete<SiteContentDraft>('/site-content/draft').pipe(
      tap(() => this.draftState.set(false)),
      map((response) => response.siteContent),
    );
  }

  /** A token valid for the next hour (L2-REQ-125 AC1). */
  previewToken(): Observable<PreviewToken> {
    return this.api.post<PreviewToken>('/site-content/preview-token', {});
  }
}
