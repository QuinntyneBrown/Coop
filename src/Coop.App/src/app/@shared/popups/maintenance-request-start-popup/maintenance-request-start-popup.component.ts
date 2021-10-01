import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceRequest, MaintenanceRequestService } from '@api';
import { map } from 'rxjs/operators';
import { MaintenanceRequestPopupComponent } from '../maintenace-request-popup.component';

@Component({
  selector: 'app-maintenance-request-start-popup',
  templateUrl: './maintenance-request-start-popup.component.html',
  styleUrls: ['./maintenance-request-start-popup.component.scss']
})
export class MaintenanceRequestStartPopupComponent extends MaintenanceRequestPopupComponent {

  public vm$ = this._maintenanceRequest$
  .pipe(
    map(x => {
      const form = new FormGroup({
        maintenanceRequestId: new FormControl(x.maintenanceRequestId, [Validators.required])
      })
      return {
        form
      };
    })
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) _maintenanceRequest: MaintenanceRequest,
    _maintenanceRequestService: MaintenanceRequestService
  ) {
    super(_maintenanceRequest, _maintenanceRequestService);
  }
}