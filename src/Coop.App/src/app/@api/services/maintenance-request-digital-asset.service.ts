// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaintenanceRequestDigitalAsset } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceRequestDigitalAssetService implements IPagableService<MaintenanceRequestDigitalAsset> {

  uniqueIdentifierName: string = "maintenanceRequestDigitalAssetId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<MaintenanceRequestDigitalAsset>> {
    return this._client.get<EntityPage<MaintenanceRequestDigitalAsset>>(`${this._baseUrl}api/maintenanceRequestDigitalAsset/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<MaintenanceRequestDigitalAsset[]> {
    return this._client.get<{ maintenanceRequestDigitalAssets: MaintenanceRequestDigitalAsset[] }>(`${this._baseUrl}api/maintenanceRequestDigitalAsset`)
      .pipe(
        map(x => x.maintenanceRequestDigitalAssets)
      );
  }

  public getById(options: { maintenanceRequestDigitalAssetId: string }): Observable<MaintenanceRequestDigitalAsset> {
    return this._client.get<{ maintenanceRequestDigitalAsset: MaintenanceRequestDigitalAsset }>(`${this._baseUrl}api/maintenanceRequestDigitalAsset/${options.maintenanceRequestDigitalAssetId}`)
      .pipe(
        map(x => x.maintenanceRequestDigitalAsset)
      );
  }

  public remove(options: { maintenanceRequestDigitalAsset: MaintenanceRequestDigitalAsset }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/maintenanceRequestDigitalAsset/${options.maintenanceRequestDigitalAsset.maintenanceRequestDigitalAssetId}`);
  }

  public create(options: { maintenanceRequestDigitalAsset: MaintenanceRequestDigitalAsset }): Observable<{ maintenanceRequestDigitalAsset: MaintenanceRequestDigitalAsset }> {
    return this._client.post<{ maintenanceRequestDigitalAsset: MaintenanceRequestDigitalAsset }>(`${this._baseUrl}api/maintenanceRequestDigitalAsset`, { maintenanceRequestDigitalAsset: options.maintenanceRequestDigitalAsset });
  }
  
  public update(options: { maintenanceRequestDigitalAsset: MaintenanceRequestDigitalAsset }): Observable<{ maintenanceRequestDigitalAsset: MaintenanceRequestDigitalAsset }> {
    return this._client.put<{ maintenanceRequestDigitalAsset: MaintenanceRequestDigitalAsset }>(`${this._baseUrl}api/maintenanceRequestDigitalAsset`, { maintenanceRequestDigitalAsset: options.maintenanceRequestDigitalAsset });
  }
}

