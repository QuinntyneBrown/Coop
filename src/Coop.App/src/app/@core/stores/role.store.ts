// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { Role, RoleService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface RoleStoreState {
  roles?: Role[],
  role?: Role
}

@Injectable({
  providedIn: "root"
})
export class RoleStore extends ComponentStore<RoleStoreState> {

  constructor(
    private readonly _roleService: RoleService
  ) {
    super({ })
  }

  public getRoles() {
    return of(undefined)
    .pipe(
      tap(_ => this._getRoles()),
      switchMap(_ => this.select(x => x.roles))
    )
  }

  public getRoleById(roleId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getRoleById(roleId)),
      switchMap(_ => this.select(x => x.role))
    );
  }

  private readonly _getRoles = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.roles).pipe(first())
      .pipe(
        switchMap(roles => {
          if(roles === undefined) {
            return this._roleService.get()
            .pipe(
              tap(roles => this.setState((state) => ({...state, roles }))),
            );
          }
          return of(roles);
        }),
      )),
      shareReplay(1)
    ));

  private _getRoleById = this.effect<string>(roleId$ =>
    roleId$.pipe(
      switchMapByKey(roleId => roleId, roleId => {
        return this.select(x => x.role).pipe(first())
        .pipe(
          switchMap(role => {
            if(role?.roleId == roleId) {
              return of(role);
            }
            return this._roleService.getById({ roleId })
            .pipe(
              tap((role:Role) => this.setState((state) => ({ ...state, role })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createRole = this.effect<Role>(role$ => role$.pipe(
    mergeMap(role => {
      return this._roleService.create({ role })
      .pipe(
        tap({
          next:({ role }) => {
            this.setState((state) => ({...state, role }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateRole = this.effect<Role>(role$ => role$.pipe(
    mergeMap(role => {
      return this._roleService.create({ role })
      .pipe(
        tap({
          next: ({ role }) => {
            this.setState((state) => ({...state, role }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeRole = this.effect<Role>(role$ => role$.pipe(
    mergeMap(role => {
      return this._roleService.remove({ role })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, role: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

