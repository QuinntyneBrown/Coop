import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateMaintenanceRequest, MaintenanceRequest, MaintenanceRequestService, ProfileService } from '@api';
import { combineLatest, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-maintenance-request',
  templateUrl: './create-maintenance-request.component.html',
  styleUrls: ['./create-maintenance-request.component.scss']
})
export class CreateMaintenanceRequestComponent implements OnDestroy {

  private readonly _destroyed$ = new Subject();

  private _maintenanceRequest$ = this._activatedRoute
  .paramMap
  .pipe(
    map(paramMap => paramMap.get("maintenanceRequestId")),
    switchMap(maintenanceRequestId => maintenanceRequestId ? this._maintenanceRequestService.getById({ maintenanceRequestId }) : of(null))
  );

  public vm$ = combineLatest([this._profileService.getCurrent(),this._maintenanceRequest$])
  .pipe(
    map(([profile, maintenanceRequest]) => {

      let fullname = maintenanceRequest?.fulllname || `${profile.firstname} ${profile.lastname}`;

      let address = maintenanceRequest?.address || profile.address;

      let phone = maintenanceRequest?.phone || profile.phoneNumber;

      let requestedByProfileId = maintenanceRequest?.requestedByProfileId || profile.profileId;

      const form = new FormGroup({
        maintenanceRequestId: new FormControl(maintenanceRequest?.maintenanceRequestId,[]),
        requestedByName: new FormControl(fullname,[Validators.required]),
        requestedByProfileId: new FormControl(requestedByProfileId,[Validators.required]),
        address: new FormControl(address,[Validators.required]),
        phone: new FormControl(phone, [Validators.required]),
        description: new FormControl(maintenanceRequest?.description,[Validators.required]),
        unattendedUnitEntryAllowed: new FormControl(maintenanceRequest?.unattendedUnitEntryAllowed,[Validators.required])
      })
      return {
        form
      }
    })
  );

  constructor(
    private readonly _maintenanceRequestService: MaintenanceRequestService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _profileService: ProfileService,
    private readonly _router: Router
  ) {

  }

  public save(maintenanceRequest: Partial<MaintenanceRequest>) {

    const obs$ = maintenanceRequest?.maintenanceRequestId
    ? this._maintenanceRequestService.update(maintenanceRequest)
    : this._maintenanceRequestService.create(maintenanceRequest);

    obs$
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._router.navigate(['/','workspace']))
    )
    .subscribe();
  }

  public cancel() {
    this._router.navigate(['/','workspace'])
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
