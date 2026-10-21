import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The grid of square thumbnails.
 * Design system: `docs/design-system/components/picture-list.html`.
 *
 * Usage: `<ul libPictureListGrid aria-label="Photos">…</ul>`
 */
@Component({
  selector: 'ul[libPictureListGrid]',
  standalone: true,
  templateUrl: './picture-list-grid.component.html',
  styleUrl: './picture-list-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'picture-list__grid',
  },
})
export class PictureListGridComponent {}
