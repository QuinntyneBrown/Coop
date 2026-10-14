import { Directive, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { linkTarget } from './link-target';
import type { SiteLink } from './site-link';

/**
 * Completes a published link on an anchor that binds its `href` (L2-REQ-098):
 * `rel="noopener noreferrer"` for another website, and in-app navigation for
 * a site path without a section, so the page does not reload.
 */
@Directive({
  selector: 'a[appSiteLink]',
  standalone: true,
  host: {
    '[attr.rel]': "target().external ? 'noopener noreferrer' : null",
    '(click)': 'navigate($event)',
  },
})
export class SiteLinkDirective {
  private readonly router = inject(Router);

  readonly link = input.required<SiteLink>({ alias: 'appSiteLink' });
  readonly target = computed(() => linkTarget(this.link().href));

  navigate(event: MouseEvent): void {
    const route = this.target().route;
    if (
      !route ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    void this.router.navigateByUrl(route);
  }
}
