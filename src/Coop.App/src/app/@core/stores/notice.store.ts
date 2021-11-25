import { Injectable } from "@angular/core";
import { Notice, NoticeService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface NoticeStoreState {
  notices?: Notice[],
  notice?: Notice
}

@Injectable({
  providedIn: "root"
})
export class NoticeStore extends ComponentStore<NoticeStoreState> {

  constructor(
    private readonly _noticeService: NoticeService
  ) {
    super({ })
  }

  public getNotices() {
    return of(undefined)
    .pipe(
      tap(_ => this._getNotices()),
      switchMap(_ => this.select(x => x.notices))
    )
  }

  public getNoticeById(noticeId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getNoticeById(noticeId)),
      switchMap(_ => this.select(x => x.notice))
    );
  }

  private readonly _getNotices = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.notices).pipe(first())
      .pipe(
        switchMap(notices => {
          if(notices === undefined) {
            return this._noticeService.get()
            .pipe(
              tap(notices => this.setState((state) => ({...state, notices }))),
            );
          }
          return of(notices);
        }),
      )),
      shareReplay(1)
    ));

  private _getNoticeById = this.effect<string>(noticeId$ =>
    noticeId$.pipe(
      switchMapByKey(noticeId => noticeId, noticeId => {
        return this.select(x => x.notice).pipe(first())
        .pipe(
          switchMap(notice => {
            if(notice?.noticeId == noticeId) {
              return of(notice);
            }
            return this._noticeService.getById({ noticeId })
            .pipe(
              tap((notice:Notice) => this.setState((state) => ({ ...state, notice })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createNotice = this.effect<Notice>(notice$ => notice$.pipe(
    mergeMap(notice => {
      return this._noticeService.create({ notice })
      .pipe(
        tap({
          next:({ notice }) => {
            this.setState((state) => ({...state, notice }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateNotice = this.effect<Notice>(notice$ => notice$.pipe(
    mergeMap(notice => {
      return this._noticeService.create({ notice })
      .pipe(
        tap({
          next: ({ notice }) => {
            this.setState((state) => ({...state, notice }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeNotice = this.effect<Notice>(notice$ => notice$.pipe(
    mergeMap(notice => {
      return this._noticeService.remove({ notice })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, notice: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}
