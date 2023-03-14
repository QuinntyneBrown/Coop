// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Message } from "./message";
import { Profile } from "./profile";

export type Conversation = {
    conversationId: string,
    profiles: Profile[],
    messages: Message[],
    created: string
};

