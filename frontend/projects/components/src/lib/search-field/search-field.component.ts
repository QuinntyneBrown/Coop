import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A `search` landmark with a hidden label, a magnifier and a rounded search input.
 * Design system: `docs/design-system/components/search-field.html`.
 *
 * Usage: `<div libSearchField><label class="visually-hidden" for="q">Search users</label><svg libIcon="search"></svg><input libTextField id="q" type="search" /></div>`
 */
@Component({
  selector: 'div[libSearchField]',
  standalone: true,
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'search',
    role: 'search',
  },
})
export class SearchFieldComponent {}
