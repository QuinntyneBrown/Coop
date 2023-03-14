// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { StoredEvent, StoredEventService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface StoredEventStoreState {
  storedEvents?: StoredEvent[],
  storedEvent?: StoredEvent
}

@Injectable({
  providedIn: "root"
})
export class StoredEventStore extends ComponentStore<StoredEventStoreState> {

  constructor(
    private readonly _storedEventService: StoredEventService
  ) {
    super({ })
  }

  public getStoredEvents() {
    return of(undefined)
    .pipe(
      tap(_ => this._getStoredEvents()),
      switchMap(_ => this.select(x => x.storedEvents))
    )
  }

  public getStoredEventById(storedEventId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getStoredEventById(storedEventId)),
      switchMap(_ => this.select(x => x.storedEvent))
    );
  }

  private readonly _getStoredEvents = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.storedEvents).pipe(first())
      .pipe(
        switchMap(storedEvents => {
          if(storedEvents === undefined) {
            return this._storedEventService.get()
            .pipe(
              tap(storedEvents => this.setState((state) => ({...state, storedEvents }))),
            );
          }
          return of(storedEvents);
        }),
      )),
      shareReplay(1)
    ));

  private _getStoredEventById = this.effect<string>(storedEventId$ =>
    storedEventId$.pipe(
      switchMapByKey(storedEventId => storedEventId, storedEventId => {
        return this.select(x => x.storedEvent).pipe(first())
        .pipe(
          switchMap(storedEvent => {
            if(storedEvent?.storedEventId == storedEventId) {
              return of(storedEvent);
            }
            return this._storedEventService.getById({ storedEventId })
            .pipe(
              tap((storedEvent:StoredEvent) => this.setState((state) => ({ ...state, storedEvent })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createStoredEvent = this.effect<StoredEvent>(storedEvent$ => storedEvent$.pipe(
    mergeMap(storedEvent => {
      return this._storedEventService.create({ storedEvent })
      .pipe(
        tap({
          next:({ storedEvent }) => {
            this.setState((state) => ({...state, storedEvent }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateStoredEvent = this.effect<StoredEvent>(storedEvent$ => storedEvent$.pipe(
    mergeMap(storedEvent => {
      return this._storedEventService.create({ storedEvent })
      .pipe(
        tap({
          next: ({ storedEvent }) => {
            this.setState((state) => ({...state, storedEvent }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeStoredEvent = this.effect<StoredEvent>(storedEvent$ => storedEvent$.pipe(
    mergeMap(storedEvent => {
      return this._storedEventService.remove({ storedEvent })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, storedEvent: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

