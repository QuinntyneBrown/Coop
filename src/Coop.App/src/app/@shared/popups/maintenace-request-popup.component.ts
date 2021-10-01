import { Injectable } from "@angular/core";
import { MaintenanceRequest, MaintenanceRequestService } from "@api";
import { Destroyable } from "@core/destroyable";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class MaintenanceRequestPopupComponent extends Destroyable {

  protected _maintenanceRequest$: BehaviorSubject<MaintenanceRequest> = new BehaviorSubject(null);

  constructor(
    maintenanceRequest: MaintenanceRequest,
    protected readonly _maintenanceRequestService: MaintenanceRequestService
  ) {
    super();
    this._maintenanceRequest$.next(maintenanceRequest);
  }
}
