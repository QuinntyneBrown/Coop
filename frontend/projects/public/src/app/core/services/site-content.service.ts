import { Injectable, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { PreviewService } from './preview.service';
import { mergeContent } from '../site-content/merge-content';
import { mergeHomeSections } from '../site-content/merge-home-sections';
import { SITE_DEFAULTS } from '../site-content/site-defaults';
import type { SiteContent } from '../site-content/site-content';

/**
 * The header, footer and home page content (L2-REQ-094). The site content is
 * requested once, when the service is first used, and shared by every
 * component (L2-REQ-099 AC6); until it arrives, and when it cannot be loaded,
 * the built-in defaults show (L2-REQ-100). In preview mode the draft is
 * requested with the token; when the API refuses the token the published
 * content is requested instead and the preview is marked expired (L2-REQ-125 AC6).
 */
@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private readonly api = inject(ApiService);
  private readonly preview = inject(PreviewService);
  private readonly state = signal<SiteContent>(SITE_DEFAULTS);

  readonly content = this.state.asReadonly();

  constructor() {
    this.request()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status !== 403 || !this.preview.active) return throwError(() => error);
          this.preview.expire();
          return this.request();
        }),
        map((response) => merge(response?.siteContent)),
        catchError(() => of(SITE_DEFAULTS)),
      )
      .subscribe((content) => this.state.set(content));
  }

  private request(): Observable<{ siteContent?: unknown } | null> {
    return of(null).pipe(switchMap(() => this.api.get<{ siteContent?: unknown }>('site-content')));
  }
}

/** The published content over the defaults: value by value, and the home sections in the published order. */
function merge(published: unknown): SiteContent {
  const content = mergeContent(SITE_DEFAULTS, published);
  const home = (published as { home?: { sections?: unknown } } | null | undefined)?.home;
  return {
    ...content,
    home: { sections: mergeHomeSections(SITE_DEFAULTS.home.sections, home?.sections) },
  };
}
