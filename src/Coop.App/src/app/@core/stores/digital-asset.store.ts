import { Injectable } from "@angular/core";
import { DigitalAsset, DigitalAssetService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface DigitalAssetStoreState {
  digitalAssets?: DigitalAsset[],
  digitalAsset?: DigitalAsset
}

@Injectable({
  providedIn: "root"
})
export class DigitalAssetStore extends ComponentStore<DigitalAssetStoreState> {

  constructor(
    private readonly _digitalAssetService: DigitalAssetService
  ) {
    super({ })
  }

  public getDigitalAssets() {
    return of(undefined)
    .pipe(
      tap(_ => this._getDigitalAssets()),
      switchMap(_ => this.select(x => x.digitalAssets))
    )
  }

  public getDigitalAssetById(digitalAssetId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getDigitalAssetById(digitalAssetId)),
      switchMap(_ => this.select(x => x.digitalAsset))
    );
  }

  private readonly _getDigitalAssets = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.digitalAssets).pipe(first())
      .pipe(
        switchMap(digitalAssets => {
          if(digitalAssets === undefined) {
            return this._digitalAssetService.get()
            .pipe(
              tap(digitalAssets => this.setState((state) => ({...state, digitalAssets }))),
            );
          }
          return of(digitalAssets);
        }),
      )),
      shareReplay(1)
    ));

  private _getDigitalAssetById = this.effect<string>(digitalAssetId$ =>
    digitalAssetId$.pipe(
      switchMapByKey(digitalAssetId => digitalAssetId, digitalAssetId => {
        return this.select(x => x.digitalAsset).pipe(first())
        .pipe(
          switchMap(digitalAsset => {
            if(digitalAsset?.digitalAssetId == digitalAssetId) {
              return of(digitalAsset);
            }
            return this._digitalAssetService.getById({ digitalAssetId })
            .pipe(
              tap((digitalAsset:DigitalAsset) => this.setState((state) => ({ ...state, digitalAsset })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createDigitalAsset = this.effect<DigitalAsset>(digitalAsset$ => digitalAsset$.pipe(
    mergeMap(digitalAsset => {
      return this._digitalAssetService.create({ digitalAsset })
      .pipe(
        tap({
          next:({ digitalAsset }) => {
            this.setState((state) => ({...state, digitalAsset }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateDigitalAsset = this.effect<DigitalAsset>(digitalAsset$ => digitalAsset$.pipe(
    mergeMap(digitalAsset => {
      return this._digitalAssetService.create({ digitalAsset })
      .pipe(
        tap({
          next: ({ digitalAsset }) => {
            this.setState((state) => ({...state, digitalAsset }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeDigitalAsset = this.effect<DigitalAsset>(digitalAsset$ => digitalAsset$.pipe(
    mergeMap(digitalAsset => {
      return this._digitalAssetService.remove({ digitalAsset })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, digitalAsset: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}
