// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { JsonContentName } from "@api/models/json-content-name";

export type JsonContent = {
    jsonContentId?: string,
    name?: JsonContentName,
    json?: any,
    type?: any
};

