import { Injectable } from "@angular/core";
import { InvitationToken, InvitationTokenService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface InvitationTokenStoreState {
  invitationTokens?: InvitationToken[],
  invitationToken?: InvitationToken
}

@Injectable({
  providedIn: "root"
})
export class InvitationTokenStore extends ComponentStore<InvitationTokenStoreState> {

  constructor(
    private readonly _invitationTokenService: InvitationTokenService
  ) {
    super({ })
  }

  public getInvitationTokens() {
    return of(undefined)
    .pipe(
      tap(_ => this._getInvitationTokens()),
      switchMap(_ => this.select(x => x.invitationTokens))
    )
  }

  public getInvitationTokenById(invitationTokenId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getInvitationTokenById(invitationTokenId)),
      switchMap(_ => this.select(x => x.invitationToken))
    );
  }

  private readonly _getInvitationTokens = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.invitationTokens).pipe(first())
      .pipe(
        switchMap(invitationTokens => {
          if(invitationTokens === undefined) {
            return this._invitationTokenService.get()
            .pipe(
              tap(invitationTokens => this.setState((state) => ({...state, invitationTokens }))),
            );
          }
          return of(invitationTokens);
        }),
      )),
      shareReplay(1)
    ));

  private _getInvitationTokenById = this.effect<string>(invitationTokenId$ =>
    invitationTokenId$.pipe(
      switchMapByKey(invitationTokenId => invitationTokenId, invitationTokenId => {
        return this.select(x => x.invitationToken).pipe(first())
        .pipe(
          switchMap(invitationToken => {
            if(invitationToken?.invitationTokenId == invitationTokenId) {
              return of(invitationToken);
            }
            return this._invitationTokenService.getById({ invitationTokenId })
            .pipe(
              tap((invitationToken:InvitationToken) => this.setState((state) => ({ ...state, invitationToken })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createInvitationToken = this.effect<InvitationToken>(invitationToken$ => invitationToken$.pipe(
    mergeMap(invitationToken => {
      return this._invitationTokenService.create({ invitationToken })
      .pipe(
        tap({
          next:({ invitationToken }) => {
            this.setState((state) => ({...state, invitationToken }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateInvitationToken = this.effect<InvitationToken>(invitationToken$ => invitationToken$.pipe(
    mergeMap(invitationToken => {
      return this._invitationTokenService.create({ invitationToken })
      .pipe(
        tap({
          next: ({ invitationToken }) => {
            this.setState((state) => ({...state, invitationToken }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeInvitationToken = this.effect<InvitationToken>(invitationToken$ => invitationToken$.pipe(
    mergeMap(invitationToken => {
      return this._invitationTokenService.remove({ invitationToken })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, invitationToken: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}
