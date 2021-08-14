import { Role } from "./role";

export type User = {
    userId: string,
    username: string,
    roles: Role[],
    defaultProfileId: string
};
