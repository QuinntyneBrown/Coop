import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A square thumbnail; `aria-busy="true"` shows it loading.
 * Design system: `docs/design-system/components/picture-list.html`.
 *
 * Usage: `<div libPictureListThumb><img [src]="src" alt="" /></div>`
 */
@Component({
  selector: 'div[libPictureListThumb], span[libPictureListThumb], a[libPictureListThumb]',
  standalone: true,
  templateUrl: './picture-list-thumb.component.html',
  styleUrl: './picture-list-thumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'picture-list__thumb',
  },
})
export class PictureListThumbComponent {}
