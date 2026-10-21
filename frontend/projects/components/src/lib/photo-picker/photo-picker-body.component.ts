import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The name, help and buttons beside the photo.
 * Design system: `docs/design-system/components/photo-picker.html`.
 *
 * Usage: `<div libPhotoPickerBody>…</div>`
 */
@Component({
  selector: 'div[libPhotoPickerBody]',
  standalone: true,
  templateUrl: './photo-picker-body.component.html',
  styleUrl: './photo-picker-body.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'photo-picker__body',
  },
})
export class PhotoPickerBodyComponent {}
