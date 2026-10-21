import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A centred row with a spinner and what is loading. The app sets `role="status"`.
 * Design system: `docs/design-system/components/spinner.html`.
 *
 * Usage: `<div libLoading role="status"><span libSpinner></span>Loading pages…</div>`
 */
@Component({
  selector: 'div[libLoading]',
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'loading',
  },
})
export class LoadingComponent {}
