import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EntityDataSource } from '@shared';
import { NoticeService, Notice, DocumentService } from '@api';
import { CreateDocumentPopupComponent } from '@shared/popups/create-document-popup/create-document-popup.component';

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
  private readonly _refresh$: BehaviorSubject<void> = new BehaviorSubject(null);

  public readonly vm$: Observable<{
    dataSource: EntityDataSource<Notice>,
    columnsToDisplay: string[],
    length$: Observable<number>,
    pageNumber: number,
    pageSize: number
  }> = combineLatest([this._pageIndex$, this._pageSize$, this._refresh$ ])
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
    private readonly _noticeService: NoticeService,
    private readonly _documentService: DocumentService,
    private readonly _dialog: MatDialog,
  ) { }

  public edit(notice: Notice) {

  }

  public create() {
    this._dialog.open(CreateDocumentPopupComponent)
    .afterClosed()
    .pipe(
      switchMap(document => {
        if(document) {
          return this._noticeService.create(document)
          .pipe(
            takeUntil(this._destroyed$),
            tap(_ => this._refresh$.next())
          )
        }

        return of(null);
      })
    )
    .subscribe();
  }

  public delete(notice: Notice) {
    this._documentService.remove({ document: notice }).pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._refresh$.next())
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
