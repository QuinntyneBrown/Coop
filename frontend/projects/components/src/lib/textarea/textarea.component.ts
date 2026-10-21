import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A multi-line text input. Angular forms bind to the host textarea as usual.
 * Design system: `docs/design-system/components/textarea.html`.
 *
 * Usage: `<textarea libTextarea id="x" rows="3" [(ngModel)]="text"></textarea>`
 */
@Component({
  selector: 'textarea[libTextarea]',
  standalone: true,
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'textarea',
  },
})
export class TextareaComponent {}
