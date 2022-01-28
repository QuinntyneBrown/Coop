import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaintenanceRequest, MaintenanceRequestService } from '@api';
import { Subject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-a-maintenace-request-dialog',
  templateUrl: './create-a-maintenace-request-dialog.component.html',
  styleUrls: ['./create-a-maintenace-request-dialog.component.scss']
})
export class CreateAMaintenaceRequestDialogComponent {

  readonly formControl = new FormControl(null, []);

  private readonly _saveActionSubject: Subject<Partial<MaintenanceRequest>> = new Subject();

  private readonly _saveAction$ = this._saveActionSubject.asObservable();

  readonly vm$ = this._saveAction$.pipe(
    switchMap(maintenanceRequest => this._maintenanceRequestService.create(maintenanceRequest).pipe(
      tap(_ => this._dialogRef.close())
    )),
    startWith(true)
  )

  constructor(
    private readonly _maintenanceRequestService: MaintenanceRequestService,
    private readonly _dialogRef: MatDialogRef<CreateAMaintenaceRequestDialogComponent>
  ) { }

  handleSave(maintenanceRequest: MaintenanceRequest) {
    this._saveActionSubject.next(maintenanceRequest);
  }
}
