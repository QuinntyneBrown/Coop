import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EntityDataSource } from '@shared';
import { NoticeService, Notice } from '@api';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticeListComponent implements OnDestroy {

  private readonly _destroyed$: Subject<void> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private readonly _pageIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly _pageSize$: BehaviorSubject<number> = new BehaviorSubject(5);
  private readonly _dataSource: EntityDataSource<Notice> = new EntityDataSource(this._noticeService);

  public readonly vm$: Observable<{
    dataSource: EntityDataSource<Notice>,
    columnsToDisplay: string[],
    length$: Observable<number>,
    pageNumber: number,
    pageSize: number
  }> = combineLatest([this._pageIndex$, this._pageSize$ ])
  .pipe(
    switchMap(([pageIndex,pageSize]) => combineLatest([
      of([
        'name',
        'edit'
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
    private readonly _noticeService: NoticeService,
    private readonly _dialog: MatDialog,
  ) { }

  public edit(notice: Notice) {

  }

  public create() {

  }

  public delete(notice: Notice) {    
    this._noticeService.remove({ notice }).pipe(
      takeUntil(this._destroyed$)
    ).subscribe();
  }
  
  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
