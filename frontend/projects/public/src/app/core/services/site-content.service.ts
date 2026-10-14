import { Injectable, inject, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { mergeContent } from '../site-content/merge-content';
import { SITE_DEFAULTS } from '../site-content/site-defaults';
import type { SiteContent } from '../site-content/site-content';

/**
 * The header, footer and home page content (L2-REQ-094). The site content is
 * requested once, when the service is first used, and shared by every
 * component (L2-REQ-099 AC6); until it arrives, and when it cannot be loaded,
 * the built-in defaults show (L2-REQ-100).
 */
@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private readonly state = signal<SiteContent>(SITE_DEFAULTS);

  readonly content = this.state.asReadonly();

  constructor() {
    inject(ApiService)
      .get<{ siteContent?: unknown }>('site-content')
      .pipe(
        map((response) => mergeContent(SITE_DEFAULTS, response?.siteContent)),
        catchError(() => of(SITE_DEFAULTS)),
      )
      .subscribe((content) => this.state.set(content));
  }
}
