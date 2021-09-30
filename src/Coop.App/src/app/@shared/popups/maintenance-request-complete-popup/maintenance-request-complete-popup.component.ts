import { Component } from '@angular/core';
import { Destroyable } from '@core/destroyable';
import { of } from 'rxjs';

@Component({
  selector: 'app-maintenance-request-complete-popup',
  templateUrl: './maintenance-request-complete-popup.component.html',
  styleUrls: ['./maintenance-request-complete-popup.component.scss']
})
export class MaintenanceRequestCompletePopupComponent extends Destroyable {

  public vm$ = of({

  });

}
