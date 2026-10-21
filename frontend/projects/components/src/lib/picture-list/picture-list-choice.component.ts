import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A picture to choose, with its name; `aria-pressed` marks the current one.
 * Design system: `docs/design-system/components/picture-list.html`.
 *
 * Usage: `<button libPictureListChoice type="button" [attr.aria-pressed]="current">…</button>`
 */
@Component({
  selector: 'button[libPictureListChoice]',
  standalone: true,
  templateUrl: './picture-list-choice.component.html',
  styleUrl: './picture-list-choice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'picture-list__choice',
  },
})
export class PictureListChoiceComponent {}
