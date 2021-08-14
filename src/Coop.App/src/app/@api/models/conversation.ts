import { Message } from "./message";
import { Profile } from "./profile";

export type Conversation = {
    conversationId: string,
    profiles: Profile[],
    messages: Message[],
    created: string
};
