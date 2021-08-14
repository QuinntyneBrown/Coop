import { Profile } from "./profile"

export type StaffMember = Profile & {
    staffMemberId: string,
    jobTitle: string
};
