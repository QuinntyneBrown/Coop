import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A small heading above a run of related sidebar links (Community, Operations, Access).
 * Design system: `docs/design-system/components/sidebar.html`.
 *
 * Usage: `<span libSidebarGroup>Community</span>`
 */
@Component({
  selector: 'span[libSidebarGroup]',
  standalone: true,
  templateUrl: './sidebar-group.component.html',
  styleUrl: './sidebar-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar__group',
  },
})
export class SidebarGroupComponent {}
