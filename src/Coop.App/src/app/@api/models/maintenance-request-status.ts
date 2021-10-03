export enum MaintenanceRequestStatus {
  New,
  Received,
  Started,
  Completed
}


export function convertMaintenanceRequestStatusToString(status: MaintenanceRequestStatus): string {
  const lookUp = {
    0:"New",
    1:"Received",
    2:"Started",
    3:"Completed"
  };
  return lookUp[status];
}
