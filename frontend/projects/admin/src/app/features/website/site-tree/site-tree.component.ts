import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  booleanAttribute,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IconComponent,
  LoadingComponent,
  SiteTreeComponent as LibSiteTreeComponent,
  SiteTreeGroupComponent,
  SiteTreeLinkComponent,
  SiteTreeListComponent,
  SpinnerComponent,
} from 'components';
import { APP_PATHS } from '../../../core/app-paths';
import { APP_TITLES } from '../../../core/app-titles';
import type { WebsitePage } from '../../../core/models/website-page';
import { PageService } from '../../../core/services/page.service';

type TreeStatus = 'loading' | 'ready' | 'error';

/**
 * The Website area's navigation in the shape of the public site (L2-REQ-118,
 * ADR 0020): Home, the pages with "Add a page", Menu and footer, Board of
 * directors, Photos and Look. Stays in the app because it loads the page
 * list and reads the path registry; it draws the library's site tree.
 */
@Component({
  selector: 'app-site-tree',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IconComponent,
    LoadingComponent,
    SpinnerComponent,
    LibSiteTreeComponent,
    SiteTreeGroupComponent,
    SiteTreeLinkComponent,
    SiteTreeListComponent,
  ],
  templateUrl: './site-tree.component.html',
  styleUrl: './site-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteTreeComponent implements OnInit {
  private readonly pageService = inject(PageService);

  /** Taller rows for the Website landing. */
  readonly cards = input(false, { transform: booleanAttribute });
  /** Tells the screen when the page list could not be loaded, so it can offer Try again. */
  readonly failed = output<boolean>();

  readonly paths = APP_PATHS;
  readonly titles = APP_TITLES;
  readonly pages = signal<WebsitePage[]>([]);
  readonly status = signal<TreeStatus>('loading');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.status.set('loading');
    this.failed.emit(false);
    this.pageService.getAll().subscribe({
      next: (pages) => {
        this.pages.set(pages);
        this.status.set('ready');
      },
      error: () => {
        this.pages.set([]);
        this.status.set('error');
        this.failed.emit(true);
      },
    });
  }
}
