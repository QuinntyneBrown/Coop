import { Injectable } from "@angular/core";
import { MaintenanceRequestComment, MaintenanceRequestCommentService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface MaintenanceRequestCommentStoreState {
  maintenanceRequestComments?: MaintenanceRequestComment[],
  maintenanceRequestComment?: MaintenanceRequestComment
}

@Injectable({
  providedIn: "root"
})
export class MaintenanceRequestCommentStore extends ComponentStore<MaintenanceRequestCommentStoreState> {

  constructor(
    private readonly _maintenanceRequestCommentService: MaintenanceRequestCommentService
  ) {
    super({ })
  }

  public getMaintenanceRequestComments() {
    return of(undefined)
    .pipe(
      tap(_ => this._getMaintenanceRequestComments()),
      switchMap(_ => this.select(x => x.maintenanceRequestComments))
    )
  }

  public getMaintenanceRequestCommentById(maintenanceRequestCommentId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getMaintenanceRequestCommentById(maintenanceRequestCommentId)),
      switchMap(_ => this.select(x => x.maintenanceRequestComment))
    );
  }

  private readonly _getMaintenanceRequestComments = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.maintenanceRequestComments).pipe(first())
      .pipe(
        switchMap(maintenanceRequestComments => {
          if(maintenanceRequestComments === undefined) {
            return this._maintenanceRequestCommentService.get()
            .pipe(
              tap(maintenanceRequestComments => this.setState((state) => ({...state, maintenanceRequestComments }))),
            );
          }
          return of(maintenanceRequestComments);
        }),
      )),
      shareReplay(1)
    ));

  private _getMaintenanceRequestCommentById = this.effect<string>(maintenanceRequestCommentId$ =>
    maintenanceRequestCommentId$.pipe(
      switchMapByKey(maintenanceRequestCommentId => maintenanceRequestCommentId, maintenanceRequestCommentId => {
        return this.select(x => x.maintenanceRequestComment).pipe(first())
        .pipe(
          switchMap(maintenanceRequestComment => {
            if(maintenanceRequestComment?.maintenanceRequestCommentId == maintenanceRequestCommentId) {
              return of(maintenanceRequestComment);
            }
            return this._maintenanceRequestCommentService.getById({ maintenanceRequestCommentId })
            .pipe(
              tap((maintenanceRequestComment:MaintenanceRequestComment) => this.setState((state) => ({ ...state, maintenanceRequestComment })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createMaintenanceRequestComment = this.effect<MaintenanceRequestComment>(maintenanceRequestComment$ => maintenanceRequestComment$.pipe(
    mergeMap(maintenanceRequestComment => {
      return this._maintenanceRequestCommentService.create({ maintenanceRequestComment })
      .pipe(
        tap({
          next:({ maintenanceRequestComment }) => {
            this.setState((state) => ({...state, maintenanceRequestComment }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateMaintenanceRequestComment = this.effect<MaintenanceRequestComment>(maintenanceRequestComment$ => maintenanceRequestComment$.pipe(
    mergeMap(maintenanceRequestComment => {
      return this._maintenanceRequestCommentService.create({ maintenanceRequestComment })
      .pipe(
        tap({
          next: ({ maintenanceRequestComment }) => {
            this.setState((state) => ({...state, maintenanceRequestComment }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeMaintenanceRequestComment = this.effect<MaintenanceRequestComment>(maintenanceRequestComment$ => maintenanceRequestComment$.pipe(
    mergeMap(maintenanceRequestComment => {
      return this._maintenanceRequestCommentService.remove({ maintenanceRequestComment })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, maintenanceRequestComment: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}
