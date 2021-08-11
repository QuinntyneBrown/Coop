import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Document } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class DocumentService implements IPagableService<Document> {

  uniqueIdentifierName: string = "documentId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<Document>> {
    return this._client.get<EntityPage<Document>>(`${this._baseUrl}api/document/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<Document[]> {
    return this._client.get<{ documents: Document[] }>(`${this._baseUrl}api/document`)
      .pipe(
        map(x => x.documents)
      );
  }

  public getById(options: { documentId: string }): Observable<Document> {
    return this._client.get<{ document: Document }>(`${this._baseUrl}api/document/${options.documentId}`)
      .pipe(
        map(x => x.document)
      );
  }

  public remove(options: { document: Document }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/document/${options.document.documentId}`);
  }

  public create(options: { document: Document }): Observable<{ document: Document }> {
    return this._client.post<{ document: Document }>(`${this._baseUrl}api/document`, { document: options.document });
  }
  
  public update(options: { document: Document }): Observable<{ document: Document }> {
    return this._client.put<{ document: Document }>(`${this._baseUrl}api/document`, { document: options.document });
  }
}
