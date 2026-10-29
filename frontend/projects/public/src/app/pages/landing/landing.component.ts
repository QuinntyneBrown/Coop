import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { SiteLinkDirective } from '../../core/site-content/site-link.directive';
import { showPhotoUnavailable } from '../../core/site-content/show-photo-unavailable';
import { telHref } from '../../core/site-content/tel-href';
import { SiteFooterComponent } from '../../layout/site-footer/site-footer.component';
import { SiteHeaderComponent } from '../../layout/site-header/site-header.component';
import type { BoardMemberView } from './board-member-view';
import type { NoticeView } from './notice-view';
import { directorsFrom, noticeViewFrom } from './landing-view-model';

/**
 * The public home page, drawn in docs/mocks/pages/public-landing/ (states
 * `default`, `menu`, `hidden` and `reordered`). Every text, link and photograph
 * is the published site content (L2-REQ-094, L2-REQ-096) over the built-in
 * defaults (L2-REQ-100), rendered section by section in the published order
 * by kind (L2-REQ-122, ADR 0021); the directors come from the board list at
 * api/board-of-directors and the notices from the published notices.
 * The header (with the phone menu) and footer are the shared site components.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [SiteHeaderComponent, SiteFooterComponent, SiteLinkDirective],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly content = inject(SiteContentService).content;
  readonly labels = inject(LanguageService).labels;
  /** The home sections visitors see: the published order without the hidden ones (L2-REQ-122). */
  readonly sections = computed(() =>
    this.content().home.sections.filter((section) => !section.hidden),
  );
  readonly showPhotoUnavailable = showPhotoUnavailable;
  readonly telHref = telHref;
  /** Value-card colours follow position. */
  readonly valueTones = ['green', 'accent', 'plum'] as const;
  readonly boardMembers = signal<BoardMemberView[]>([]);
  readonly notices = signal<NoticeView[]>([]);

  ngOnInit(): void {
    // The board has one source: the board list (L2-REQ-124 AC6).
    this.api
      .get<unknown>('board-of-directors')
      .pipe(catchError(() => of(null)))
      .subscribe((response) => this.boardMembers.set(directorsFrom(response)));

    this.api
      .get<unknown>('notice/published')
      .pipe(catchError(() => of(null)))
      .subscribe((response) => {
        const list = Array.isArray(response)
          ? response
          : ((response as { notices?: unknown[] } | null)?.notices ?? []);
        this.notices.set(
          list.map(noticeViewFrom).filter((notice): notice is NoticeView => notice !== null),
        );
      });
  }
}
