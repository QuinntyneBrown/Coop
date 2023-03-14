// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { MaintenanceRequestStatus, UnitEntered } from "@api";
import { Address } from "./address";

export type MaintenanceRequest = {
    maintenanceRequestId: string,
    date: string,
    requestedByName: string,
    receivedByName: string,
    address: Address,
    phone: string,
    description: string,
    unattendedUnitEntryAllowed: boolean,
    workDetails: string,
    unitEntered: UnitEntered,
    status: MaintenanceRequestStatus
};


export type CreateMaintenanceRequest = {
  requestedByName: string,
  requestedByProfileId: string,
  address: Address,
  phone: string,
  description: string,
  unattendedUnitEntryAllowed: boolean
}

