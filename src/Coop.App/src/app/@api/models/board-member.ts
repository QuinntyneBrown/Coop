import { Profile } from "@api";

export type BoardMember = Profile & {
    boardMemberId: string,
    boardTitle: string
};
