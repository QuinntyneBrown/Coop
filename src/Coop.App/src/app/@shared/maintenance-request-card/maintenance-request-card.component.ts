// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, OnInit } from '@angular/core';
import { convertMaintenanceRequestStatusToString, MaintenanceRequest } from '@api';

@Component({
  selector: 'app-maintenance-request-card',
  templateUrl: './maintenance-request-card.component.html',
  styleUrls: ['./maintenance-request-card.component.scss']
})
export class MaintenanceRequestCardComponent {

  readonly convertMaintenanceRequestStatusToString: typeof convertMaintenanceRequestStatusToString = convertMaintenanceRequestStatusToString;

  @Input() maintenanceRequest!: MaintenanceRequest;
}

