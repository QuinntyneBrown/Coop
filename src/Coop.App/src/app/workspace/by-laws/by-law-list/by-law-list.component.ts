import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EntityDataSource } from '@shared';
import { ByLawService, ByLaw, DocumentService } from '@api';
import { CreateDocumentPopupComponent } from '@shared/popups/create-document-popup/create-document-popup.component';
import { Destroyable } from '@core';
import { DocumentStore } from '@core/stores';

@Component({
  selector: 'app-by-law-list',
  templateUrl: './by-law-list.component.html',
  styleUrls: ['./by-law-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ByLawListComponent extends Destroyable {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private readonly _pageIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly _pageSize$: BehaviorSubject<number> = new BehaviorSubject(5);
  private readonly _dataSource: EntityDataSource<ByLaw> = new EntityDataSource(this._byLawService);
  private readonly _refresh$: BehaviorSubject<void> = new BehaviorSubject(null);

  public readonly vm$: Observable<{
    dataSource: EntityDataSource<ByLaw>,
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
    private readonly _byLawService: ByLawService,
    private readonly _documentService: DocumentService,
    private readonly _dialog: MatDialog,
    private readonly _documentStore: DocumentStore
  ) {
    super();
  }

  public edit(byLaw: ByLaw) {

  }

  public create() {
    this._dialog.open(CreateDocumentPopupComponent)
    .afterClosed()
    .pipe(
      switchMap(document => {
        if(document) {
          return this._byLawService.create(document)
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

  public delete(byLaw: ByLaw) {
    this._documentService.remove({ document: byLaw }).pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._refresh$.next())
    ).subscribe();
  }
}
