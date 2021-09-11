import { JsonContentName } from "@api/models/json-content-name";

export type JsonContent = {
    jsonContentId?: string,
    name?: JsonContentName,
    json?: any,
    type?: any
};
