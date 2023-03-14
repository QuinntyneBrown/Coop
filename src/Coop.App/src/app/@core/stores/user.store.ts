// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { User, UserService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface UserStoreState {
  users?: User[],
  user?: User
}

@Injectable({
  providedIn: "root"
})
export class UserStore extends ComponentStore<UserStoreState> {

  constructor(
    private readonly _userService: UserService
  ) {
    super({ })
  }

  public getUsers() {
    return of(undefined)
    .pipe(
      tap(_ => this._getUsers()),
      switchMap(_ => this.select(x => x.users))
    )
  }

  public getUserById(userId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getUserById(userId)),
      switchMap(_ => this.select(x => x.user))
    );
  }

  private readonly _getUsers = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.users).pipe(first())
      .pipe(
        switchMap(users => {
          if(users === undefined) {
            return this._userService.get()
            .pipe(
              tap(users => this.setState((state) => ({...state, users }))),
            );
          }
          return of(users);
        }),
      )),
      shareReplay(1)
    ));

  private _getUserById = this.effect<string>(userId$ =>
    userId$.pipe(
      switchMapByKey(userId => userId, userId => {
        return this.select(x => x.user).pipe(first())
        .pipe(
          switchMap(user => {
            if(user?.userId == userId) {
              return of(user);
            }
            return this._userService.getById({ userId })
            .pipe(
              tap((user:User) => this.setState((state) => ({ ...state, user })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createUser = this.effect<User>(user$ => user$.pipe(
    mergeMap(user => {
      return this._userService.create({ user })
      .pipe(
        tap({
          next:({ user }) => {
            this.setState((state) => ({...state, user }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateUser = this.effect<User>(user$ => user$.pipe(
    mergeMap(user => {
      return this._userService.create({ user })
      .pipe(
        tap({
          next: ({ user }) => {
            this.setState((state) => ({...state, user }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeUser = this.effect<User>(user$ => user$.pipe(
    mergeMap(user => {
      return this._userService.remove({ user })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, user: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

