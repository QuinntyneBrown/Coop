import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * One section in the list; `hiddenSection` strikes it through with its badge (the native `hidden` would hide the row), `fixed` draws a bullet instead of a number.
 * Design system: `docs/design-system/components/section-list.html`.
 *
 * Usage: `<li libSectionListItem hiddenSection>…</li>`
 */
@Component({
  selector: 'li[libSectionListItem]',
  standalone: true,
  templateUrl: './section-list-item.component.html',
  styleUrl: './section-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'section-list__item',
    '[class.section-list__item--hidden]': 'hiddenSection()',
    '[class.section-list__item--fixed]': 'fixed()',
  },
})
export class SectionListItemComponent {
  readonly hiddenSection = input(false, { transform: booleanAttribute });
  readonly fixed = input(false, { transform: booleanAttribute });
}
