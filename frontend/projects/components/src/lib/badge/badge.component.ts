import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BadgeTone } from './badge-tone';

/**
 * A short status word with a dot, or an unread count.
 * Design system: `docs/design-system/components/badge.html`.
 *
 * Usage: `<span libBadge tone="success">Published</span>`
 */
@Component({
  selector: 'span[libBadge]',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'badge',
    '[class.badge--neutral]': "tone() === 'neutral'",
    '[class.badge--info]': "tone() === 'info'",
    '[class.badge--success]': "tone() === 'success'",
    '[class.badge--warning]': "tone() === 'warning'",
    '[class.badge--danger]': "tone() === 'danger'",
    '[class.badge--count]': 'count()',
  },
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>();
  readonly count = input(false, { transform: booleanAttribute });
}
