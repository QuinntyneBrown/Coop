import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { CssCustomPropertyService, HtmlContentService, ProfileCssCustomPropertyService, User } from '@api';
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
    this._cssCustomPropertyService.getSystem(),
    this._profileCssCustomPropertyService.getCurrent()
  ])
  .pipe(
    tap(([_, cssCustomProperties, profileCssCustomProperties]) => {
      for(let i = 0; i < cssCustomProperties.length; i++) {
        this._htmlElementStyle.setProperty(cssCustomProperties[i].name,cssCustomProperties[i].value);
      }

      if(profileCssCustomProperties) {
        for(let i = 0; i < profileCssCustomProperties.length; i++) {
          this._htmlElementStyle.setProperty(profileCssCustomProperties[i].name,profileCssCustomProperties[i].value);
        }
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
    private readonly _htmlContentService: HtmlContentService,
    private readonly _cssCustomPropertyService: CssCustomPropertyService,
    private readonly _profileCssCustomPropertyService: ProfileCssCustomPropertyService,
    @Inject(DOCUMENT) private readonly _document: Document
    ) {

    }
}
