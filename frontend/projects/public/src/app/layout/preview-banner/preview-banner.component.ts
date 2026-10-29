import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { PreviewService } from '../../core/services/preview.service';

/**
 * The banner at the top of every public page in preview mode (L2-REQ-125 AC5,
 * AC6), drawn in docs/mocks/pages/public-landing/preview.html and
 * preview-expired.html. Nothing renders for a visitor.
 */
@Component({
  selector: 'app-preview-banner',
  standalone: true,
  templateUrl: './preview-banner.component.html',
  styleUrl: './preview-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewBannerComponent {
  readonly mode = inject(PreviewService).mode;
  readonly labels = inject(LanguageService).labels;
}
