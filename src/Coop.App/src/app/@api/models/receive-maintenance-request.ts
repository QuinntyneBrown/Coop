// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { UnitEntered } from "./unit-entered";


export class ReceiveMaintenanceRequest {
  maintenanceRequestId: string;
  receivedByName: string;
}


export class StartMaintenanceRequest {
  maintenanceRequestId: string;
  unitEntered: UnitEntered;
  workStarted: Date;
}

export class CompleteMaintenanceRequest {
  maintenanceRequestId: string;
  workCompletedByName: string;
  workCompleted: Date;
}

export class UpdateMaintenanceRequestWorkDetails
{
  maintenanceRequestId: string;
  workDetails: string;
}

