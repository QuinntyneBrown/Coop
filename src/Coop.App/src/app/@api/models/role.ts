// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AggregatePrivilege } from "./aggregate-privilege";
import { Privilege } from "./privilege";

export type Role = {
    roleId: string,
    name: string,
    privileges: Privilege[],
    aggregatePrivileges: AggregatePrivilege[]
};

