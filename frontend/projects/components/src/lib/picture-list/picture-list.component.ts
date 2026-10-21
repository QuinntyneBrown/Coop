import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A grid of pictures with what you can do with them.
 * Design system: `docs/design-system/components/picture-list.html`.
 *
 * Usage: `<div libPictureList>…</div>`
 */
@Component({
  selector: 'div[libPictureList]',
  standalone: true,
  templateUrl: './picture-list.component.html',
  styleUrl: './picture-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'picture-list',
  },
})
export class PictureListComponent {}
