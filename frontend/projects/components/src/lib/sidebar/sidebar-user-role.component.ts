import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The signed-in person's roles.
 * Design system: `docs/design-system/components/sidebar.html`.
 *
 * Usage: `<span libSidebarUserRole>System administrator</span>`
 */
@Component({
  selector: 'span[libSidebarUserRole]',
  standalone: true,
  templateUrl: './sidebar-user-role.component.html',
  styleUrl: './sidebar-user-role.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar__user-role',
  },
})
export class SidebarUserRoleComponent {}
