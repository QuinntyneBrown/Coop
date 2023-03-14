// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceRequestService } from '@api';
import { of, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-maintenance-request',
  templateUrl: './maintenance-request.component.html',
  styleUrls: ['./maintenance-request.component.scss']
})
export class MaintenanceRequestComponent  {

  private readonly _destroyed$ = new Subject();

  public readonly formControl = new FormControl(null, [Validators.required]);

  public readonly vm$ = this._activatedRoute
  .paramMap
  .pipe(
    map(paramMap => paramMap.get("maintenanceRequestId")),
    switchMap(maintenanceRequestId => (maintenanceRequestId)
    ? this._maintenanceRequestService.getById({ maintenanceRequestId })
    : of(null)),
    map(maintenanceRequest => ({ maintenanceRequest }))
  )

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _maintenanceRequestService: MaintenanceRequestService
  ) { }

  handleSaveClick() {
    let maintenanceRequest = this.formControl.value;

    this._maintenanceRequestService.create(maintenanceRequest)
    .pipe(
      takeUntil(this._destroyed$)
    ).subscribe(_ => this._router.navigate(['/','workspace']));
  }

  handleCancelClick() {
    this._router.navigate(['/','workspace'])
  }
}

