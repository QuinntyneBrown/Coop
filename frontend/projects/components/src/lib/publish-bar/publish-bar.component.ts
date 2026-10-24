import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The bar on the Website screens that says whether there are unpublished changes, with Preview site, Publish and
 * Discard changes. `changes` gives it the warning fill.
 * Design system: `docs/design-system/components/publish-bar.html`.
 *
 * Usage: `<div libPublishBar [changes]="hasDraft()" role="status"><p libPublishBarText>…</p><div libPublishBarActions>…</div></div>`
 */
@Component({
  selector: 'div[libPublishBar]',
  standalone: true,
  templateUrl: './publish-bar.component.html',
  styleUrl: './publish-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'publish-bar',
    '[class.publish-bar--changes]': 'changes()',
  },
})
export class PublishBarComponent {
  readonly changes = input(false, { transform: booleanAttribute });
}
