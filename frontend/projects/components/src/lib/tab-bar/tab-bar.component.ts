import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The bottom tab bar on phones; hidden from 768px, where the sidebar takes over.
 * Design system: `docs/design-system/components/tab-bar.html`.
 *
 * Usage: `<nav libTabBar aria-label="Admin sections, phone"><a routerLink="/dashboard"><svg libIcon="home"></svg>Home</a></nav>`
 */
@Component({
  selector: 'nav[libTabBar]',
  standalone: true,
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tabbar',
  },
})
export class TabBarComponent {}
