// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceRequest, MaintenanceRequestService } from '@api';
import { map, takeUntil, tap } from 'rxjs/operators';
import { MaintenanceRequestPopupComponent } from '../maintenace-request-popup.component';

@Component({
  selector: 'app-maintenance-request-complete-popup',
  templateUrl: './maintenance-request-complete-popup.component.html',
  styleUrls: ['./maintenance-request-complete-popup.component.scss']
})
export class MaintenanceRequestCompletePopupComponent extends MaintenanceRequestPopupComponent {

  readonly vm$ = this._maintenanceRequest$
  .pipe(
    map(maintenanceRequest => {
      const form = new FormGroup({
        maintenanceRequestId: new FormControl(maintenanceRequest.maintenanceRequestId, [Validators.required]),
        workCompletedByName: new FormControl(null,[Validators.required]),
        workCompletedDtate: new FormControl(null, [Validators.required])
      });

      return {
        form,
        maintenanceRequest
      };
    })
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) _maintenanceRequest: MaintenanceRequest,
    _maintenanceRequestService: MaintenanceRequestService,
    dialog: MatDialogRef<MaintenanceRequestCompletePopupComponent>
  ) {
    super(_maintenanceRequest, _maintenanceRequestService, dialog);
  }

  save(vm) {
    this._maintenanceRequestService.complete(vm.form.value)
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._dialog.close(true))
    ).subscribe();
  }
}

