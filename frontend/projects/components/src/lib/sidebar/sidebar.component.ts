import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The admin's section navigation beside the content from 768px.
 * Design system: `docs/design-system/components/sidebar.html`.
 *
 * Usage: `<aside libSidebar aria-label="Admin">…</aside>`
 */
@Component({
  selector: 'aside[libSidebar]',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar',
  },
})
export class SidebarComponent {}
