import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { JsonContentService } from '../../core/services/json-content.service';
import { ApiService } from '../../core/services/api.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { SiteLinkDirective } from '../../core/site-content/site-link.directive';
import { showPhotoUnavailable } from '../../core/site-content/show-photo-unavailable';
import { telHref } from '../../core/site-content/tel-href';
import { SiteFooterComponent } from '../../layout/site-footer/site-footer.component';
import { SiteHeaderComponent } from '../../layout/site-header/site-header.component';
import type { BoardMemberView } from './board-member-view';
import type { NoticeView } from './notice-view';
import { boardMembersFrom, boardMembersFromApi, noticeViewFrom } from './landing-view-model';

/**
 * The public home page, drawn in docs/mocks/pages/public-landing/ (states
 * `default` and `menu`). Every text, link and photograph is the published site
 * content (L2-REQ-092, L2-REQ-094) over the built-in defaults (L2-REQ-098); the
 * board list and notices come from their own CMS content.
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
  private readonly jsonContent = inject(JsonContentService);
  private readonly api = inject(ApiService);

  readonly content = inject(SiteContentService).content;
  readonly home = computed(() => this.content().home);
  readonly showPhotoUnavailable = showPhotoUnavailable;
  readonly telHref = telHref;
  /** Value-card colours follow position. */
  readonly valueTones = ['green', 'accent', 'plum'] as const;
  readonly boardMembers = signal<BoardMemberView[]>([]);
  readonly notices = signal<NoticeView[]>([]);

  ngOnInit(): void {
    this.jsonContent
      .getByName('BoardOfDirectors')
      .pipe(
        catchError(() => of(null)),
        switchMap((board) => {
          const members = boardMembersFrom(board?.content);
          return members.length > 0 ? of(members) : this.boardMembersFromApi();
        }),
      )
      .subscribe((members) => this.boardMembers.set(members));

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

  /** Published board member profiles: the BFF list first, then the profile endpoint the mock serves. */
  private boardMembersFromApi() {
    return this.api.get<unknown>('board-members').pipe(
      catchError(() => this.api.get<unknown>('boardmembers').pipe(catchError(() => of(null)))),
      switchMap((response) => of(boardMembersFromApi(response))),
    );
  }
}
