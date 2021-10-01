import { Injectable } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MaintenanceRequest, MaintenanceRequestService } from "@api";
import { Destroyable } from "@core/destroyable";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class MaintenanceRequestPopupComponent extends Destroyable {

  protected _maintenanceRequest$: BehaviorSubject<MaintenanceRequest> = new BehaviorSubject(null);

  constructor(
    maintenanceRequest: MaintenanceRequest,
    protected readonly _maintenanceRequestService: MaintenanceRequestService,
    protected readonly _dialog: MatDialogRef<MaintenanceRequestPopupComponent>
  ) {
    super();
    this._maintenanceRequest$.next(maintenanceRequest);
  }
}
