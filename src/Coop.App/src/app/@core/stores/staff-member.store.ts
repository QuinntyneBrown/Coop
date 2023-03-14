// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { StaffMember, StaffMemberService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface StaffMemberStoreState {
  staffMembers?: StaffMember[],
  staffMember?: StaffMember
}

@Injectable({
  providedIn: "root"
})
export class StaffMemberStore extends ComponentStore<StaffMemberStoreState> {

  constructor(
    private readonly _staffMemberService: StaffMemberService
  ) {
    super({ })
  }

  public getStaffMembers() {
    return of(undefined)
    .pipe(
      tap(_ => this._getStaffMembers()),
      switchMap(_ => this.select(x => x.staffMembers))
    )
  }

  public getStaffMemberById(staffMemberId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getStaffMemberById(staffMemberId)),
      switchMap(_ => this.select(x => x.staffMember))
    );
  }

  private readonly _getStaffMembers = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.staffMembers).pipe(first())
      .pipe(
        switchMap(staffMembers => {
          if(staffMembers === undefined) {
            return this._staffMemberService.get()
            .pipe(
              tap(staffMembers => this.setState((state) => ({...state, staffMembers }))),
            );
          }
          return of(staffMembers);
        }),
      )),
      shareReplay(1)
    ));

  private _getStaffMemberById = this.effect<string>(staffMemberId$ =>
    staffMemberId$.pipe(
      switchMapByKey(staffMemberId => staffMemberId, staffMemberId => {
        return this.select(x => x.staffMember).pipe(first())
        .pipe(
          switchMap(staffMember => {
            if(staffMember?.staffMemberId == staffMemberId) {
              return of(staffMember);
            }
            return this._staffMemberService.getById({ staffMemberId })
            .pipe(
              tap((staffMember:StaffMember) => this.setState((state) => ({ ...state, staffMember })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createStaffMember = this.effect<StaffMember>(staffMember$ => staffMember$.pipe(
    mergeMap(staffMember => {
      return this._staffMemberService.create({ staffMember })
      .pipe(
        tap({
          next:({ staffMember }) => {
            this.setState((state) => ({...state, staffMember }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateStaffMember = this.effect<StaffMember>(staffMember$ => staffMember$.pipe(
    mergeMap(staffMember => {
      return this._staffMemberService.create({ staffMember })
      .pipe(
        tap({
          next: ({ staffMember }) => {
            this.setState((state) => ({...state, staffMember }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeStaffMember = this.effect<StaffMember>(staffMember$ => staffMember$.pipe(
    mergeMap(staffMember => {
      return this._staffMemberService.remove({ staffMember })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, staffMember: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

