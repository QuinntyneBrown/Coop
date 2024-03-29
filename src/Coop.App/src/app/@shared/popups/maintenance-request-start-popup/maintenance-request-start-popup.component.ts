// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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

  readonly UnitEntered: typeof UnitEntered = UnitEntered;

  readonly vm$ = this._maintenanceRequest$
  .pipe(
    map(maintenanceRequest => {
      const form = new FormGroup({
        maintenanceRequestId: new FormControl(maintenanceRequest.maintenanceRequestId, [Validators.required]),
        unitEntered: new FormControl(maintenanceRequest.unitEntered, [Validators.required]),
        workStarted: new FormControl(null, [Validators.required])
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
    dialog: MatDialogRef<MaintenanceRequestStartPopupComponent>
  ) {
    super(_maintenanceRequest, _maintenanceRequestService, dialog);
  }

  save(vm) {
    this._maintenanceRequestService.start(vm.form.value)
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._dialog.close(true))
    ).subscribe();
  }
}

