import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The signed-in person's name, cut short with an ellipsis.
 * Design system: `docs/design-system/components/sidebar.html`.
 *
 * Usage: `<span libSidebarUserName>admin</span>`
 */
@Component({
  selector: 'span[libSidebarUserName]',
  standalone: true,
  templateUrl: './sidebar-user-name.component.html',
  styleUrl: './sidebar-user-name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar__user-name',
  },
})
export class SidebarUserNameComponent {}
