import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { APP_TITLES } from './app-titles';

/** Sets the document title to "{screen} · OWN Housing Co-op Office" from the route's title (L2-REQ-118 AC5). */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const screen = this.buildTitle(snapshot);
    this.title.setTitle(screen ? `${screen} · ${APP_TITLES.suffix}` : APP_TITLES.suffix);
  }
}
