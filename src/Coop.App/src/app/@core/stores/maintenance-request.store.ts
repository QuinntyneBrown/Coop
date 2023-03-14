// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { MaintenanceRequest, MaintenanceRequestService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface MaintenanceRequestStoreState {
  maintenanceRequests?: MaintenanceRequest[],
  maintenanceRequest?: MaintenanceRequest
}

@Injectable({
  providedIn: "root"
})
export class MaintenanceRequestStore extends ComponentStore<MaintenanceRequestStoreState> {

  constructor(
    private readonly _maintenanceRequestService: MaintenanceRequestService
  ) {
    super({ })
  }

  public getMaintenanceRequests() {
    return of(undefined)
    .pipe(
      tap(_ => this._getMaintenanceRequests()),
      switchMap(_ => this.select(x => x.maintenanceRequests))
    )
  }

  public getMaintenanceRequestById(maintenanceRequestId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getMaintenanceRequestById(maintenanceRequestId)),
      switchMap(_ => this.select(x => x.maintenanceRequest))
    );
  }

  private readonly _getMaintenanceRequests = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.maintenanceRequests).pipe(first())
      .pipe(
        switchMap(maintenanceRequests => {
          if(maintenanceRequests === undefined) {
            return this._maintenanceRequestService.get()
            .pipe(
              tap(maintenanceRequests => this.setState((state) => ({...state, maintenanceRequests }))),
            );
          }
          return of(maintenanceRequests);
        }),
      )),
      shareReplay(1)
    ));

  private _getMaintenanceRequestById = this.effect<string>(maintenanceRequestId$ =>
    maintenanceRequestId$.pipe(
      switchMapByKey(maintenanceRequestId => maintenanceRequestId, maintenanceRequestId => {
        return this.select(x => x.maintenanceRequest).pipe(first())
        .pipe(
          switchMap(maintenanceRequest => {
            if(maintenanceRequest?.maintenanceRequestId == maintenanceRequestId) {
              return of(maintenanceRequest);
            }
            return this._maintenanceRequestService.getById({ maintenanceRequestId })
            .pipe(
              tap((maintenanceRequest:MaintenanceRequest) => this.setState((state) => ({ ...state, maintenanceRequest })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createMaintenanceRequest = this.effect<MaintenanceRequest>(maintenanceRequest$ => maintenanceRequest$.pipe(
    mergeMap(maintenanceRequest => {
      return this._maintenanceRequestService.create({ maintenanceRequest } as any)
      .pipe(
        tap({
          next:({ maintenanceRequest }) => {
            this.setState((state) => ({...state, maintenanceRequest }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateMaintenanceRequest = this.effect<MaintenanceRequest>(maintenanceRequest$ => maintenanceRequest$.pipe(
    mergeMap(maintenanceRequest => {
      return this._maintenanceRequestService.update({ maintenanceRequest } as any)
      .pipe(
        tap({
          next: ({ maintenanceRequest }) => {
            this.setState((state) => ({...state, maintenanceRequest }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeMaintenanceRequest = this.effect<MaintenanceRequest>(maintenanceRequest$ => maintenanceRequest$.pipe(
    mergeMap(maintenanceRequest => {
      return this._maintenanceRequestService.remove({ maintenanceRequest })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, maintenanceRequest: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

