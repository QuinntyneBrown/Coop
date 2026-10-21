import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Decorative dots for the steps of a wizard, then the "Step N of M" text the app projects.
 * Design system: `docs/design-system/components/step-indicator.html`.
 *
 * Usage: `<p libStepIndicator [current]="step" [total]="3"><span>Step {{ step }} of 3</span></p>`
 */
@Component({
  selector: 'p[libStepIndicator]',
  standalone: true,
  templateUrl: './step-indicator.component.html',
  styleUrl: './step-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'steps',
  },
})
export class StepIndicatorComponent {
  readonly current = input.required<number>();
  readonly total = input.required<number>();
  readonly steps = computed(() => Array.from({ length: this.total() }, (_, i) => i + 1));
}
