// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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

