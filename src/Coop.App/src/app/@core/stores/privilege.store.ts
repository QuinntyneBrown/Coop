// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { Privilege, PrivilegeService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface PrivilegeStoreState {
  privileges?: Privilege[],
  privilege?: Privilege
}

@Injectable({
  providedIn: "root"
})
export class PrivilegeStore extends ComponentStore<PrivilegeStoreState> {

  constructor(
    private readonly _privilegeService: PrivilegeService
  ) {
    super({ })
  }

  public getPrivileges() {
    return of(undefined)
    .pipe(
      tap(_ => this._getPrivileges()),
      switchMap(_ => this.select(x => x.privileges))
    )
  }

  public getPrivilegeById(privilegeId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getPrivilegeById(privilegeId)),
      switchMap(_ => this.select(x => x.privilege))
    );
  }

  private readonly _getPrivileges = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.privileges).pipe(first())
      .pipe(
        switchMap(privileges => {
          if(privileges === undefined) {
            return this._privilegeService.get()
            .pipe(
              tap(privileges => this.setState((state) => ({...state, privileges }))),
            );
          }
          return of(privileges);
        }),
      )),
      shareReplay(1)
    ));

  private _getPrivilegeById = this.effect<string>(privilegeId$ =>
    privilegeId$.pipe(
      switchMapByKey(privilegeId => privilegeId, privilegeId => {
        return this.select(x => x.privilege).pipe(first())
        .pipe(
          switchMap(privilege => {
            if(privilege?.privilegeId == privilegeId) {
              return of(privilege);
            }
            return this._privilegeService.getById({ privilegeId })
            .pipe(
              tap((privilege:Privilege) => this.setState((state) => ({ ...state, privilege })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createPrivilege = this.effect<Privilege>(privilege$ => privilege$.pipe(
    mergeMap(privilege => {
      return this._privilegeService.create({ privilege })
      .pipe(
        tap({
          next:({ privilege }) => {
            this.setState((state) => ({...state, privilege }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updatePrivilege = this.effect<Privilege>(privilege$ => privilege$.pipe(
    mergeMap(privilege => {
      return this._privilegeService.create({ privilege })
      .pipe(
        tap({
          next: ({ privilege }) => {
            this.setState((state) => ({...state, privilege }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removePrivilege = this.effect<Privilege>(privilege$ => privilege$.pipe(
    mergeMap(privilege => {
      return this._privilegeService.remove({ privilege })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, privilege: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

