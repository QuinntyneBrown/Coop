import { JsonContent } from "./json-content";

export type JsonContentType = {
    jsonContentTypeId: string,
    name: string,
    multi: boolean,
    jsonContents: JsonContent[],
    jsonContent: JsonContent
};
