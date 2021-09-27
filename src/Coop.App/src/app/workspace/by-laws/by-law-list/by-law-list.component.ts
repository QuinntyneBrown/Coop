import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EntityDataSource } from '@shared';
import { ByLawService, ByLaw } from '@api';

@Component({
  selector: 'app-by-law-list',
  templateUrl: './by-law-list.component.html',
  styleUrls: ['./by-law-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ByLawListComponent implements OnDestroy {

  private readonly _destroyed$: Subject<void> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private readonly _pageIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly _pageSize$: BehaviorSubject<number> = new BehaviorSubject(5);
  private readonly _dataSource: EntityDataSource<ByLaw> = new EntityDataSource(this._byLawService);

  public readonly vm$: Observable<{
    dataSource: EntityDataSource<ByLaw>,
    columnsToDisplay: string[],
    length$: Observable<number>,
    pageNumber: number,
    pageSize: number
  }> = combineLatest([this._pageIndex$, this._pageSize$ ])
  .pipe(
    switchMap(([pageIndex,pageSize]) => combineLatest([
      of([
        'name',
        'edit',
        'delete'
      ]),
      of(pageIndex),
      of(pageSize)
    ])
    .pipe(
      map(([columnsToDisplay, pageNumber, pageSize]) => {
        this._dataSource.getPage({ pageIndex, pageSize });
        return {
          dataSource: this._dataSource,
          columnsToDisplay,
          length$: this._dataSource.length$,
          pageSize,
          pageNumber
        }
      })
    ))
  );

  constructor(
    private readonly _byLawService: ByLawService,
    private readonly _dialog: MatDialog,
  ) { }

  public edit(byLaw: ByLaw) {

  }

  public create() {

  }

  public delete(byLaw: ByLaw) {
    this._byLawService.remove({ byLaw }).pipe(
      takeUntil(this._destroyed$)
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
