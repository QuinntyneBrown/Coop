// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { BoardMember, BoardMemberService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface BoardMemberStoreState {
  boardMembers?: BoardMember[],
  boardMember?: BoardMember
}

@Injectable({
  providedIn: "root"
})
export class BoardMemberStore extends ComponentStore<BoardMemberStoreState> {

  constructor(
    private readonly _boardMemberService: BoardMemberService
  ) {
    super({ })
  }

  public getBoardMembers() {
    return of(undefined)
    .pipe(
      tap(_ => this._getBoardMembers()),
      switchMap(_ => this.select(x => x.boardMembers))
    )
  }

  public getBoardMemberById(boardMemberId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getBoardMemberById(boardMemberId)),
      switchMap(_ => this.select(x => x.boardMember))
    );
  }

  private readonly _getBoardMembers = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.boardMembers).pipe(first())
      .pipe(
        switchMap(boardMembers => {
          if(boardMembers === undefined) {
            return this._boardMemberService.get()
            .pipe(
              tap(boardMembers => this.setState((state) => ({...state, boardMembers }))),
            );
          }
          return of(boardMembers);
        }),
      )),
      shareReplay(1)
    ));

  private _getBoardMemberById = this.effect<string>(boardMemberId$ =>
    boardMemberId$.pipe(
      switchMapByKey(boardMemberId => boardMemberId, boardMemberId => {
        return this.select(x => x.boardMember).pipe(first())
        .pipe(
          switchMap(boardMember => {
            if(boardMember?.boardMemberId == boardMemberId) {
              return of(boardMember);
            }
            return this._boardMemberService.getById({ boardMemberId })
            .pipe(
              tap((boardMember:BoardMember) => this.setState((state) => ({ ...state, boardMember })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createBoardMember = this.effect<BoardMember>(boardMember$ => boardMember$.pipe(
    mergeMap(boardMember => {
      return this._boardMemberService.create({ boardMember })
      .pipe(
        tap({
          next:({ boardMember }) => {
            this.setState((state) => ({...state, boardMember }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateBoardMember = this.effect<BoardMember>(boardMember$ => boardMember$.pipe(
    mergeMap(boardMember => {
      return this._boardMemberService.create({ boardMember })
      .pipe(
        tap({
          next: ({ boardMember }) => {
            this.setState((state) => ({...state, boardMember }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeBoardMember = this.effect<BoardMember>(boardMember$ => boardMember$.pipe(
    mergeMap(boardMember => {
      return this._boardMemberService.remove({ boardMember })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, boardMember: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

