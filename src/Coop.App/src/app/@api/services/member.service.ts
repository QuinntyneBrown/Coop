// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class MemberService implements IPagableService<Member> {

  uniqueIdentifierName: string = "memberId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<Member>> {
    return this._client.get<EntityPage<Member>>(`${this._baseUrl}api/member/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<Member[]> {
    return this._client.get<{ members: Member[] }>(`${this._baseUrl}api/member`)
      .pipe(
        map(x => x.members)
      );
  }

  public getById(options: { memberId: string }): Observable<Member> {
    return this._client.get<{ member: Member }>(`${this._baseUrl}api/member/${options.memberId}`)
      .pipe(
        map(x => x.member)
      );
  }

  public remove(options: { member: Member }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/member/${options.member.memberId}`);
  }

  public create(options: { member: Member }): Observable<{ member: Member }> {
    return this._client.post<{ member: Member }>(`${this._baseUrl}api/member`, { member: options.member });
  }
  
  public update(options: { member: Member }): Observable<{ member: Member }> {
    return this._client.put<{ member: Member }>(`${this._baseUrl}api/member`, { member: options.member });
  }
}

