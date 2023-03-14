// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input } from '@angular/core';
import { MaintenanceRequest, MaintenanceRequestStatus } from '@api';

@Component({
  selector: 'app-maintenance-request',
  templateUrl: './maintenance-request.component.html',
  styleUrls: ['./maintenance-request.component.scss']
})
export class MaintenanceRequestComponent {

  readonly MaintenanceRequestStatus : typeof MaintenanceRequestStatus = MaintenanceRequestStatus;

  @Input() maintenanceRequest: MaintenanceRequest;

  get address() {
    return `${this.maintenanceRequest.address.unit}-${this.maintenanceRequest.address.street},${this.maintenanceRequest.address.city}, ${this.maintenanceRequest.address.province}, ${this.maintenanceRequest.address.postalCode}`;
  }
}

