import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The logo and name at the top of the sidebar.
 * Design system: `docs/design-system/components/sidebar.html`.
 *
 * Usage: `<a libSidebarBrand routerLink="/dashboard">…</a>`
 */
@Component({
  selector: 'a[libSidebarBrand]',
  standalone: true,
  templateUrl: './sidebar-brand.component.html',
  styleUrl: './sidebar-brand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar__brand',
  },
})
export class SidebarBrandComponent {}
