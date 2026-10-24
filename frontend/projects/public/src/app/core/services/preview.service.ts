import { Injectable, signal } from '@angular/core';
import type { PreviewMode } from './preview-mode';

/**
 * Preview mode (L2-REQ-125, ADR 0019): when the site is opened with
 * `?preview={token}` the token is kept for the whole visit and sent with the
 * site content and page requests, and a banner says the draft is showing.
 * When the API refuses the token the published content shows instead and
 * the banner says the link has expired.
 */
@Injectable({ providedIn: 'root' })
export class PreviewService {
  /** The token from the address, kept across in-app navigation; null for a visitor. */
  readonly token: string | null = new URLSearchParams(window.location.search).get('preview');

  private readonly state = signal<PreviewMode>(this.token ? 'preview' : 'none');

  readonly mode = this.state.asReadonly();

  /** Called when the API refuses the token: the published content shows from here on. */
  expire(): void {
    this.state.set('expired');
  }

  /** True while the token should be sent. */
  get active(): boolean {
    return this.token !== null && this.state() === 'preview';
  }
}
