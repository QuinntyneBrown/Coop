import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarSize } from './avatar-size';

/**
 * A person's initial, icon or picture in a circle.
 * Design system: `docs/design-system/components/avatar.html`.
 *
 * Usage: `<span libAvatar size="sm" aria-hidden="true">R</span>`
 */
@Component({
  selector: 'span[libAvatar], img[libAvatar]',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'avatar',
    '[class.avatar--sm]': "size() === 'sm'",
    '[class.avatar--lg]': "size() === 'lg'",
    '[class.avatar--xl]': "size() === 'xl'",
  },
})
export class AvatarComponent {
  readonly size = input<AvatarSize>('md');
}
