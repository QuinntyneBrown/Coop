import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A photo beside its name and its Choose and Remove buttons.
 * Design system: `docs/design-system/components/photo-picker.html`.
 *
 * Usage: `<div libPhotoPicker>…</div>`
 */
@Component({
  selector: 'div[libPhotoPicker]',
  standalone: true,
  templateUrl: './photo-picker.component.html',
  styleUrl: './photo-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'photo-picker',
  },
})
export class PhotoPickerComponent {}
