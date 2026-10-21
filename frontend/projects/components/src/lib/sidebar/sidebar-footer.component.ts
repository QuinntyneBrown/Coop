import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The signed-in person at the foot of the sidebar.
 * Design system: `docs/design-system/components/sidebar.html`.
 *
 * Usage: `<div libSidebarFooter>…</div>`
 */
@Component({
  selector: 'div[libSidebarFooter]',
  standalone: true,
  templateUrl: './sidebar-footer.component.html',
  styleUrl: './sidebar-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar__footer',
  },
})
export class SidebarFooterComponent {}
