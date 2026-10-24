import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A short trail above the page title that leads back up: "Website / Home". The app wraps it in
 * `<nav aria-label="Breadcrumb">` and marks the last item with `aria-current="page"`.
 * Design system: `docs/design-system/components/breadcrumb.html`.
 *
 * Usage: `<ol libBreadcrumb><li><a routerLink="/website">Website</a></li><li aria-current="page">Home</li></ol>`
 */
@Component({
  selector: 'ol[libBreadcrumb]',
  standalone: true,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'breadcrumb',
  },
})
export class BreadcrumbComponent {}
