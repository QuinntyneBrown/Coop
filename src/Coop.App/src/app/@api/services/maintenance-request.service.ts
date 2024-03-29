// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateMaintenanceRequest, MaintenanceRequest } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';
import { CompleteMaintenanceRequest, ReceiveMaintenanceRequest, StartMaintenanceRequest, UpdateMaintenanceRequestWorkDetails } from '@api/models/receive-maintenance-request';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceRequestService implements IPagableService<MaintenanceRequest> {

  uniqueIdentifierName: string = "maintenanceRequestId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<MaintenanceRequest>> {
    return this._client.get<EntityPage<MaintenanceRequest>>(`${this._baseUrl}api/maintenanceRequest/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<MaintenanceRequest[]> {
    return this._client.get<{ maintenanceRequests: MaintenanceRequest[] }>(`${this._baseUrl}api/maintenanceRequest`)
      .pipe(
        map(x => x.maintenanceRequests)
      );
  }

  public getMy(): Observable<MaintenanceRequest[]> {
    return this._client.get<{ maintenanceRequests: MaintenanceRequest[] }>(`${this._baseUrl}api/maintenanceRequest/my`)
      .pipe(
        map(x => x.maintenanceRequests)
      );
  }

  public getById(options: { maintenanceRequestId: string }): Observable<MaintenanceRequest> {
    return this._client.get<{ maintenanceRequest: MaintenanceRequest }>(`${this._baseUrl}api/maintenanceRequest/${options.maintenanceRequestId}`)
      .pipe(
        map(x => x.maintenanceRequest)
      );
  }

  public remove(options: { maintenanceRequest: MaintenanceRequest }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/maintenanceRequest/${options.maintenanceRequest.maintenanceRequestId}`);
  }

  public create(maintenanceRequest: Partial<MaintenanceRequest>): Observable<{ maintenanceRequest: MaintenanceRequest }> {
    return this._client.post<{ maintenanceRequest: MaintenanceRequest }>(`${this._baseUrl}api/maintenanceRequest`, maintenanceRequest);
  }

  public update(maintenanceRequest: Partial<MaintenanceRequest>): Observable<{ maintenanceRequest: MaintenanceRequest }> {
    return this._client.put<{ maintenanceRequest: MaintenanceRequest }>(`${this._baseUrl}api/maintenanceRequest`, maintenanceRequest);
  }

  public updateDescription(maintenanceRequest: Partial<MaintenanceRequest>): Observable<{ maintenanceRequest: MaintenanceRequest }> {
    return this._client.put<{ maintenanceRequest: MaintenanceRequest }>(`${this._baseUrl}api/maintenanceRequest/description`, maintenanceRequest);
  }

  public updateWorkDetails(updateMaintenanceRequestWorkDetails: UpdateMaintenanceRequestWorkDetails): Observable<{ maintenanceRequest: MaintenanceRequest }> {
    return this._client.put<{ maintenanceRequest: MaintenanceRequest }>(`${this._baseUrl}api/maintenanceRequest/work-details`, updateMaintenanceRequestWorkDetails);
  }

  public start(startMaintenanceRequest: StartMaintenanceRequest): Observable<{ maintenanceRequest: MaintenanceRequest }> {
    return this._client.put<{ maintenanceRequest: MaintenanceRequest }>(`${this._baseUrl}api/maintenanceRequest/start`, startMaintenanceRequest);
  }

  public receive(receiveMaintenanceRequest: ReceiveMaintenanceRequest): Observable<{ maintenanceRequest: MaintenanceRequest }> {
    return this._client.put<{ maintenanceRequest: MaintenanceRequest }>(`${this._baseUrl}api/maintenanceRequest/receive`, receiveMaintenanceRequest);
  }

  public complete(completeMaintenanceRequest: CompleteMaintenanceRequest): Observable<{ maintenanceRequest: MaintenanceRequest }> {
    return this._client.put<{ maintenanceRequest: MaintenanceRequest }>(`${this._baseUrl}api/maintenanceRequest/complete`, completeMaintenanceRequest);
  }
}

