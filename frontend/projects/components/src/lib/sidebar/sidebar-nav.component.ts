import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The column of section links in the sidebar.
 * Design system: `docs/design-system/components/sidebar.html`.
 *
 * Usage: `<nav libSidebarNav aria-label="Admin sections">…</nav>`
 */
@Component({
  selector: 'nav[libSidebarNav]',
  standalone: true,
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar__nav',
  },
})
export class SidebarNavComponent {}
