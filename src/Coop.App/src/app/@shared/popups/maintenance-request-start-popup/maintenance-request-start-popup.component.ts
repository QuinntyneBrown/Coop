import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceRequest, MaintenanceRequestService, UnitEntered } from '@api';
import { map, takeUntil, tap } from 'rxjs/operators';
import { MaintenanceRequestPopupComponent } from '../maintenace-request-popup.component';

@Component({
  selector: 'app-maintenance-request-start-popup',
  templateUrl: './maintenance-request-start-popup.component.html',
  styleUrls: ['./maintenance-request-start-popup.component.scss']
})
export class MaintenanceRequestStartPopupComponent extends MaintenanceRequestPopupComponent {

  public UnitEntered: typeof UnitEntered = UnitEntered;

  public vm$ = this._maintenanceRequest$
  .pipe(
    map(x => {
      const form = new FormGroup({
        maintenanceRequestId: new FormControl(x.maintenanceRequestId, [Validators.required]),
        unitEntered: new FormControl(x.unitEntered, [Validators.required]),
        workStarted: new FormControl(null, [Validators.required])
      })
      return {
        form
      };
    })
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) _maintenanceRequest: MaintenanceRequest,
    _maintenanceRequestService: MaintenanceRequestService,
    dialog: MatDialogRef<MaintenanceRequestStartPopupComponent>
  ) {
    super(_maintenanceRequest, _maintenanceRequestService, dialog);
  }

  public save(vm) {
    this._maintenanceRequestService.start(vm.form.value)
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._dialog.close(true))
    )
  }
}
