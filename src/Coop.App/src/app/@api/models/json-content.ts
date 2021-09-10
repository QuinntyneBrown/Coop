import { JsonContentName } from "@api/constants";

export type JsonContent = {
    jsonContentId?: string,
    name?: JsonContentName,
    json?: any,
    type?: any
};
