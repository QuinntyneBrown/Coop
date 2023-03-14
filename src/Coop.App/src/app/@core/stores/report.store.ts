// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { Report, ReportService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface ReportStoreState {
  reports?: Report[],
  report?: Report
}

@Injectable({
  providedIn: "root"
})
export class ReportStore extends ComponentStore<ReportStoreState> {

  constructor(
    private readonly _reportService: ReportService
  ) {
    super({ })
  }

  public getReports() {
    return of(undefined)
    .pipe(
      tap(_ => this._getReports()),
      switchMap(_ => this.select(x => x.reports))
    )
  }

  public getReportById(reportId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getReportById(reportId)),
      switchMap(_ => this.select(x => x.report))
    );
  }

  private readonly _getReports = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.reports).pipe(first())
      .pipe(
        switchMap(reports => {
          if(reports === undefined) {
            return this._reportService.get()
            .pipe(
              tap(reports => this.setState((state) => ({...state, reports }))),
            );
          }
          return of(reports);
        }),
      )),
      shareReplay(1)
    ));

  private _getReportById = this.effect<string>(reportId$ =>
    reportId$.pipe(
      switchMapByKey(reportId => reportId, reportId => {
        return this.select(x => x.report).pipe(first())
        .pipe(
          switchMap(report => {
            if(report?.reportId == reportId) {
              return of(report);
            }
            return this._reportService.getById({ reportId })
            .pipe(
              tap((report:Report) => this.setState((state) => ({ ...state, report })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createReport = this.effect<Report>(report$ => report$.pipe(
    mergeMap(report => {
      return this._reportService.create({ report })
      .pipe(
        tap({
          next:({ report }) => {
            this.setState((state) => ({...state, report }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateReport = this.effect<Report>(report$ => report$.pipe(
    mergeMap(report => {
      return this._reportService.create({ report })
      .pipe(
        tap({
          next: ({ report }) => {
            this.setState((state) => ({...state, report }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeReport = this.effect<Report>(report$ => report$.pipe(
    mergeMap(report => {
      return this._reportService.remove({ report })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, report: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

