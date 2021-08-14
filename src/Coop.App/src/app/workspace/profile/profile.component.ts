import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ByLawService, MaintenanceRequestService, NoticeService, ProfileService, ReportService, User } from '@api';
import { AuthService } from '@core';
import { CreateAMaintenaceRequestDialogComponent } from '@shared/create-a-maintenace-request-dialog/create-a-maintenace-request-dialog.component';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy {

  private readonly _destroyed$: Subject<void> = new Subject();

  private readonly _refresh$: BehaviorSubject<void> = new BehaviorSubject(null);

  public currentUser$: Observable<User> = this._authService.currentUser$;

  public vm$ = this._refresh$
  .pipe(
    switchMap(_ => combineLatest([
      this._profileService.getCurrent(),
      this._maintenanceRequestService.getMy(),
      this._noticeService.getPublished(),
      this._byLawService.getPublished(),
      this._reportService.getPublished()
    ])),
    map(([profile, maintenanceRequests, notices, byLaws, reports]) => {

      const avatarFormControl = new FormControl(profile.avatarDigitalAssetId,[]);

      avatarFormControl
      .valueChanges
      .pipe(takeUntil(this._destroyed$))
      .subscribe();

      Object.assign(profile, { fullname: `${profile.firstname} ${profile.lastname}`});

      return {
        avatarFormControl,
        profile,
        maintenanceRequests,
        notices,
        byLaws,
        reports
      }
    })
  );

  constructor(
    private readonly _authService: AuthService,
    private readonly _profileService: ProfileService,
    private readonly _noticeService: NoticeService,
    private readonly _maintenanceRequestService: MaintenanceRequestService,
    private readonly _byLawService: ByLawService,
    private readonly _reportService: ReportService,
    private readonly _dialog: MatDialog
  ) {

  }

  public handleCreateClick() {
    this._dialog.open<CreateAMaintenaceRequestDialogComponent>(CreateAMaintenaceRequestDialogComponent)
    .afterClosed()
    .subscribe(_ => this._refresh$.next());
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
