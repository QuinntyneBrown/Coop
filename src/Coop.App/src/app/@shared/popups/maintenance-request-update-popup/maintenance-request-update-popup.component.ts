import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceRequest, MaintenanceRequestService } from '@api';
import { map, takeUntil, tap } from 'rxjs/operators';
import { MaintenanceRequestPopupComponent } from '../maintenace-request-popup.component';

@Component({
  selector: 'app-maintenance-request-update-popup',
  templateUrl: './maintenance-request-update-popup.component.html',
  styleUrls: ['./maintenance-request-update-popup.component.scss']
})
export class MaintenanceRequestUpdatePopupComponent extends MaintenanceRequestPopupComponent {

  public vm$ = this._maintenanceRequest$
  .pipe(
    map(maintenanceRequest => {
      const form = new FormGroup({
        maintenanceRequestId: new FormControl(maintenanceRequest.maintenanceRequestId, [Validators.required]),
        workDetails: new FormControl(maintenanceRequest.workDetails, [Validators.required])
      })
      return {
        form,
        maintenanceRequest
      };
    })
  );
  constructor(
    @Inject(MAT_DIALOG_DATA) _maintenanceRequest: MaintenanceRequest,
    _maintenanceRequestService: MaintenanceRequestService,
    dialog: MatDialogRef<MaintenanceRequestUpdatePopupComponent>
  ) {
    super(_maintenanceRequest, _maintenanceRequestService, dialog);
  }

  public save(vm) {
    this._maintenanceRequestService.updateWorkDetails(vm.form.value)
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._dialog.close(true))
    ).subscribe();
  }
}
