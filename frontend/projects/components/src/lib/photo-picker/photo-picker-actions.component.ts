import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Choose and Remove buttons of a photo picker.
 * Design system: `docs/design-system/components/photo-picker.html`.
 *
 * Usage: `<div libPhotoPickerActions>…</div>`
 */
@Component({
  selector: 'div[libPhotoPickerActions]',
  standalone: true,
  templateUrl: './photo-picker-actions.component.html',
  styleUrl: './photo-picker-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'photo-picker__actions',
  },
})
export class PhotoPickerActionsComponent {}
