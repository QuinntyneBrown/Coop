import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LanguageService } from '../../core/services/language.service';
import { PageService } from '../../core/services/page.service';
import { translate } from '../../core/language/translate';
import type { WebsitePage } from '../../core/models/website-page';
import { SiteFooterComponent } from '../../layout/site-footer/site-footer.component';
import { SiteHeaderComponent } from '../../layout/site-header/site-header.component';
import { SiteContentService } from '../../core/services/site-content.service';
import { showPhotoUnavailable } from '../../core/site-content/show-photo-unavailable';
import { SiteLinkDirective } from '../../core/site-content/site-link.directive';
import type { ContentPageState } from './content-page-state';

/**
 * A website page the office added, at /pages/:slug, drawn in
 * docs/mocks/pages/public-page/ (states default, loading, error, not-found):
 * the banner, then the body blocks in order by kind (L2-REQ-123 AC6), in
 * the visitor's language with the English where the French is missing
 * (L2-REQ-131).
 */
@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent, SiteLinkDirective],
  templateUrl: './content-page.component.html',
  styleUrl: './content-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly pageService = inject(PageService);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);
  private readonly siteContent = inject(SiteContentService).content;
  private readonly language = inject(LanguageService);

  readonly labels = this.language.labels;

  readonly showPhotoUnavailable = showPhotoUnavailable;

  readonly state = signal<ContentPageState>('loading');
  private readonly loaded = signal<WebsitePage | null>(null);
  readonly page = computed(() => translate(this.loaded(), this.language.language()));
  private slug = '';

  constructor() {
    // The tab's title follows the state and the language.
    effect(() => {
      const labels = this.labels();
      const prefix = {
        loading: labels.pageLoading,
        ready: this.page()?.title ?? '',
        error: labels.pageError,
        'not-found': labels.pageNotFoundTitle,
      }[this.state()];
      this.title.setTitle(`${prefix} · ${this.siteContent().header.siteName}`);
    });

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.slug = params.get('slug') ?? '';
      this.load();
    });
  }

  load(): void {
    this.state.set('loading');
    this.pageService
      .getBySlug(this.slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.loaded.set(page);
          this.state.set('ready');
        },
        error: (error: unknown) => {
          const notFound = error instanceof HttpErrorResponse && error.status === 404;
          this.loaded.set(null);
          this.state.set(notFound ? 'not-found' : 'error');
        },
      });
  }
}
