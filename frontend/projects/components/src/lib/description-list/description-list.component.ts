import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Terms and their values; `horizontal` puts them side by side from 40rem.
 * Design system: `docs/design-system/components/description-list.html`.
 *
 * Usage: `<dl libDescriptionList horizontal><dt>Phone</dt><dd>…</dd></dl>`
 */
@Component({
  selector: 'dl[libDescriptionList]',
  standalone: true,
  templateUrl: './description-list.component.html',
  styleUrl: './description-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dl',
    '[class.dl--horizontal]': 'horizontal()',
  },
})
export class DescriptionListComponent {
  readonly horizontal = input(false, { transform: booleanAttribute });
}
