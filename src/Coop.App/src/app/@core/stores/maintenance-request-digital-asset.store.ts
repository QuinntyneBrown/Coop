import { Injectable } from "@angular/core";
import { MaintenanceRequestDigitalAsset, MaintenanceRequestDigitalAssetService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface MaintenanceRequestDigitalAssetStoreState {
  maintenanceRequestDigitalAssets?: MaintenanceRequestDigitalAsset[],
  maintenanceRequestDigitalAsset?: MaintenanceRequestDigitalAsset
}

@Injectable({
  providedIn: "root"
})
export class MaintenanceRequestDigitalAssetStore extends ComponentStore<MaintenanceRequestDigitalAssetStoreState> {

  constructor(
    private readonly _maintenanceRequestDigitalAssetService: MaintenanceRequestDigitalAssetService
  ) {
    super({ })
  }

  public getMaintenanceRequestDigitalAssets() {
    return of(undefined)
    .pipe(
      tap(_ => this._getMaintenanceRequestDigitalAssets()),
      switchMap(_ => this.select(x => x.maintenanceRequestDigitalAssets))
    )
  }

  public getMaintenanceRequestDigitalAssetById(maintenanceRequestDigitalAssetId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getMaintenanceRequestDigitalAssetById(maintenanceRequestDigitalAssetId)),
      switchMap(_ => this.select(x => x.maintenanceRequestDigitalAsset))
    );
  }

  private readonly _getMaintenanceRequestDigitalAssets = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.maintenanceRequestDigitalAssets).pipe(first())
      .pipe(
        switchMap(maintenanceRequestDigitalAssets => {
          if(maintenanceRequestDigitalAssets === undefined) {
            return this._maintenanceRequestDigitalAssetService.get()
            .pipe(
              tap(maintenanceRequestDigitalAssets => this.setState((state) => ({...state, maintenanceRequestDigitalAssets }))),
            );
          }
          return of(maintenanceRequestDigitalAssets);
        }),
      )),
      shareReplay(1)
    ));

  private _getMaintenanceRequestDigitalAssetById = this.effect<string>(maintenanceRequestDigitalAssetId$ =>
    maintenanceRequestDigitalAssetId$.pipe(
      switchMapByKey(maintenanceRequestDigitalAssetId => maintenanceRequestDigitalAssetId, maintenanceRequestDigitalAssetId => {
        return this.select(x => x.maintenanceRequestDigitalAsset).pipe(first())
        .pipe(
          switchMap(maintenanceRequestDigitalAsset => {
            if(maintenanceRequestDigitalAsset?.maintenanceRequestDigitalAssetId == maintenanceRequestDigitalAssetId) {
              return of(maintenanceRequestDigitalAsset);
            }
            return this._maintenanceRequestDigitalAssetService.getById({ maintenanceRequestDigitalAssetId })
            .pipe(
              tap((maintenanceRequestDigitalAsset:MaintenanceRequestDigitalAsset) => this.setState((state) => ({ ...state, maintenanceRequestDigitalAsset })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createMaintenanceRequestDigitalAsset = this.effect<MaintenanceRequestDigitalAsset>(maintenanceRequestDigitalAsset$ => maintenanceRequestDigitalAsset$.pipe(
    mergeMap(maintenanceRequestDigitalAsset => {
      return this._maintenanceRequestDigitalAssetService.create({ maintenanceRequestDigitalAsset })
      .pipe(
        tap({
          next:({ maintenanceRequestDigitalAsset }) => {
            this.setState((state) => ({...state, maintenanceRequestDigitalAsset }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateMaintenanceRequestDigitalAsset = this.effect<MaintenanceRequestDigitalAsset>(maintenanceRequestDigitalAsset$ => maintenanceRequestDigitalAsset$.pipe(
    mergeMap(maintenanceRequestDigitalAsset => {
      return this._maintenanceRequestDigitalAssetService.create({ maintenanceRequestDigitalAsset })
      .pipe(
        tap({
          next: ({ maintenanceRequestDigitalAsset }) => {
            this.setState((state) => ({...state, maintenanceRequestDigitalAsset }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeMaintenanceRequestDigitalAsset = this.effect<MaintenanceRequestDigitalAsset>(maintenanceRequestDigitalAsset$ => maintenanceRequestDigitalAsset$.pipe(
    mergeMap(maintenanceRequestDigitalAsset => {
      return this._maintenanceRequestDigitalAssetService.remove({ maintenanceRequestDigitalAsset })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, maintenanceRequestDigitalAsset: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}
