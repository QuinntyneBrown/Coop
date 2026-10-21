import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A navigation link in the top bar or the sidebar; `aria-current="page"` marks where you are.
 * Design system: `docs/design-system/components/sidebar.html`.
 *
 * Usage: `<a libNavLink routerLink="/login">Sign In</a>`
 */
@Component({
  selector: 'a[libNavLink]',
  standalone: true,
  templateUrl: './nav-link.component.html',
  styleUrl: './nav-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nav-link',
  },
})
export class NavLinkComponent {}
