import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../core/services/document.service';
import { BottomTabBarComponent } from '../../shared/components/bottom-tab-bar.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomTabBarComponent],
  template: `
    <div class="documents-page">
      <div class="page-header">
        <h1 data-testid="documents-page-title">Documents</h1>
      </div>

      <div class="filter-tabs">
        <button class="filter-btn" [class.active]="activeFilter === 'all'" data-testid="documents-tab-all" [attr.data-active]="activeFilter === 'all' ? 'true' : null" (click)="filterBy('all')">All Documents</button>
        <button class="filter-btn" [class.active]="activeFilter === 'notices'" data-testid="documents-tab-notices" [attr.data-active]="activeFilter === 'notices' ? 'true' : null" (click)="filterBy('notices')">Notices</button>
        <button class="filter-btn" [class.active]="activeFilter === 'bylaws'" data-testid="documents-tab-bylaws" [attr.data-active]="activeFilter === 'bylaws' ? 'true' : null" (click)="filterBy('bylaws')">By-Laws</button>
        <button class="filter-btn" [class.active]="activeFilter === 'reports'" data-testid="documents-tab-reports" [attr.data-active]="activeFilter === 'reports' ? 'true' : null" (click)="filterBy('reports')">Reports</button>
      </div>

      <div class="documents-toolbar">
        <input type="text" class="search-input" placeholder="Search documents..." data-testid="documents-search" (input)="onSearchDocuments($event)" />
        <button class="btn btn-primary" data-testid="documents-new-button" (click)="openCreateDialog()">
          <span class="material-icons">add</span> New Document
        </button>
      </div>

      <div *ngIf="loading" data-testid="documents-loading" class="loading"><span class="material-icons spin">sync</span></div>

      <div class="documents-list" data-testid="documents-list" *ngIf="!loading && filteredDocuments.length > 0">
        <div *ngFor="let doc of filteredDocuments" class="document-card card" data-testid="document-card" (click)="openDocument(doc)">
          <div class="doc-icon" [ngClass]="getDocIconClass(doc)">
            <span class="material-icons">{{ getDocIcon(doc) }}</span>
          </div>
          <div class="doc-info">
            <h3 data-testid="document-title">{{ doc.name || doc.title }}</h3>
            <span class="doc-type" data-testid="document-type">{{ doc.documentType || doc.type || 'Document' }}</span>
            <span class="doc-date" data-testid="document-date">{{ doc.createdOn | date:'mediumDate' }}</span>
          </div>
          <span class="badge" [ngClass]="getStatusBadgeClass(doc)" data-testid="document-status-badge">
            {{ getStatusLabel(doc) }}
          </span>
          <button class="icon-btn delete-doc-btn" data-testid="document-delete-button" (click)="confirmDeleteDocument(doc, $event)">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </div>

      <div *ngIf="!loading && filteredDocuments.length === 0" data-testid="documents-empty-state" class="empty-state card">
        <span class="material-icons">description</span>
        <p>No documents found</p>
      </div>

      <!-- Create/Edit Document Dialog -->
      <div *ngIf="showDocumentDialog" class="modal-overlay" data-testid="document-dialog">
        <div class="modal-content card">
          <h3 data-testid="document-dialog-title">{{ editingDocument ? 'Edit Document' : 'New Document' }}</h3>
          <div class="form-group">
            <label>Title</label>
            <input type="text" data-testid="document-dialog-title-input" [(ngModel)]="dialogDoc.title" />
          </div>
          <div class="form-group">
            <label>Type</label>
            <select data-testid="document-dialog-type" [(ngModel)]="dialogDoc.type">
              <option value="Notice">Notice</option>
              <option value="ByLaw">By-Law</option>
              <option value="Report">Report</option>
            </select>
          </div>
          <div class="form-group">
            <label>Content</label>
            <textarea data-testid="document-dialog-content" [(ngModel)]="dialogDoc.content"></textarea>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select data-testid="document-dialog-status" [(ngModel)]="dialogDoc.status">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" data-testid="document-dialog-cancel" (click)="showDocumentDialog = false">Cancel</button>
            <button class="btn btn-primary" data-testid="document-dialog-save" (click)="saveDocument()">Save</button>
          </div>
        </div>
      </div>

      <!-- Delete Document Dialog -->
      <div *ngIf="showDeleteDocDialog" class="modal-overlay" data-testid="document-delete-dialog">
        <div class="modal-content card">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete this document?</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="showDeleteDocDialog = false">Cancel</button>
            <button class="btn btn-danger" data-testid="document-delete-confirm" (click)="deleteDocument()">Delete</button>
          </div>
        </div>
      </div>

      <!-- Document Viewer -->
      <div *ngIf="selectedDocument" class="modal-overlay" data-testid="document-viewer">
        <div class="modal-content card">
          <div class="viewer-header">
            <h2 data-testid="document-viewer-title">{{ selectedDocument.name || selectedDocument.title }}</h2>
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
    .documents-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .search-input { padding: 8px 14px; border: 1px solid #E5E4E1; border-radius: 8px; font-size: 14px; &:focus { outline: none; border-color: #3D8A5A; } }
    .delete-doc-btn { flex-shrink: 0; }
    .form-group { margin-bottom: 16px; label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; } input, textarea, select { width: 100%; padding: 10px 14px; border: 1px solid #E5E4E1; border-radius: 8px; font-size: 14px; &:focus { outline: none; border-color: #3D8A5A; } } textarea { min-height: 100px; resize: vertical; } }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
    .btn-danger { background: #DC3545; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
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
  showDocumentDialog = false;
  showDeleteDocDialog = false;
  editingDocument: any = null;
  deletingDocument: any = null;
  dialogDoc: any = { title: '', type: 'Notice', content: '', status: 'Draft' };

  ngOnInit(): void {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    this.loading = true;
    this.documentService.getDocuments().subscribe({
      next: (data: any) => {
        this.documents = Array.isArray(data) ? data : (data?.documents || []);
        // Sort newest first
        this.documents.sort((a: any, b: any) => {
          const dateA = new Date(a.createdOn || 0).getTime();
          const dateB = new Date(b.createdOn || 0).getTime();
          return dateB - dateA;
        });
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.documents = []; this.filteredDocuments = []; this.loading = false; }
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

  onSearchDocuments(event: any): void {
    const query = (event.target.value || '').toLowerCase();
    if (!query) {
      this.applyFilter();
      return;
    }
    this.filteredDocuments = this.documents.filter(d =>
      (d.name || d.title || '').toLowerCase().includes(query)
    );
  }

  getStatusLabel(doc: any): string {
    if (doc.status) return doc.status;
    if (doc.published === true) return 'Published';
    return 'Draft';
  }

  getStatusBadgeClass(doc: any): string {
    const status = this.getStatusLabel(doc);
    return status === 'Published' ? 'badge-success' : 'badge-warning';
  }

  openCreateDialog(): void {
    this.editingDocument = null;
    this.dialogDoc = { title: '', type: 'Notice', content: '', status: 'Draft' };
    this.showDocumentDialog = true;
  }

  saveDocument(): void {
    if (!this.dialogDoc.title || this.dialogDoc.title.trim() === '') {
      return;
    }
    const payload = {
      name: this.dialogDoc.title,
      body: this.dialogDoc.content
    };
    this.documentService.createDocument(payload).subscribe({
      next: () => {
        this.showDocumentDialog = false;
        this.loadDocuments();
      },
      error: () => {
        this.showDocumentDialog = false;
        this.loadDocuments();
      }
    });
  }

  confirmDeleteDocument(doc: any, event: Event): void {
    event.stopPropagation();
    this.deletingDocument = doc;
    this.showDeleteDocDialog = true;
  }

  deleteDocument(): void {
    if (this.deletingDocument?.documentId) {
      this.documentService.deleteDocument(this.deletingDocument.documentId).subscribe({
        next: () => {
          this.showDeleteDocDialog = false;
          this.loadDocuments();
        },
        error: () => {
          this.showDeleteDocDialog = false;
          this.loadDocuments();
        }
      });
    } else {
      this.showDeleteDocDialog = false;
      this.loadDocuments();
    }
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
