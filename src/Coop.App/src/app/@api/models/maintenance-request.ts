import { MaintenanceRequestComment } from "./maintenance-request-comment";
import { MaintenanceRequestDigitalAsset } from "./maintenance-request-digital-asset";
import { MaintenanceRequestStatus } from "./maintenance-request-statues";

export type MaintenanceRequest = {
    maintenanceRequestId: string,
    title: string,
    description: string,
    createdById: string,
    status: MaintenanceRequestStatus,
    comments: MaintenanceRequestComment[],
    digitalAssets: MaintenanceRequestDigitalAsset[]
};
