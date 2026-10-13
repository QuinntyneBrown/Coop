import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../site-content';

/** The site footer shared by the home page and the website pages (L2-REQ-078, L2-REQ-079). */
@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {
  readonly content = SITE_CONTENT;
}
