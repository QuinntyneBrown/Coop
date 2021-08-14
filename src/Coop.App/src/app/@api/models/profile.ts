import { Message } from "./message";

export type Profile = {
    profileId: string,
    userId: string,
    firstname: string,
    lastname: string,
    avatarDigitalAssetId: string,
    phoneNumber: string,
    messages: Message[]
};
