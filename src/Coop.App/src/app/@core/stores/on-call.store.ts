// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { OnCall, OnCallService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface OnCallStoreState {
  onCalls?: OnCall[],
  onCall?: OnCall
}

@Injectable({
  providedIn: "root"
})
export class OnCallStore extends ComponentStore<OnCallStoreState> {

  constructor(
    private readonly _onCallService: OnCallService
  ) {
    super({ })
  }

  public getOnCalls() {
    return of(undefined)
    .pipe(
      tap(_ => this._getOnCalls()),
      switchMap(_ => this.select(x => x.onCalls))
    )
  }

  public getOnCallById(onCallId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getOnCallById(onCallId)),
      switchMap(_ => this.select(x => x.onCall))
    );
  }

  private readonly _getOnCalls = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.onCalls).pipe(first())
      .pipe(
        switchMap(onCalls => {
          if(onCalls === undefined) {
            return this._onCallService.get()
            .pipe(
              tap(onCalls => this.setState((state) => ({...state, onCalls }))),
            );
          }
          return of(onCalls);
        }),
      )),
      shareReplay(1)
    ));

  private _getOnCallById = this.effect<string>(onCallId$ =>
    onCallId$.pipe(
      switchMapByKey(onCallId => onCallId, onCallId => {
        return this.select(x => x.onCall).pipe(first())
        .pipe(
          switchMap(onCall => {
            if(onCall?.onCallId == onCallId) {
              return of(onCall);
            }
            return this._onCallService.getById({ onCallId })
            .pipe(
              tap((onCall:OnCall) => this.setState((state) => ({ ...state, onCall })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createOnCall = this.effect<OnCall>(onCall$ => onCall$.pipe(
    mergeMap(onCall => {
      return this._onCallService.create({ onCall })
      .pipe(
        tap({
          next:({ onCall }) => {
            this.setState((state) => ({...state, onCall }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateOnCall = this.effect<OnCall>(onCall$ => onCall$.pipe(
    mergeMap(onCall => {
      return this._onCallService.create({ onCall })
      .pipe(
        tap({
          next: ({ onCall }) => {
            this.setState((state) => ({...state, onCall }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeOnCall = this.effect<OnCall>(onCall$ => onCall$.pipe(
    mergeMap(onCall => {
      return this._onCallService.remove({ onCall })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, onCall: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

