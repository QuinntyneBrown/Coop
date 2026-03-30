import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService, MaintenanceRequest, MaintenanceComment } from '../../core/services/maintenance.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="maintenance-page">
      <!-- Loading -->
      <div class="loading" *ngIf="loading" data-testid="maintenance-loading">
        <div class="spinner"></div>
      </div>

      <!-- Header -->
      <div class="page-header">
        <h1 data-testid="maintenance-page-title">Maintenance Requests</h1>
        <button class="btn btn-primary" data-testid="maintenance-create-btn" (click)="showCreateModal = true">
          + Create Request
        </button>
      </div>

      <!-- Filters -->
      <div class="filter-tabs">
        <button
          class="filter-tab"
          [class.active]="activeFilter === 'all'"
          data-testid="maintenance-filter-all"
          (click)="filterRequests('all')"
        >All</button>
        <button
          class="filter-tab"
          [class.active]="activeFilter === 'new'"
          data-testid="maintenance-filter-new"
          (click)="filterRequests('new')"
        >New</button>
        <button
          class="filter-tab"
          [class.active]="activeFilter === 'started'"
          data-testid="maintenance-filter-started"
          (click)="filterRequests('started')"
        >Started</button>
        <button
          class="filter-tab"
          [class.active]="activeFilter === 'done'"
          data-testid="maintenance-filter-done"
          (click)="filterRequests('done')"
        >Done</button>
      </div>

      <!-- Request List -->
      <div class="request-list" data-testid="maintenance-request-list" *ngIf="filteredRequests.length > 0">
        <div
          class="request-card card"
          *ngFor="let req of filteredRequests; let i = index"
          data-testid="maintenance-request-card"
          (click)="openDetail(req)"
        >
          <div class="request-card-header">
            <span class="status-badge" [class]="getStatusClass(req.status)">{{ req.status }}</span>
            <span class="priority-badge" [class]="getPriorityClass(req.priority)">{{ req.priority }}</span>
          </div>
          <h3>{{ req.title }}</h3>
          <p>{{ req.description | slice:0:100 }}{{ req.description?.length > 100 ? '...' : '' }}</p>
          <span class="request-date">{{ req.createdAt | date:'mediumDate' }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && filteredRequests.length === 0" data-testid="maintenance-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="1.5">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        <p>No maintenance requests found</p>
      </div>

      <!-- Create Modal -->
      <div class="modal-overlay" *ngIf="showCreateModal" data-testid="maintenance-create-modal">
        <div class="modal card">
          <div class="modal-header">
            <h2>Create New Request</h2>
            <button class="close-btn" data-testid="maintenance-cancel-btn" (click)="closeCreateModal()">&times;</button>
          </div>
          <form (ngSubmit)="submitRequest()" novalidate>
            <div class="form-group">
              <label for="title">Title</label>
              <input id="title" type="text" data-testid="maintenance-title-input" [(ngModel)]="newRequest.title" name="title" placeholder="Brief title for your request" [class.invalid]="createSubmitted && !newRequest.title" />
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" data-testid="maintenance-description-input" [(ngModel)]="newRequest.description" name="description" placeholder="Describe the issue in detail" [class.invalid]="createSubmitted && !newRequest.description"></textarea>
            </div>
            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" data-testid="maintenance-priority-select" [(ngModel)]="newRequest.priority" name="priority">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" data-testid="maintenance-category-select" [(ngModel)]="newRequest.category" name="category">
                <option value="General">General</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="Structural">Structural</option>
                <option value="Appliance">Appliance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group" data-testid="maintenance-photo-upload">
              <label>Photo (optional)</label>
              <div class="upload-area">
                <span>Upload photo</span>
                <input type="file" accept="image/*" (change)="onPhotoSelect($event)" />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" data-testid="maintenance-cancel-btn" (click)="closeCreateModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" data-testid="maintenance-submit-btn">Submit Request</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Detail Panel -->
      <div class="modal-overlay" *ngIf="selectedRequest" data-testid="maintenance-detail-panel">
        <div class="modal card detail-modal">
          <div class="modal-header">
            <h2 data-testid="maintenance-detail-title">{{ selectedRequest.title }}</h2>
            <button class="close-btn" (click)="selectedRequest = null">&times;</button>
          </div>
          <div class="detail-body">
            <div class="detail-meta">
              <span class="status-badge" [class]="getStatusClass(selectedRequest.status)" data-testid="maintenance-detail-status">{{ selectedRequest.status }}</span>
              <span class="priority-badge" [class]="getPriorityClass(selectedRequest.priority)" data-testid="maintenance-detail-priority">{{ selectedRequest.priority }}</span>
            </div>
            <p class="detail-desc" data-testid="maintenance-detail-description">{{ selectedRequest.description }}</p>

            <!-- Attachments -->
            <div class="attachments" data-testid="maintenance-attachment-list">
              <h4>Attachments</h4>
              <div class="attachment-item" *ngFor="let att of selectedRequest.attachments">
                <a [href]="att.url" target="_blank">{{ att.fileName }}</a>
              </div>
              <p *ngIf="!selectedRequest.attachments?.length" class="empty-text">No attachments</p>
            </div>

            <!-- Comments -->
            <div class="comments-section">
              <h4>Comments</h4>
              <div
                class="comment"
                *ngFor="let comment of selectedRequest.comments"
                data-testid="maintenance-detail-comment"
              >
                <div class="comment-header">
                  <strong>{{ comment.authorName }}</strong>
                  <span class="comment-date">{{ comment.createdAt | date:'short' }}</span>
                </div>
                <p>{{ comment.content }}</p>
              </div>
              <div class="add-comment">
                <input
                  type="text"
                  data-testid="maintenance-comment-input"
                  [(ngModel)]="newComment"
                  placeholder="Add a comment..."
                  (keyup.enter)="addComment()"
                />
                <button class="btn btn-primary" data-testid="maintenance-add-comment-btn" (click)="addComment()">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .maintenance-page {
      padding: 24px 16px;
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 { font-size: 22px; font-weight: 600; }
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

      &.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      &:hover:not(.active) { border-color: var(--primary); }
    }

    .request-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .request-card {
      cursor: pointer;
      transition: box-shadow 0.2s;

      &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

      .request-card-header { display: flex; gap: 8px; margin-bottom: 8px; }
      h3 { font-size: 16px; font-weight: 500; margin-bottom: 4px; }
      p { font-size: 14px; color: var(--text-secondary); line-height: 1.4; }
      .request-date { font-size: 12px; color: var(--text-secondary); margin-top: 8px; display: block; }
    }

    .status-badge {
      font-size: 12px;
      padding: 2px 10px;
      border-radius: 12px;
      font-weight: 500;
      text-transform: capitalize;

      &.new { background: #dcfce7; color: #166534; }
      &.started { background: #fef3c7; color: #92400e; }
      &.done { background: #dcfce7; color: #166534; }
    }

    .priority-badge {
      font-size: 12px;
      padding: 2px 10px;
      border-radius: 12px;
      font-weight: 500;

      &.high, &.urgent { background: #fee2e2; color: #991b1b; }
      &.medium { background: #fef3c7; color: #92400e; }
      &.low { background: #e0e7ff; color: #3730a3; }
    }

    .empty-state {
      text-align: center;
      padding: 48px 20px;
      color: var(--text-secondary);

      svg { margin-bottom: 12px; }
      p { font-size: 16px; }
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }

    .modal {
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h2 { font-size: 18px; font-weight: 600; }
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 28px;
        color: var(--text-secondary);
        line-height: 1;
        padding: 0 4px;
      }
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;

      .btn { flex: 1; }
    }

    .upload-area {
      border: 2px dashed var(--border);
      border-radius: var(--radius-md);
      padding: 16px;
      text-align: center;
      position: relative;
      cursor: pointer;

      span { font-size: 14px; color: var(--text-secondary); }
      input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    }

    .detail-modal {
      max-width: 600px;
    }

    .detail-meta {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .detail-desc {
      font-size: 15px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 20px;
    }

    .attachments {
      margin-bottom: 20px;
      h4 { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
      .attachment-item a { color: var(--primary); font-size: 14px; }
    }

    .comments-section {
      h4 { font-size: 15px; font-weight: 600; margin-bottom: 12px; }

      .comment {
        padding: 10px 0;
        border-bottom: 1px solid var(--border);

        .comment-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .comment-date { font-size: 12px; color: var(--text-secondary); }
        p { font-size: 14px; color: var(--text-secondary); }
      }
    }

    .add-comment {
      display: flex;
      gap: 8px;
      margin-top: 12px;

      input { flex: 1; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 14px; outline: none; }
      input:focus { border-color: var(--primary); }
    }

    .empty-text { font-size: 13px; color: var(--text-secondary); }

    input.invalid, textarea.invalid {
      border-color: var(--error);
    }
  `],
})
export class MaintenanceComponent implements OnInit {
  private maintenanceService = inject(MaintenanceService);

  requests: MaintenanceRequest[] = [];
  filteredRequests: MaintenanceRequest[] = [];
  loading = true;
  activeFilter = 'all';
  showCreateModal = false;
  createSubmitted = false;
  selectedRequest: MaintenanceRequest | null = null;
  newComment = '';
  newRequest = { title: '', description: '', priority: 'Medium', category: 'General' };

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.maintenanceService.getMyRequests().pipe(
      catchError(() => of([])),
    ).subscribe(requests => {
      this.requests = requests;
      this.applyFilter();
      this.loading = false;
    });
  }

  filterRequests(filter: string) {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private applyFilter() {
    if (this.activeFilter === 'all') {
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(r => {
        const status = (r.status || '').toLowerCase();
        switch (this.activeFilter) {
          case 'new': return status === 'new' || status === 'open';
          case 'started': return status === 'started' || status === 'in-progress' || status === 'inprogress';
          case 'done': return status === 'done' || status === 'completed' || status === 'closed';
          default: return true;
        }
      });
    }
  }

  submitRequest() {
    this.createSubmitted = true;
    if (!this.newRequest.title || !this.newRequest.description) return;

    this.maintenanceService.createRequest(this.newRequest).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadRequests();
      },
      error: () => {},
    });
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.createSubmitted = false;
    this.newRequest = { title: '', description: '', priority: 'Medium', category: 'General' };
  }

  openDetail(req: MaintenanceRequest) {
    // Reload with full details
    this.maintenanceService.getRequest(req.id).pipe(
      catchError(() => of(req)),
    ).subscribe(detail => {
      this.selectedRequest = {
        ...detail,
        comments: detail.comments || [],
        attachments: detail.attachments || [],
      };
    });
  }

  addComment() {
    if (!this.newComment.trim() || !this.selectedRequest) return;

    this.maintenanceService.addComment(this.selectedRequest.id, this.newComment).subscribe({
      next: (comment) => {
        if (this.selectedRequest) {
          this.selectedRequest.comments = [
            ...(this.selectedRequest.comments || []),
            comment,
          ];
        }
        this.newComment = '';
      },
      error: () => {},
    });
  }

  onPhotoSelect(event: Event) {
    // Photo upload stub
  }

  getStatusClass(status: string): string {
    if (!status) return 'new';
    const s = status.toLowerCase();
    if (s === 'new' || s === 'open') return 'new';
    if (s === 'started' || s.includes('progress')) return 'started';
    if (s === 'done' || s === 'completed' || s === 'closed') return 'done';
    return 'new';
  }

  getPriorityClass(priority: string): string {
    if (!priority) return 'medium';
    return priority.toLowerCase();
  }
}
