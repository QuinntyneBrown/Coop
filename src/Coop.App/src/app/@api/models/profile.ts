import { Address } from "./address";
import { Message } from "./message";

export type Profile = {
  profileId: string,
  userId: string,
  firstname: string,
  lastname: string,
  avatarDigitalAssetId: string,
  phoneNumber: string,
  address: Address,
  messages: Message[]
};


export type CreateProfileRequest = {
  email: string,
  password: string,
  passwordConfirmation: string,
  invitationToken: string,
  firstname: string,
  lastname: string,
  avatarDigitalAssetId: string
}
