import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The upload button under a picture list.
 * Design system: `docs/design-system/components/picture-list.html`.
 *
 * Usage: `<div libPictureListAdd><label libButton size="sm">Upload<input type="file" class="visually-hidden" /></label></div>`
 */
@Component({
  selector: 'div[libPictureListAdd]',
  standalone: true,
  templateUrl: './picture-list-add.component.html',
  styleUrl: './picture-list-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'picture-list__add',
  },
})
export class PictureListAddComponent {}
