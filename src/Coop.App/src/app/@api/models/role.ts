import { AggregatePrivilege } from "./aggregate-privilege";
import { Privilege } from "./privilege";

export type Role = {
    roleId: string,
    privileges: Privilege[],
    aggregatePrivileges: AggregatePrivilege[]
};
