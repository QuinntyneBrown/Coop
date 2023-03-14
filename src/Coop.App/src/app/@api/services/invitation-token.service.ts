// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InvitationToken } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class InvitationTokenService implements IPagableService<InvitationToken> {

  uniqueIdentifierName: string = "invitationTokenId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<InvitationToken>> {
    return this._client.get<EntityPage<InvitationToken>>(`${this._baseUrl}api/invitationToken/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<InvitationToken[]> {
    return this._client.get<{ invitationTokens: InvitationToken[] }>(`${this._baseUrl}api/invitationToken`)
      .pipe(
        map(x => x.invitationTokens)
      );
  }

  public getById(options: { invitationTokenId: string }): Observable<InvitationToken> {
    return this._client.get<{ invitationToken: InvitationToken }>(`${this._baseUrl}api/invitationToken/${options.invitationTokenId}`)
      .pipe(
        map(x => x.invitationToken)
      );
  }

  public remove(options: { invitationToken: InvitationToken }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/invitationToken/${options.invitationToken.invitationTokenId}`);
  }

  public create(options: { invitationToken: InvitationToken }): Observable<{ invitationToken: InvitationToken }> {
    return this._client.post<{ invitationToken: InvitationToken }>(`${this._baseUrl}api/invitationToken`, { invitationToken: options.invitationToken });
  }
  
  public update(options: { invitationToken: InvitationToken }): Observable<{ invitationToken: InvitationToken }> {
    return this._client.put<{ invitationToken: InvitationToken }>(`${this._baseUrl}api/invitationToken`, { invitationToken: options.invitationToken });
  }
}

