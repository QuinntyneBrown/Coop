import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, of } from 'rxjs';
import { PageService } from '../../core/services/page.service';
import type { WebsitePage } from '../../core/models/website-page';
import { SITE_CONTENT } from '../site-content';

/**
 * The site header shared by the home page and the website pages: brand, the
 * home page section links followed by one link per website page
 * (L2-REQ-082), Member sign in, and the phone menu (L2-REQ-066, L2-REQ-067).
 */
@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closeMenu()' },
})
export class SiteHeaderComponent implements OnInit {
  private readonly pageService = inject(PageService);
  private readonly router = inject(Router);
  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');

  readonly content = SITE_CONTENT;
  readonly pages = signal<WebsitePage[]>([]);
  readonly menuOpen = signal(false);
  /** The header is created per page, so the home check is taken once. */
  readonly isHome = this.router.url.split(/[?#]/)[0] === '/';

  ngOnInit(): void {
    this.pageService
      .getAll()
      .pipe(catchError(() => of([] as WebsitePage[])))
      .subscribe((pages) => this.pages.set(pages));
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
