import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A picture that fills an avatar over its initial.
 * Design system: `docs/design-system/components/avatar.html`.
 *
 * Usage: `<img libAvatarImage [src]="photoUrl" alt="" />`
 */
@Component({
  selector: 'img[libAvatarImage]',
  standalone: true,
  templateUrl: './avatar-image.component.html',
  styleUrl: './avatar-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'avatar__img',
  },
})
export class AvatarImageComponent {}
