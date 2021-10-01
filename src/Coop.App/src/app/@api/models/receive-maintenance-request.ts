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
