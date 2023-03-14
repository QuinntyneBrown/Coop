// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { ByLaw, ByLawService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface ByLawStoreState {
  byLaws?: ByLaw[],
  byLaw?: ByLaw
}

@Injectable({
  providedIn: "root"
})
export class ByLawStore extends ComponentStore<ByLawStoreState> {

  constructor(
    private readonly _byLawService: ByLawService
  ) {
    super({ })
  }

  public getByLaws() {
    return of(undefined)
    .pipe(
      tap(_ => this._getByLaws()),
      switchMap(_ => this.select(x => x.byLaws))
    )
  }

  public getByLawById(byLawId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getByLawById(byLawId)),
      switchMap(_ => this.select(x => x.byLaw))
    );
  }

  private readonly _getByLaws = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.byLaws).pipe(first())
      .pipe(
        switchMap(byLaws => {
          if(byLaws === undefined) {
            return this._byLawService.get()
            .pipe(
              tap(byLaws => this.setState((state) => ({...state, byLaws }))),
            );
          }
          return of(byLaws);
        }),
      )),
      shareReplay(1)
    ));

  private _getByLawById = this.effect<string>(byLawId$ =>
    byLawId$.pipe(
      switchMapByKey(byLawId => byLawId, byLawId => {
        return this.select(x => x.byLaw).pipe(first())
        .pipe(
          switchMap(byLaw => {
            if(byLaw?.byLawId == byLawId) {
              return of(byLaw);
            }
            return this._byLawService.getById({ byLawId })
            .pipe(
              tap((byLaw:ByLaw) => this.setState((state) => ({ ...state, byLaw })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createByLaw = this.effect<ByLaw>(byLaw$ => byLaw$.pipe(
    mergeMap(byLaw => {
      return this._byLawService.create({ byLaw })
      .pipe(
        tap({
          next:({ byLaw }) => {
            this.setState((state) => ({...state, byLaw }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateByLaw = this.effect<ByLaw>(byLaw$ => byLaw$.pipe(
    mergeMap(byLaw => {
      return this._byLawService.create({ byLaw })
      .pipe(
        tap({
          next: ({ byLaw }) => {
            this.setState((state) => ({...state, byLaw }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeByLaw = this.effect<ByLaw>(byLaw$ => byLaw$.pipe(
    mergeMap(byLaw => {
      return this._byLawService.remove({ byLaw })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, byLaw: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

