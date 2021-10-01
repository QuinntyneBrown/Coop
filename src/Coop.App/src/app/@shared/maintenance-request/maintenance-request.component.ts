import { Component, Input } from '@angular/core';
import { MaintenanceRequest, MaintenanceRequestStatus } from '@api';

@Component({
  selector: 'app-maintenance-request',
  templateUrl: './maintenance-request.component.html',
  styleUrls: ['./maintenance-request.component.scss']
})
export class MaintenanceRequestComponent {

  public MaintenanceRequestStatus : typeof MaintenanceRequestStatus = MaintenanceRequestStatus;

  @Input() public maintenanceRequest: MaintenanceRequest;

  public get address() {
    return `${this.maintenanceRequest.address.unit}-${this.maintenanceRequest.address.street},${this.maintenanceRequest.address.city}, ${this.maintenanceRequest.address.province}, ${this.maintenanceRequest.address.postalCode}`;
  }
}
