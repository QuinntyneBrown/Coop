import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, CoopDocument } from '../../core/services/document.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="documents-page">
      <!-- Loading -->
      <div class="loading" *ngIf="loading" data-testid="documents-loading">
        <div class="spinner"></div>
      </div>

      <h1 data-testid="documents-page-title">Documents</h1>

      <!-- Filter Tabs -->
      <div class="filter-tabs" data-testid="documents-filter-tabs">
        <button
          class="filter-tab"
          [class.active]="activeFilter === 'all'"
          data-testid="documents-filter-all"
          (click)="filterBy('all')"
        >All</button>
        <button
          class="filter-tab"
          [class.active]="activeFilter === 'notices'"
          data-testid="documents-filter-notices"
          (click)="filterBy('notices')"
        >Notices</button>
        <button
          class="filter-tab"
          [class.active]="activeFilter === 'bylaws'"
          data-testid="documents-filter-bylaws"
          (click)="filterBy('bylaws')"
        >By-Laws</button>
        <button
          class="filter-tab"
          [class.active]="activeFilter === 'reports'"
          data-testid="documents-filter-reports"
          (click)="filterBy('reports')"
        >Reports</button>
      </div>

      <!-- Document List -->
      <div class="document-list" data-testid="documents-list" *ngIf="filteredDocuments.length > 0">
        <div
          class="document-card card"
          *ngFor="let doc of filteredDocuments"
          data-testid="document-card"
          (click)="openDocument(doc)"
        >
          <div class="card-color-bar" [class]="getTypeColorClass(doc.type)"></div>
          <div class="card-body">
            <span class="doc-type" data-testid="document-card-type">{{ formatType(doc.type) }}</span>
            <h3 data-testid="document-card-title">{{ doc.title }}</h3>
            <span class="doc-date" data-testid="document-card-date">{{ doc.createdAt | date:'mediumDate' }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && filteredDocuments.length === 0" data-testid="documents-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>No documents found</p>
      </div>

      <!-- Document Viewer -->
      <div class="modal-overlay" *ngIf="selectedDocument" data-testid="document-viewer">
        <div class="modal card viewer-modal">
          <div class="modal-header">
            <h2 data-testid="document-viewer-title">{{ selectedDocument.title }}</h2>
            <button class="close-btn" data-testid="document-viewer-close" (click)="selectedDocument = null">&times;</button>
          </div>
          <div class="viewer-body" data-testid="document-viewer-content">
            <div class="viewer-meta">
              <span class="doc-type">{{ formatType(selectedDocument.type) }}</span>
              <span class="doc-date">{{ selectedDocument.createdAt | date:'mediumDate' }}</span>
            </div>
            <div class="viewer-content">
              {{ selectedDocument.content }}
            </div>
          </div>
          <div class="viewer-actions">
            <button class="btn btn-primary" data-testid="document-download-btn" (click)="downloadDocument(selectedDocument)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .documents-page {
      padding: 24px 16px;
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .filter-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      overflow-x: auto;
    }

    .filter-tab {
      padding: 8px 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--surface);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      color: var(--text-secondary);
      transition: all 0.2s;

      &.active { background: var(--primary); color: white; border-color: var(--primary); }
      &:hover:not(.active) { border-color: var(--primary); }
    }

    .document-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .document-card {
      cursor: pointer;
      padding: 0;
      overflow: hidden;
      transition: box-shadow 0.2s;

      &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    }

    .card-color-bar {
      height: 4px;
      &.notices { background: var(--primary); }
      &.bylaws { background: var(--info); }
      &.reports { background: var(--warning); }
    }

    .card-body {
      padding: 16px 20px;

      .doc-type {
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        color: var(--text-secondary);
        letter-spacing: 0.5px;
      }

      h3 { font-size: 16px; font-weight: 500; margin: 8px 0; }

      .doc-date { font-size: 13px; color: var(--text-secondary); }
    }

    .empty-state {
      text-align: center;
      padding: 48px 20px;
      color: var(--text-secondary);
      svg { margin-bottom: 12px; }
    }

    .loading { display: flex; justify-content: center; padding: 48px; }
    .spinner {
      width: 32px; height: 32px;
      border: 3px solid var(--border); border-top-color: var(--primary);
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px;
    }

    .viewer-modal {
      width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;
    }

    .modal-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
      h2 { font-size: 18px; font-weight: 600; }
      .close-btn { background: none; border: none; font-size: 28px; color: var(--text-secondary); padding: 0 4px; }
    }

    .viewer-meta {
      display: flex; gap: 12px; margin-bottom: 16px;
      .doc-type { font-size: 12px; font-weight: 500; text-transform: uppercase; color: var(--primary); }
      .doc-date { font-size: 12px; color: var(--text-secondary); }
    }

    .viewer-content {
      font-size: 15px;
      line-height: 1.7;
      color: var(--text-secondary);
      white-space: pre-wrap;
    }

    .viewer-actions {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 640px) {
      .document-list { grid-template-columns: 1fr; }
    }
  `],
})
export class DocumentsComponent implements OnInit {
  private documentService = inject(DocumentService);

  documents: CoopDocument[] = [];
  filteredDocuments: CoopDocument[] = [];
  loading = true;
  activeFilter = 'all';
  selectedDocument: CoopDocument | null = null;

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading = true;
    // Try the combined endpoint first, fall back to published endpoints
    this.documentService.getAllDocuments().pipe(
      catchError(() => this.documentService.getPublishedDocuments().pipe(
        catchError(() => of([])),
      )),
    ).subscribe(docs => {
      this.documents = docs;
      this.applyFilter();
      this.loading = false;
    });
  }

  filterBy(filter: string) {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private applyFilter() {
    if (this.activeFilter === 'all') {
      this.filteredDocuments = [...this.documents];
    } else {
      this.filteredDocuments = this.documents.filter(d => {
        const type = (d.type || '').toLowerCase();
        return type === this.activeFilter || type.includes(this.activeFilter.replace('s', ''));
      });
    }
  }

  openDocument(doc: CoopDocument) {
    this.selectedDocument = doc;
  }

  downloadDocument(doc: CoopDocument) {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      // Create a text file download
      const blob = new Blob([doc.content || ''], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  formatType(type: string): string {
    if (!type) return 'Document';
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  getTypeColorClass(type: string): string {
    if (!type) return 'notices';
    const t = type.toLowerCase();
    if (t.includes('notice')) return 'notices';
    if (t.includes('bylaw')) return 'bylaws';
    if (t.includes('report')) return 'reports';
    return 'notices';
  }
}
