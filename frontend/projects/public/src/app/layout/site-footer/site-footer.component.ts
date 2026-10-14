import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SiteContentService } from '../../core/services/site-content.service';
import { SiteLinkDirective } from '../../core/site-content/site-link.directive';
import { telHref } from '../../core/site-content/tel-href';

/**
 * The site footer shared by the home page and the website pages (L2-REQ-078,
 * L2-REQ-079). Its headings, contact details, links and bottom line are the
 * published site content (L2-REQ-093).
 */
@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [SiteLinkDirective],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {
  readonly content = inject(SiteContentService).content;
  readonly telHref = telHref;
}
