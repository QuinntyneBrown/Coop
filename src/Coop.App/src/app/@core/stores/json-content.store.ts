// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { JsonContent, JsonContentService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface JsonContentStoreState {
  jsonContents?: JsonContent[],
  jsonContent?: JsonContent
}

@Injectable({
  providedIn: "root"
})
export class JsonContentStore extends ComponentStore<JsonContentStoreState> {

  constructor(
    private readonly _jsonContentService: JsonContentService
  ) {
    super({ })
  }

  public getJsonContents() {
    return of(undefined)
    .pipe(
      tap(_ => this._getJsonContents()),
      switchMap(_ => this.select(x => x.jsonContents))
    )
  }

  public getJsonContentById(jsonContentId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getJsonContentById(jsonContentId)),
      switchMap(_ => this.select(x => x.jsonContent))
    );
  }

  private readonly _getJsonContents = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.jsonContents).pipe(first())
      .pipe(
        switchMap(jsonContents => {
          if(jsonContents === undefined) {
            return this._jsonContentService.get()
            .pipe(
              tap(jsonContents => this.setState((state) => ({...state, jsonContents }))),
            );
          }
          return of(jsonContents);
        }),
      )),
      shareReplay(1)
    ));

  private _getJsonContentById = this.effect<string>(jsonContentId$ =>
    jsonContentId$.pipe(
      switchMapByKey(jsonContentId => jsonContentId, jsonContentId => {
        return this.select(x => x.jsonContent).pipe(first())
        .pipe(
          switchMap(jsonContent => {
            if(jsonContent?.jsonContentId == jsonContentId) {
              return of(jsonContent);
            }
            return this._jsonContentService.getById({ jsonContentId })
            .pipe(
              tap((jsonContent:JsonContent) => this.setState((state) => ({ ...state, jsonContent })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createJsonContent = this.effect<JsonContent>(jsonContent$ => jsonContent$.pipe(
    mergeMap(jsonContent => {
      return this._jsonContentService.create({ jsonContent })
      .pipe(
        tap({
          next:({ jsonContent }) => {
            this.setState((state) => ({...state, jsonContent }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateJsonContent = this.effect<JsonContent>(jsonContent$ => jsonContent$.pipe(
    mergeMap(jsonContent => {
      return this._jsonContentService.create({ jsonContent })
      .pipe(
        tap({
          next: ({ jsonContent }) => {
            this.setState((state) => ({...state, jsonContent }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeJsonContent = this.effect<JsonContent>(jsonContent$ => jsonContent$.pipe(
    mergeMap(jsonContent => {
      return this._jsonContentService.remove({ jsonContent })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, jsonContent: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

