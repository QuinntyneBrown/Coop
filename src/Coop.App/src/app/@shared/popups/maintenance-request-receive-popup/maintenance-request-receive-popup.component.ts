import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceRequest, MaintenanceRequestService, ProfileService } from '@api';
import { combineLatest, forkJoin } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { MaintenanceRequestPopupComponent } from '../maintenace-request-popup.component';

@Component({
  selector: 'app-maintenance-request-receive-popup',
  templateUrl: './maintenance-request-receive-popup.component.html',
  styleUrls: ['./maintenance-request-receive-popup.component.scss']
})
export class MaintenanceRequestReceivePopupComponent extends MaintenanceRequestPopupComponent {

  public vm$ = forkJoin([this._maintenanceRequest$, this._profileService.getCurrent()])
  .pipe(
    map(([maintenanceRequest, profile]) => {
      alert("?")
      const form = new FormGroup({
        maintenanceRequestId: new FormControl(maintenanceRequest.maintenanceRequestId, [Validators.required]),
        receivedByName: new FormControl(`${profile.firstname} ${profile.lastname}`, [Validators.required])
      })
      return {
        form
      };
    })
  );

  public save(vm) {
    this._maintenanceRequestService.receive(vm.form.value)
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._dialog.close(true))
    )
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) _maintenanceRequest: MaintenanceRequest,
    _maintenanceRequestService: MaintenanceRequestService,
    private readonly _profileService: ProfileService,
    dialog: MatDialogRef<MaintenanceRequestReceivePopupComponent>
  ) {
    super(_maintenanceRequest, _maintenanceRequestService, dialog);
  }
}
