import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * One picture with its note.
 * Design system: `docs/design-system/components/picture-list.html`.
 *
 * Usage: `<li libPictureListItem>…</li>`
 */
@Component({
  selector: 'li[libPictureListItem]',
  standalone: true,
  templateUrl: './picture-list-item.component.html',
  styleUrl: './picture-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'picture-list__item',
  },
})
export class PictureListItemComponent {}
