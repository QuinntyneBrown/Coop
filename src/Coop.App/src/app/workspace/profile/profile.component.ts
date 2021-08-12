import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ByLawService, MaintenanceRequestService, NoticeService, ProfileService, ReportService, User } from '@api';
import { AuthService } from '@core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent  {

  public currentUser$: Observable<User> = this._authService.currentUser$;

  public vm$ = combineLatest([
    this._profileService.getCurrent(),
    this._maintenanceRequestService.getMy(),
    this._noticeService.getPublished(),
    this._byLawService.getPublished(),
    this._reportService.getPublished()
  ])
  .pipe(
    map(([profile, maintenanceRequests, notices, byLaws, reports]) => {
      return {
        avatarFormControl: new FormControl(profile.avatarDigitalAssetId,[]),
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
    private readonly _reportService: ReportService
  ) {

  }
}
