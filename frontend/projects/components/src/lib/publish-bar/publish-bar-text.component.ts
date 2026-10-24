import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The sentence of the publish bar, with its icon.
 * Design system: `docs/design-system/components/publish-bar.html`.
 *
 * Usage: `<p libPublishBarText><svg libIcon="success"></svg><span>Everything is published. Visitors see what you see.</span></p>`
 */
@Component({
  selector: 'p[libPublishBarText]',
  standalone: true,
  templateUrl: './publish-bar-text.component.html',
  styleUrl: './publish-bar-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'publish-bar__text',
  },
})
export class PublishBarTextComponent {}
