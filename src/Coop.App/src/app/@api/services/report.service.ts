import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Report } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class ReportService implements IPagableService<Report> {

  uniqueIdentifierName: string = "reportId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<Report>> {
    return this._client.get<EntityPage<Report>>(`${this._baseUrl}api/report/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<Report[]> {
    return this._client.get<{ reports: Report[] }>(`${this._baseUrl}api/report`)
      .pipe(
        map(x => x.reports)
      );
  }

  public getPublished(): Observable<Report[]> {
    return this._client.get<{ reports: Report[] }>(`${this._baseUrl}api/report/published`)
      .pipe(
        map(x => x.reports)
      );
  }

  public getById(options: { reportId: string }): Observable<Report> {
    return this._client.get<{ report: Report }>(`${this._baseUrl}api/report/${options.reportId}`)
      .pipe(
        map(x => x.report)
      );
  }

  public remove(options: { report: Report }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/report/${options.report.reportId}`);
  }

  public create(options: { report: Report }): Observable<{ report: Report }> {
    return this._client.post<{ report: Report }>(`${this._baseUrl}api/report`, { report: options.report });
  }

  public update(options: { report: Report }): Observable<{ report: Report }> {
    return this._client.put<{ report: Report }>(`${this._baseUrl}api/report`, { report: options.report });
  }
}
