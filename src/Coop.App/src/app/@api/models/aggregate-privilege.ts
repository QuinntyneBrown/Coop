// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Privilege } from "./privilege";

export type AggregatePrivilege  = {
  aggregate: string,
  privileges: Privilege[]
};

