// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnCall } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class OnCallService implements IPagableService<OnCall> {

  uniqueIdentifierName: string = "onCallId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<OnCall>> {
    return this._client.get<EntityPage<OnCall>>(`${this._baseUrl}api/onCall/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<OnCall[]> {
    return this._client.get<{ onCalls: OnCall[] }>(`${this._baseUrl}api/onCall`)
      .pipe(
        map(x => x.onCalls)
      );
  }

  public getById(options: { onCallId: string }): Observable<OnCall> {
    return this._client.get<{ onCall: OnCall }>(`${this._baseUrl}api/onCall/${options.onCallId}`)
      .pipe(
        map(x => x.onCall)
      );
  }

  public remove(options: { onCall: OnCall }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/onCall/${options.onCall.onCallId}`);
  }

  public create(options: { onCall: OnCall }): Observable<{ onCall: OnCall }> {
    return this._client.post<{ onCall: OnCall }>(`${this._baseUrl}api/onCall`, { onCall: options.onCall });
  }
  
  public update(options: { onCall: OnCall }): Observable<{ onCall: OnCall }> {
    return this._client.put<{ onCall: OnCall }>(`${this._baseUrl}api/onCall`, { onCall: options.onCall });
  }
}

