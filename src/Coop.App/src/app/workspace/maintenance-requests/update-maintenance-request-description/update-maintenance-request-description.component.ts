// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceRequest, MaintenanceRequestService } from '@api';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-update-maintenance-request-description',
  templateUrl: './update-maintenance-request-description.component.html',
  styleUrls: ['./update-maintenance-request-description.component.scss']
})
export class UpdateMaintenanceRequestDescriptionComponent implements OnDestroy {

  private readonly _destroyed$ = new Subject();

  public vm$ = this._activatedRoute
  .paramMap
  .pipe(
    map(x => x.get("maintenanceRequestId")),
    switchMap(maintenanceRequestId => this._maintenanceRequestService.getById({ maintenanceRequestId })),
    map(maintenanceRequest => {
      const form = new FormGroup({
        maintenanceRequestId: new FormControl(maintenanceRequest.maintenanceRequestId,[Validators.required]),
        description: new FormControl(maintenanceRequest.description,[Validators.required])
      });

      return {
        maintenanceRequest,
        form
      }
    })
  );

  constructor(
    private readonly _maintenanceRequestService: MaintenanceRequestService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router
  ) {

  }

  public save(maintenanceRequest: Partial<MaintenanceRequest>) {
    this._maintenanceRequestService
    .updateDescription(maintenanceRequest)
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._router.navigate(['/','workspace']))
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

