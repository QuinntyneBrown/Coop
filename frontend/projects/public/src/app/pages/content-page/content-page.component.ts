import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PageService } from '../../core/services/page.service';
import type { WebsitePage } from '../../core/models/website-page';
import { SiteFooterComponent } from '../../layout/site-footer/site-footer.component';
import { SiteHeaderComponent } from '../../layout/site-header/site-header.component';
import { SITE_CONTENT } from '../../layout/site-content';
import type { ContentPageState } from './content-page-state';

/**
 * A website page the office added, at /pages/:slug, drawn in
 * docs/mocks/pages/public-page/ (states default, loading, error, not-found).
 */
@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './content-page.component.html',
  styleUrl: './content-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly pageService = inject(PageService);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);

  readonly state = signal<ContentPageState>('loading');
  readonly page = signal<WebsitePage | null>(null);
  private slug = '';

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.slug = params.get('slug') ?? '';
      this.load();
    });
  }

  load(): void {
    this.state.set('loading');
    this.setTitle('Loading…');
    this.pageService
      .getBySlug(this.slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.page.set(page);
          this.state.set('ready');
          this.setTitle(page.title);
        },
        error: (error: unknown) => {
          const notFound = error instanceof HttpErrorResponse && error.status === 404;
          this.page.set(null);
          this.state.set(notFound ? 'not-found' : 'error');
          this.setTitle(notFound ? 'Page not found' : 'Something went wrong');
        },
      });
  }

  private setTitle(prefix: string): void {
    this.title.setTitle(`${prefix} · ${SITE_CONTENT.siteName}`);
  }
}
