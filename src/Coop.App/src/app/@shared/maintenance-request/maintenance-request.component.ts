import { Component, Input } from '@angular/core';
import { MaintenanceRequest } from '@api';

@Component({
  selector: 'app-maintenance-request',
  templateUrl: './maintenance-request.component.html',
  styleUrls: ['./maintenance-request.component.scss']
})
export class MaintenanceRequestComponent {

  @Input() public maintenanceRequest: MaintenanceRequest;

}
