// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Profile } from "@api";

export type BoardMember = Profile & {
    boardMemberId: string,
    boardTitle: string
};

