import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaintenanceRequest } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

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

  public create(options: { maintenanceRequest: MaintenanceRequest }): Observable<{ maintenanceRequest: MaintenanceRequest }> {
    return this._client.post<{ maintenanceRequest: MaintenanceRequest }>(`${this._baseUrl}api/maintenanceRequest`, { maintenanceRequest: options.maintenanceRequest });
  }

  public update(options: { maintenanceRequest: MaintenanceRequest }): Observable<{ maintenanceRequest: MaintenanceRequest }> {
    return this._client.put<{ maintenanceRequest: MaintenanceRequest }>(`${this._baseUrl}api/maintenanceRequest`, { maintenanceRequest: options.maintenanceRequest });
  }
}
