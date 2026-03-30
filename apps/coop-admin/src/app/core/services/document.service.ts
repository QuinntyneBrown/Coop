import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(private api: ApiService) {}

  getDocuments(): Observable<any> {
    return this.api.get('/document');
  }

  getDocumentById(id: string): Observable<any> {
    return this.api.get(`/document/${id}`);
  }

  getDocumentsByType(type: string): Observable<any> {
    return this.api.get(`/document/type/${type}`);
  }

  getPublishedDocuments(): Observable<any> {
    return this.api.get('/document');
  }

  createDocument(data: any): Observable<any> {
    return this.api.post('/document', data);
  }

  updateDocument(data: any): Observable<any> {
    return this.api.put('/document', data);
  }

  deleteDocument(id: string): Observable<any> {
    return this.api.delete(`/document/${id}`);
  }

  publishDocument(id: string): Observable<any> {
    return this.api.put('/document/publish', { documentId: id });
  }
}
