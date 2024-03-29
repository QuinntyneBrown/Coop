// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ByLawService, MaintenanceRequestService, NoticeService, ProfileService, ReportService, User } from '@api';
import { AuthService } from '@core';
import { CreateAMaintenaceRequestDialogComponent } from '@shared/create-a-maintenace-request-dialog/create-a-maintenace-request-dialog.component';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
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
      .pipe(
        takeUntil(this._destroyed$),
        switchMap(avatarDigitalAssetId => {
          return this._profileService.updateAvatar({
            profileId: profile.profileId,
            digitalAssetId: avatarDigitalAssetId
          })
        })
        )
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
    private readonly _dialog: MatDialog,
    private readonly _router: Router
  ) {

  }

  public handleSettingsClick() {
    this._router.navigate(['/','workspace','settings']);
  }

  public handleMessengerClick() {
    this._router.navigate(['/','workspace','messages']);
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

