// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { Profile, ProfileService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface ProfileStoreState {
  profiles?: Profile[],
  profile?: Profile
}

@Injectable({
  providedIn: "root"
})
export class ProfileStore extends ComponentStore<ProfileStoreState> {

  constructor(
    private readonly _profileService: ProfileService
  ) {
    super({ })
  }

  public getProfiles() {
    return of(undefined)
    .pipe(
      tap(_ => this._getProfiles()),
      switchMap(_ => this.select(x => x.profiles))
    )
  }

  public getProfileById(profileId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getProfileById(profileId)),
      switchMap(_ => this.select(x => x.profile))
    );
  }

  private readonly _getProfiles = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.profiles).pipe(first())
      .pipe(
        switchMap(profiles => {
          if(profiles === undefined) {
            return this._profileService.get()
            .pipe(
              tap(profiles => this.setState((state) => ({...state, profiles }))),
            );
          }
          return of(profiles);
        }),
      )),
      shareReplay(1)
    ));

  private _getProfileById = this.effect<string>(profileId$ =>
    profileId$.pipe(
      switchMapByKey(profileId => profileId, profileId => {
        return this.select(x => x.profile).pipe(first())
        .pipe(
          switchMap(profile => {
            if(profile?.profileId == profileId) {
              return of(profile);
            }
            return this._profileService.getById({ profileId })
            .pipe(
              tap((profile:Profile) => this.setState((state) => ({ ...state, profile })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createProfile = this.effect<Profile>(profile$ => profile$.pipe(
    mergeMap(profile => {
      return this._profileService.create(profile as any)
      .pipe(
        tap({
          next:({ profile }) => {
            this.setState((state) => ({...state, profile }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateProfile = this.effect<Profile>(profile$ => profile$.pipe(
    mergeMap(profile => {
      return this._profileService.update({ profile })
      .pipe(
        tap({
          next: ({ profile }) => {
            this.setState((state) => ({...state, profile }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeProfile = this.effect<Profile>(profile$ => profile$.pipe(
    mergeMap(profile => {
      return this._profileService.remove({ profile })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, profile: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

