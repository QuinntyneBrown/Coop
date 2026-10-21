import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The name and role column in the sidebar footer.
 * Design system: `docs/design-system/components/sidebar.html`.
 *
 * Usage: `<div libSidebarUser>…</div>`
 */
@Component({
  selector: 'div[libSidebarUser]',
  standalone: true,
  templateUrl: './sidebar-user.component.html',
  styleUrl: './sidebar-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar__user',
  },
})
export class SidebarUserComponent {}
