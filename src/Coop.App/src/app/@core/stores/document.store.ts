// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { Document, DocumentService } from "@api";
import { EntityPage } from "@core";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, Observable, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface DocumentStoreState {
  documents?: Document[],
  document?: Document,
  page?: EntityPage<Document>
}

@Injectable({
  providedIn: "root"
})
export class DocumentStore extends ComponentStore<DocumentStoreState> {

  readonly uniqueIdentifierName = "documentId";

  constructor(
    private readonly _documentService: DocumentService
  ) {
    super({ })
  }

  getPage(options: { pageIndex: number, pageSize: number }): Observable<EntityPage<Document>> {
    return of(undefined)
    .pipe(
      tap(_ => this._getPage()),
      switchMap(_ => this.select(x => x.page))
    )
  }

  private readonly _getPage = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.documents).pipe(first())
      .pipe(
        switchMap(documents => {
          if(documents === undefined) {
            return this._documentService.get()
            .pipe(
              tap(documents => this.setState((state) => ({...state, documents }))),
            );
          }
          return of(documents);
        }),
      )),
      shareReplay(1)
    ));

  public getDocuments(): Observable<Document[]> {
    return of(undefined)
    .pipe(
      tap(_ => this._getDocuments()),
      switchMap(_ => this.select(x => x.documents))
    )
  }

  public getDocumentById(documentId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getDocumentById(documentId)),
      switchMap(_ => this.select(x => x.document))
    );
  }

  private readonly _getDocuments = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.documents).pipe(first())
      .pipe(
        switchMap(documents => {
          if(documents === undefined) {
            return this._documentService.get()
            .pipe(
              tap(documents => this.setState((state) => ({...state, documents }))),
            );
          }
          return of(documents);
        }),
      )),
      shareReplay(1)
    ));

  private _getDocumentById = this.effect<string>(documentId$ =>
    documentId$.pipe(
      switchMapByKey(documentId => documentId, documentId => {
        return this.select(x => x.document).pipe(first())
        .pipe(
          switchMap(document => {
            if(document?.documentId == documentId) {
              return of(document);
            }
            return this._documentService.getById({ documentId })
            .pipe(
              tap((document:Document) => this.setState((state) => ({ ...state, document })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createDocument = this.effect<Document>(document$ => document$.pipe(
    mergeMap(document => {
      return this._documentService.create({ document })
      .pipe(
        tap({
          next:({ document }) => {
            this.setState((state) => ({...state, document }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateDocument = this.effect<Document>(document$ => document$.pipe(
    mergeMap(document => {
      return this._documentService.create({ document })
      .pipe(
        tap({
          next: ({ document }) => {
            this.setState((state) => ({...state, document }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeDocument = this.effect<Document>(document$ => document$.pipe(
    mergeMap(document => {
      return this._documentService.remove({ document })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, document: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

