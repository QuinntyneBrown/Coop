import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The action row of the publish bar.
 * Design system: `docs/design-system/components/publish-bar.html`.
 *
 * Usage: `<div libPublishBarActions><a libButton …>Preview site</a><button libButton variant="primary">Publish</button></div>`
 */
@Component({
  selector: 'div[libPublishBarActions]',
  standalone: true,
  templateUrl: './publish-bar-actions.component.html',
  styleUrl: './publish-bar-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'publish-bar__actions',
  },
})
export class PublishBarActionsComponent {}
