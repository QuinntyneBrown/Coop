// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HtmlContent } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class HtmlContentService implements IPagableService<HtmlContent> {

  uniqueIdentifierName: string = "htmlContentId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<HtmlContent>> {
    return this._client.get<EntityPage<HtmlContent>>(`${this._baseUrl}api/htmlContent/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<HtmlContent[]> {
    return this._client.get<{ htmlContents: HtmlContent[] }>(`${this._baseUrl}api/htmlContent`)
      .pipe(
        map(x => x.htmlContents)
      );
  }

  public getById(options: { htmlContentId: string }): Observable<HtmlContent> {
    return this._client.get<{ htmlContent: HtmlContent }>(`${this._baseUrl}api/htmlContent/${options.htmlContentId}`)
      .pipe(
        map(x => x.htmlContent)
      );
  }

  public remove(options: { htmlContent: HtmlContent }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/htmlContent/${options.htmlContent.htmlContentId}`);
  }

  public create(options: { htmlContent: HtmlContent }): Observable<{ htmlContent: HtmlContent }> {
    return this._client.post<{ htmlContent: HtmlContent }>(`${this._baseUrl}api/htmlContent`, { htmlContent: options.htmlContent });
  }
  
  public update(options: { htmlContent: HtmlContent }): Observable<{ htmlContent: HtmlContent }> {
    return this._client.put<{ htmlContent: HtmlContent }>(`${this._baseUrl}api/htmlContent`, { htmlContent: options.htmlContent });
  }
}

