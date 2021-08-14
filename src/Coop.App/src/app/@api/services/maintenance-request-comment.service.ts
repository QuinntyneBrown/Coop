import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaintenanceRequestComment } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceRequestCommentService implements IPagableService<MaintenanceRequestComment> {

  uniqueIdentifierName: string = "maintenanceRequestCommentId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<MaintenanceRequestComment>> {
    return this._client.get<EntityPage<MaintenanceRequestComment>>(`${this._baseUrl}api/maintenanceRequestComment/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<MaintenanceRequestComment[]> {
    return this._client.get<{ maintenanceRequestComments: MaintenanceRequestComment[] }>(`${this._baseUrl}api/maintenanceRequestComment`)
      .pipe(
        map(x => x.maintenanceRequestComments)
      );
  }

  public getById(options: { maintenanceRequestCommentId: string }): Observable<MaintenanceRequestComment> {
    return this._client.get<{ maintenanceRequestComment: MaintenanceRequestComment }>(`${this._baseUrl}api/maintenanceRequestComment/${options.maintenanceRequestCommentId}`)
      .pipe(
        map(x => x.maintenanceRequestComment)
      );
  }

  public remove(options: { maintenanceRequestComment: MaintenanceRequestComment }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/maintenanceRequestComment/${options.maintenanceRequestComment.maintenanceRequestCommentId}`);
  }

  public create(options: { maintenanceRequestComment: MaintenanceRequestComment }): Observable<{ maintenanceRequestComment: MaintenanceRequestComment }> {
    return this._client.post<{ maintenanceRequestComment: MaintenanceRequestComment }>(`${this._baseUrl}api/maintenanceRequestComment`, { maintenanceRequestComment: options.maintenanceRequestComment });
  }
  
  public update(options: { maintenanceRequestComment: MaintenanceRequestComment }): Observable<{ maintenanceRequestComment: MaintenanceRequestComment }> {
    return this._client.put<{ maintenanceRequestComment: MaintenanceRequestComment }>(`${this._baseUrl}api/maintenanceRequestComment`, { maintenanceRequestComment: options.maintenanceRequestComment });
  }
}
