// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from "@angular/core";
import { accessTokenKey, baseUrl, LocalStorageService } from "@core";
import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class EventService {

    private get _token() {
        const token = this._localStorage.get({ name: accessTokenKey });

        return token;
    }

    d = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InF1aW5udHluZWJyb3duQGdtYWlsLmNvbSIsInN1YiI6InF1aW5udHluZWJyb3duQGdtYWlsLmNvbSIsImp0aSI6ImMwMWY3NzQ3LTVlNTItNGViMi04ZjIxLWVlYzBjZTMyZDQ1ZSIsImlhdCI6MTY0MzQ0NTI3NCwiVXNlcklkIjoiYmMzNTZjNjktZmUxNC00NzI2LWI2ODAtMDhkOTdkOGU5MjA4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InF1aW5udHluZWJyb3duQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN5c3RlbUFkbWluaXN0cmF0b3IiLCJQcml2aWxlZ2UiOlsiUmVhZEJvYXJkTWVtYmVyIiwiV3JpdGVCb2FyZE1lbWJlciIsIkNyZWF0ZUJvYXJkTWVtYmVyIiwiRGVsZXRlQm9hcmRNZW1iZXIiLCJSZWFkQnlMYXciLCJXcml0ZUJ5TGF3IiwiQ3JlYXRlQnlMYXciLCJEZWxldGVCeUxhdyIsIlJlYWREaWdpdGFsQXNzZXQiLCJXcml0ZURpZ2l0YWxBc3NldCIsIkNyZWF0ZURpZ2l0YWxBc3NldCIsIkRlbGV0ZURpZ2l0YWxBc3NldCIsIlJlYWRNYWludGVuYW5jZVJlcXVlc3QiLCJXcml0ZU1haW50ZW5hbmNlUmVxdWVzdCIsIkNyZWF0ZU1haW50ZW5hbmNlUmVxdWVzdCIsIkRlbGV0ZU1haW50ZW5hbmNlUmVxdWVzdCIsIlJlYWRNZW1iZXIiLCJXcml0ZU1lbWJlciIsIkNyZWF0ZU1lbWJlciIsIkRlbGV0ZU1lbWJlciIsIlJlYWROb3RpY2UiLCJXcml0ZU5vdGljZSIsIkNyZWF0ZU5vdGljZSIsIkRlbGV0ZU5vdGljZSIsIlJlYWRQcml2aWxlZ2UiLCJXcml0ZVByaXZpbGVnZSIsIkNyZWF0ZVByaXZpbGVnZSIsIkRlbGV0ZVByaXZpbGVnZSIsIlJlYWRSb2xlIiwiV3JpdGVSb2xlIiwiQ3JlYXRlUm9sZSIsIkRlbGV0ZVJvbGUiLCJSZWFkU3RhZmZNZW1iZXIiLCJXcml0ZVN0YWZmTWVtYmVyIiwiQ3JlYXRlU3RhZmZNZW1iZXIiLCJEZWxldGVTdGFmZk1lbWJlciIsIlJlYWRVc2VyIiwiV3JpdGVVc2VyIiwiQ3JlYXRlVXNlciIsIkRlbGV0ZVVzZXIiLCJSZWFkTWVzc2FnZSIsIldyaXRlTWVzc2FnZSIsIkNyZWF0ZU1lc3NhZ2UiLCJEZWxldGVNZXNzYWdlIiwiUmVhZEh0bWxDb250ZW50IiwiV3JpdGVIdG1sQ29udGVudCIsIkNyZWF0ZUh0bWxDb250ZW50IiwiRGVsZXRlSHRtbENvbnRlbnQiLCJSZWFkQ3NzQ3VzdG9tUHJvcGVydHkiLCJXcml0ZUNzc0N1c3RvbVByb3BlcnR5IiwiQ3JlYXRlQ3NzQ3VzdG9tUHJvcGVydHkiLCJEZWxldGVDc3NDdXN0b21Qcm9wZXJ0eSIsIlJlYWRUaGVtZSIsIldyaXRlVGhlbWUiLCJDcmVhdGVUaGVtZSIsIkRlbGV0ZVRoZW1lIiwiUmVhZEpzb25Db250ZW50IiwiV3JpdGVKc29uQ29udGVudCIsIkNyZWF0ZUpzb25Db250ZW50IiwiRGVsZXRlSnNvbkNvbnRlbnQiLCJSZWFkUmVwb3J0IiwiV3JpdGVSZXBvcnQiLCJDcmVhdGVSZXBvcnQiLCJEZWxldGVSZXBvcnQiXSwibmJmIjoxNjQzNDQ1Mjc0LCJleHAiOjE2NDQwNTAwNzQsImlzcyI6ImxvY2FsaG9zdCIsImF1ZCI6ImFsbCJ9.X5escGf7VgIN1AR55enRfXHlcOWt2PIsgD5RgPJBoJ0";

    readonly events$ = fromEvent(new EventSource(`${this._baseUrl}api/events/${this.d}`, { withCredentials: true }), "message")
    .pipe(
        map((messsagEvent: MessageEvent<any>) => JSON.parse(messsagEvent.data)),
    );


    constructor(
        @Inject(baseUrl) private readonly _baseUrl: string,
        private readonly _localStorage: LocalStorageService
    ) { 

        console.log(this._localStorage.get({ name: accessTokenKey }));

    }


}
