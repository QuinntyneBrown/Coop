// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StaffMember } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class StaffMemberService implements IPagableService<StaffMember> {

  uniqueIdentifierName: string = "staffMemberId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<StaffMember>> {
    return this._client.get<EntityPage<StaffMember>>(`${this._baseUrl}api/staffMember/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<StaffMember[]> {
    return this._client.get<{ staffMembers: StaffMember[] }>(`${this._baseUrl}api/staffMember`)
      .pipe(
        map(x => x.staffMembers)
      );
  }

  public getById(options: { staffMemberId: string }): Observable<StaffMember> {
    return this._client.get<{ staffMember: StaffMember }>(`${this._baseUrl}api/staffMember/${options.staffMemberId}`)
      .pipe(
        map(x => x.staffMember)
      );
  }

  public remove(options: { staffMember: StaffMember }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/staffMember/${options.staffMember.staffMemberId}`);
  }

  public create(options: { staffMember: StaffMember }): Observable<{ staffMember: StaffMember }> {
    return this._client.post<{ staffMember: StaffMember }>(`${this._baseUrl}api/staffMember`, { staffMember: options.staffMember });
  }
  
  public update(options: { staffMember: StaffMember }): Observable<{ staffMember: StaffMember }> {
    return this._client.put<{ staffMember: StaffMember }>(`${this._baseUrl}api/staffMember`, { staffMember: options.staffMember });
  }
}

