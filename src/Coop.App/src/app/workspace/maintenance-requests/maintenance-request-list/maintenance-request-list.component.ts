import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EntityDataSource } from '@shared';
import { MaintenanceRequestService, MaintenanceRequest } from '@api';
import { MaintenanceRequestReceivePopupComponent } from '@shared/popups/maintenance-request-receive-popup/maintenance-request-receive-popup.component';
import { MaintenanceRequestStartPopupComponent } from '@shared/popups/maintenance-request-start-popup/maintenance-request-start-popup.component';
import { MaintenanceRequestUpdatePopupComponent } from '@shared/popups/maintenance-request-update-popup/maintenance-request-update-popup.component';
import { MaintenanceRequestCompletePopupComponent } from '@shared/popups/maintenance-request-complete-popup/maintenance-request-complete-popup.component';
import { MaintenanceRequestStatus } from '@api/models/maintenance-request-status';

@Component({
  selector: 'app-maintenance-request-list',
  templateUrl: './maintenance-request-list.component.html',
  styleUrls: ['./maintenance-request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenanceRequestListComponent implements OnDestroy {

  private readonly _destroyed$: Subject<void> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private readonly _pageIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly _pageSize$: BehaviorSubject<number> = new BehaviorSubject(10);
  private readonly _dataSource: EntityDataSource<MaintenanceRequest> = new EntityDataSource(this._maintenanceRequestService);

  public MaintenanceRequestStatus: typeof MaintenanceRequestStatus = MaintenanceRequestStatus;

  public readonly vm$: Observable<{
    dataSource: EntityDataSource<MaintenanceRequest>,
    columnsToDisplay: string[],
    length$: Observable<number>,
    pageNumber: number,
    pageSize: number
  }> = combineLatest([this._pageIndex$, this._pageSize$ ])
  .pipe(
    switchMap(([pageIndex,pageSize]) => combineLatest([
      of([
        'date',
        'requestedByName',
        'unit',
        'status',
        'actions'
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
    private readonly _maintenanceRequestService: MaintenanceRequestService,
    private readonly _dialog: MatDialog
  ) { }

  public receive(maintenanceRequest: MaintenanceRequest) {
    this._dialog.open(MaintenanceRequestReceivePopupComponent, {
      data: maintenanceRequest,
      panelClass:"g-maintenance-request-popup-container",
    })
    .afterClosed()
    .subscribe();
  }

  public start(maintenanceRequest: MaintenanceRequest) {
    this._dialog.open(MaintenanceRequestStartPopupComponent, {
      data: maintenanceRequest,
      panelClass:"g-maintenance-request-popup-container"
    })
    .afterClosed()
    .subscribe();
  }

  public update(maintenanceRequest: MaintenanceRequest) {
    this._dialog.open(MaintenanceRequestUpdatePopupComponent, {
      data: maintenanceRequest,
      panelClass:"g-maintenance-request-popup-container"
    })
    .afterClosed()
    .subscribe();
  }

  public complete(maintenanceRequest: MaintenanceRequest) {
    this._dialog.open(MaintenanceRequestCompletePopupComponent, {
      data: maintenanceRequest,
      panelClass:"g-maintenance-request-popup-container"
    })
    .afterClosed()
    .subscribe();
  }


  public convertFromEnum(status: number) {
    let lookup = {
      "0": "New",
      "1": "Received"
    };
    return lookup[status];
  }

  public delete(maintenanceRequest: MaintenanceRequest) {
    this._maintenanceRequestService.remove({ maintenanceRequest }).pipe(
      takeUntil(this._destroyed$)
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
