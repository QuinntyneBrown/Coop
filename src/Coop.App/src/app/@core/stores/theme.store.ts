import { Injectable } from "@angular/core";
import { Theme, ThemeService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface ThemeStoreState {
  themes?: Theme[],
  theme?: Theme
}

@Injectable({
  providedIn: "root"
})
export class ThemeStore extends ComponentStore<ThemeStoreState> {

  constructor(
    private readonly _themeService: ThemeService
  ) {
    super({ })
  }

  public getThemes() {
    return of(undefined)
    .pipe(
      tap(_ => this._getThemes()),
      switchMap(_ => this.select(x => x.themes))
    )
  }

  public getThemeById(themeId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getThemeById(themeId)),
      switchMap(_ => this.select(x => x.theme))
    );
  }

  private readonly _getThemes = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.themes).pipe(first())
      .pipe(
        switchMap(themes => {
          if(themes === undefined) {
            return this._themeService.get()
            .pipe(
              tap(themes => this.setState((state) => ({...state, themes }))),
            );
          }
          return of(themes);
        }),
      )),
      shareReplay(1)
    ));

  private _getThemeById = this.effect<string>(themeId$ =>
    themeId$.pipe(
      switchMapByKey(themeId => themeId, themeId => {
        return this.select(x => x.theme).pipe(first())
        .pipe(
          switchMap(theme => {
            if(theme?.themeId == themeId) {
              return of(theme);
            }
            return this._themeService.getById({ themeId })
            .pipe(
              tap((theme:Theme) => this.setState((state) => ({ ...state, theme })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createTheme = this.effect<Theme>(theme$ => theme$.pipe(
    mergeMap(theme => {
      return this._themeService.create({ theme })
      .pipe(
        tap({
          next:({ theme }) => {
            this.setState((state) => ({...state, theme }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateTheme = this.effect<Theme>(theme$ => theme$.pipe(
    mergeMap(theme => {
      return this._themeService.create({ theme })
      .pipe(
        tap({
          next: ({ theme }) => {
            this.setState((state) => ({...state, theme }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeTheme = this.effect<Theme>(theme$ => theme$.pipe(
    mergeMap(theme => {
      return this._themeService.remove({ theme })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, theme: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}
