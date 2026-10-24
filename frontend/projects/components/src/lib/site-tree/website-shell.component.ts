import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The site tree beside a Website screen from 64rem, above it below.
 * Design system: `docs/design-system/components/site-tree.html`.
 *
 * Usage: `<div libWebsiteShell><nav libSiteTree>…</nav><div class="stack">…</div></div>`
 */
@Component({
  selector: 'div[libWebsiteShell]',
  standalone: true,
  templateUrl: './website-shell.component.html',
  styleUrl: './website-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'website-shell',
  },
})
export class WebsiteShellComponent {}
