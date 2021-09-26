import { Address } from "./address";

export type MaintenanceRequest = {
    maintenanceRequestId: string,
    requestedByName: string,
    address: Address,
    phone: string,
    description: string,
    unattendedUnitEntryAllowed: boolean
};


export type CreateMaintenanceRequest = {
  requestedByName: string,
  requestedByProfileId: string,
  address: Address,
  phone: string,
  description: string,
  unattendedUnitEntryAllowed: boolean
}
