import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { JsonContentService } from '../../core/services/json-content.service';
import { ApiService } from '../../core/services/api.service';
import { LANDING_CONTENT } from './landing-content';
import type { HeroContent } from './hero-content';
import type { BoardMemberView } from './board-member-view';
import type { NoticeView } from './notice-view';
import { heroFrom } from './landing-view-model';

/**
 * The public home page, drawn in docs/mocks/pages/public-landing/ (states
 * `default` and `menu`). Default copy comes from LANDING_CONTENT; the hero,
 * board list and notices are overlaid with CMS content when the API returns it.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closeMenu()' },
})
export class LandingComponent implements OnInit {
  private readonly jsonContent = inject(JsonContentService);
  private readonly api = inject(ApiService);
  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');

  readonly content = LANDING_CONTENT;
  readonly hero = signal<HeroContent>(LANDING_CONTENT.hero);
  readonly boardMembers = signal<BoardMemberView[]>([]);
  readonly notices = signal<NoticeView[]>([]);
  readonly menuOpen = signal(false);

  ngOnInit(): void {
    this.jsonContent
      .getByName('Hero')
      .pipe(catchError(() => of(null)))
      .subscribe((hero) => this.hero.set(heroFrom(hero?.content, LANDING_CONTENT.hero)));
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.menuButton()?.nativeElement.focus();
  }
}
