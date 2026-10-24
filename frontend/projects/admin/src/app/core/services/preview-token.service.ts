import { Injectable, inject, signal } from '@angular/core';
import { PUBLIC_SITE_URL } from '../public-site-url';
import { SiteContentService } from './site-content.service';

/**
 * Keeps one preview token for the Website screens and builds the public
 * site's preview address from it (L2-REQ-125 AC4, ADR 0019). A new token is
 * requested when none is held or the held one is within a minute of expiring.
 */
@Injectable({ providedIn: 'root' })
export class PreviewTokenService {
  private readonly siteContent = inject(SiteContentService);

  private readonly tokenState = signal<string | null>(null);
  private expiresOn = 0;

  /** The current token, or null until one arrives. */
  readonly token = this.tokenState.asReadonly();

  /** Asks for a token when the held one is missing or about to expire. */
  refresh(): void {
    if (this.tokenState() && this.expiresOn - Date.now() > 60_000) return;
    this.siteContent.previewToken().subscribe({
      next: (issued) => {
        this.expiresOn = Date.parse(issued.expiresOn);
        this.tokenState.set(issued.token);
      },
      error: () => this.tokenState.set(null),
    });
  }

  /** A public page in preview mode, at a section when given; the page itself until a token arrives. */
  address(anchor = '', path = '/'): string {
    const token = this.tokenState();
    const fragment = anchor ? `#${anchor}` : '';
    return token
      ? `${PUBLIC_SITE_URL}${path}?preview=${encodeURIComponent(token)}${fragment}`
      : `${PUBLIC_SITE_URL}${path}${fragment}`;
  }
}
