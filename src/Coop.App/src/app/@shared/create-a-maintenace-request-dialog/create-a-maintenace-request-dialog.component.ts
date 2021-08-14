import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaintenanceRequestService } from '@api';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-a-maintenace-request-dialog',
  templateUrl: './create-a-maintenace-request-dialog.component.html',
  styleUrls: ['./create-a-maintenace-request-dialog.component.scss']
})
export class CreateAMaintenaceRequestDialogComponent implements OnDestroy {

  private readonly _destroyed$ = new Subject();
  public formControl = new FormControl(null, []);

  constructor(
    private readonly _maintenanceRequestService: MaintenanceRequestService,
    private readonly _dialogRef: MatDialogRef<CreateAMaintenaceRequestDialogComponent>
  ) { }

  handleSaveClick() {
    const maintenanceRequest = this.formControl.value;
    this._maintenanceRequestService.create({ maintenanceRequest})
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._dialogRef.close())
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
