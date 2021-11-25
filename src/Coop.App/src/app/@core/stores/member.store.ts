import { Injectable } from "@angular/core";
import { Member, MemberService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface MemberStoreState {
  members?: Member[],
  member?: Member
}

@Injectable({
  providedIn: "root"
})
export class MemberStore extends ComponentStore<MemberStoreState> {

  constructor(
    private readonly _memberService: MemberService
  ) {
    super({ })
  }

  public getMembers() {
    return of(undefined)
    .pipe(
      tap(_ => this._getMembers()),
      switchMap(_ => this.select(x => x.members))
    )
  }

  public getMemberById(memberId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getMemberById(memberId)),
      switchMap(_ => this.select(x => x.member))
    );
  }

  private readonly _getMembers = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.members).pipe(first())
      .pipe(
        switchMap(members => {
          if(members === undefined) {
            return this._memberService.get()
            .pipe(
              tap(members => this.setState((state) => ({...state, members }))),
            );
          }
          return of(members);
        }),
      )),
      shareReplay(1)
    ));

  private _getMemberById = this.effect<string>(memberId$ =>
    memberId$.pipe(
      switchMapByKey(memberId => memberId, memberId => {
        return this.select(x => x.member).pipe(first())
        .pipe(
          switchMap(member => {
            if(member?.memberId == memberId) {
              return of(member);
            }
            return this._memberService.getById({ memberId })
            .pipe(
              tap((member:Member) => this.setState((state) => ({ ...state, member })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createMember = this.effect<Member>(member$ => member$.pipe(
    mergeMap(member => {
      return this._memberService.create({ member })
      .pipe(
        tap({
          next:({ member }) => {
            this.setState((state) => ({...state, member }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateMember = this.effect<Member>(member$ => member$.pipe(
    mergeMap(member => {
      return this._memberService.create({ member })
      .pipe(
        tap({
          next: ({ member }) => {
            this.setState((state) => ({...state, member }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeMember = this.effect<Member>(member$ => member$.pipe(
    mergeMap(member => {
      return this._memberService.remove({ member })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, member: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}
