import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ThemeService, User } from '@api';
import { AuthService } from '@core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppContextService } from './app-context.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    AppContextService
  ]
})
export class AppComponent {
  public vm$ = combineLatest([
    this._authService.tryToInitializeCurrentUser(),
    this._themeService.getDefault()
  ])
  .pipe(
    tap(([_, theme]) => {
      for (const [key, value] of Object.entries(theme.cssCustomProperties)) {
        this._htmlElementStyle.setProperty(key, value as string);
      }
    }),
    map(([user]) => ({ user }))
  );

  private get _htmlElementStyle(): CSSStyleDeclaration {
    return this._document.querySelector("html").style;
  }

  public currentUser$: Observable<User> = this._authService.currentUser$;

  constructor(
    private readonly _authService: AuthService,
    private readonly _themeService: ThemeService,
    @Inject(DOCUMENT) private readonly _document: Document
    ) {

    }
}
