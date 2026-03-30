import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { BottomTabBarComponent } from '../../shared/components/bottom-tab-bar.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, BottomTabBarComponent],
  template: `
    <div class="documents-page">
      <div class="page-header">
        <h1 data-testid="documents-page-title">Documents</h1>
      </div>

      <div class="filter-tabs" data-testid="documents-filter-tabs">
        <button class="filter-btn" [class.active]="activeFilter === 'all'" data-testid="documents-filter-all" (click)="filterBy('all')">All Documents</button>
        <button class="filter-btn" [class.active]="activeFilter === 'notices'" data-testid="documents-filter-notices" (click)="filterBy('notices')">Notices</button>
        <button class="filter-btn" [class.active]="activeFilter === 'bylaws'" data-testid="documents-filter-bylaws" (click)="filterBy('bylaws')">By-Laws</button>
        <button class="filter-btn" [class.active]="activeFilter === 'reports'" data-testid="documents-filter-reports" (click)="filterBy('reports')">Reports</button>
      </div>

      <div *ngIf="loading" data-testid="documents-loading" class="loading"><span class="material-icons spin">sync</span></div>

      <div class="documents-list" data-testid="documents-list" *ngIf="!loading && filteredDocuments.length > 0">
        <div *ngFor="let doc of filteredDocuments" class="document-card card" data-testid="document-card" (click)="openDocument(doc)">
          <div class="doc-icon" [ngClass]="getDocIconClass(doc)">
            <span class="material-icons">{{ getDocIcon(doc) }}</span>
          </div>
          <div class="doc-info">
            <h3 data-testid="document-card-title">{{ doc.title || doc.name }}</h3>
            <span class="doc-type" data-testid="document-card-type">{{ doc.documentType || doc.type || 'Document' }}</span>
            <span class="doc-date" data-testid="document-card-date">{{ doc.publishedOn || doc.createdOn | date:'mediumDate' }}</span>
          </div>
          <span class="badge" [ngClass]="doc.status === 'Published' ? 'badge-success' : 'badge-warning'">
            {{ doc.status || 'Draft' }}
          </span>
        </div>
      </div>

      <div *ngIf="!loading && filteredDocuments.length === 0" data-testid="documents-empty-state" class="empty-state card">
        <span class="material-icons">description</span>
        <p>No documents found</p>
      </div>

      <!-- Document Viewer -->
      <div *ngIf="selectedDocument" class="modal-overlay" data-testid="document-viewer">
        <div class="modal-content card">
          <div class="viewer-header">
            <h2 data-testid="document-viewer-title">{{ selectedDocument.title || selectedDocument.name }}</h2>
            <button class="icon-btn" data-testid="document-viewer-close" (click)="closeDocument()">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="viewer-body" data-testid="document-viewer-content">
            <p>{{ selectedDocument.body || selectedDocument.content || selectedDocument.description || 'No content available' }}</p>
          </div>
          <div class="viewer-footer">
            <button class="btn btn-primary" data-testid="document-download-btn">
              <span class="material-icons">download</span> Download
            </button>
          </div>
        </div>
      </div>

      <app-bottom-tab-bar class="mobile-only"></app-bottom-tab-bar>
    </div>
  `,
  styles: [`
    .documents-page { min-height: 100vh; background: #F5F4F1; padding: 24px; padding-bottom: 80px; }
    .page-header { margin-bottom: 20px;
      h1 { font-size: 24px; font-weight: 600; }
    }
    .filter-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .filter-btn {
      padding: 8px 16px; border: 1px solid #E5E4E1; border-radius: 20px;
      background: #fff; font-size: 14px; cursor: pointer;
      &.active { background: #3D8A5A; color: #fff; border-color: #3D8A5A; }
    }
    .documents-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .document-card {
      padding: 20px; cursor: pointer; display: flex; align-items: center; gap: 16px;
      transition: border-color 0.2s;
      &:hover { border-color: #3D8A5A; }
    }
    .doc-icon {
      width: 48px; height: 48px; border-radius: 12px; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
      &.notice { background: rgba(61,138,90,0.1); color: #3D8A5A; }
      &.bylaw { background: rgba(59,130,246,0.1); color: #3B82F6; }
      &.report { background: rgba(245,158,11,0.1); color: #D97706; }
      &.default { background: rgba(26,25,24,0.06); color: #1A1918CC; }
    }
    .doc-info { flex: 1;
      h3 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
      .doc-type { font-size: 12px; color: #1A1918CC; margin-right: 12px; }
      .doc-date { font-size: 12px; color: #1A1918CC; }
    }
    .empty-state { padding: 40px; text-align: center; color: #1A1918CC;
      .material-icons { font-size: 48px; margin-bottom: 8px; }
    }
    .loading { text-align: center; padding: 40px; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5); display: flex; align-items: center;
      justify-content: center; z-index: 1000; padding: 20px;
    }
    .modal-content { width: 100%; max-width: 700px; max-height: 80vh; overflow-y: auto; }
    .viewer-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 20px 24px; border-bottom: 1px solid #E5E4E1;
      h2 { font-size: 18px; }
    }
    .viewer-body { padding: 24px; font-size: 14px; line-height: 1.6; }
    .viewer-footer { padding: 16px 24px; border-top: 1px solid #E5E4E1; display: flex; justify-content: flex-end; }
    .icon-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 8px;
      &:hover { background: #F5F4F1; }
    }
    .mobile-only { display: none; }
    @media (max-width: 768px) { .mobile-only { display: block; } }
  `]
})
export class DocumentsComponent implements OnInit {
  private documentService = inject(DocumentService);

  documents: any[] = [];
  filteredDocuments: any[] = [];
  selectedDocument: any = null;
  activeFilter = 'all';
  loading = true;

  ngOnInit(): void {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    this.loading = true;
    this.documentService.getPublishedDocuments().subscribe({
      next: (data: any) => {
        this.documents = Array.isArray(data) ? data : (data?.documents || []);
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.documentService.getDocuments().subscribe({
          next: (data: any) => {
            this.documents = Array.isArray(data) ? data : (data?.documents || []);
            this.applyFilter();
            this.loading = false;
          },
          error: () => { this.documents = []; this.filteredDocuments = []; this.loading = false; }
        });
      }
    });
  }

  filterBy(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredDocuments = [...this.documents];
    } else {
      const typeMap: Record<string, string[]> = {
        notices: ['Notice'],
        bylaws: ['ByLaw', 'By-Law', 'Bylaw'],
        reports: ['Report']
      };
      const types = typeMap[this.activeFilter] || [];
      this.filteredDocuments = this.documents.filter(d =>
        types.some(t => (d.documentType || d.type || '').toLowerCase() === t.toLowerCase())
      );
    }
  }

  openDocument(doc: any): void {
    this.selectedDocument = doc;
  }

  closeDocument(): void {
    this.selectedDocument = null;
  }

  getDocIcon(doc: any): string {
    const type = (doc.documentType || doc.type || '').toLowerCase();
    if (type.includes('notice')) return 'campaign';
    if (type.includes('law')) return 'gavel';
    if (type.includes('report')) return 'assessment';
    return 'description';
  }

  getDocIconClass(doc: any): string {
    const type = (doc.documentType || doc.type || '').toLowerCase();
    if (type.includes('notice')) return 'notice';
    if (type.includes('law')) return 'bylaw';
    if (type.includes('report')) return 'report';
    return 'default';
  }
}
