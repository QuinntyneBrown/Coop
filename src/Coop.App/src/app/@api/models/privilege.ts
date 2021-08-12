import { AccessRight } from "./access-right";

export type Privilege = {
    privilegeId: string,
    roleId: string,
    aggregate: string,
    accessRight: AccessRight
};
