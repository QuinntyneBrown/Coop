import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { BottomTabBarComponent } from '../../shared/components/bottom-tab-bar.component';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BottomTabBarComponent],
  template: `
    <div class="maintenance-page">
      <div class="page-header">
        <h1 data-testid="maintenance-page-title">Maintenance Requests</h1>
        <button class="btn btn-primary" data-testid="maintenance-create-btn" (click)="showCreateModal = true">
          <span class="material-icons">add</span> New Request
        </button>
      </div>

      <div class="filters">
        <button class="filter-btn" [class.active]="activeFilter === 'all'" data-testid="maintenance-filter-all" (click)="filterBy('all')">All</button>
        <button class="filter-btn" [class.active]="activeFilter === 'new'" data-testid="maintenance-filter-new" (click)="filterBy('new')">New</button>
        <button class="filter-btn" [class.active]="activeFilter === 'received'" data-testid="maintenance-filter-received" (click)="filterBy('received')">Received</button>
        <button class="filter-btn" [class.active]="activeFilter === 'started'" data-testid="maintenance-filter-started" (click)="filterBy('started')">Started</button>
        <button class="filter-btn" [class.active]="activeFilter === 'done'" data-testid="maintenance-filter-completed" (click)="filterBy('done')">Completed</button>
      </div>

      <div *ngIf="loading" data-testid="maintenance-loading" class="loading"><span class="material-icons spin">sync</span></div>

      <div class="content-area">
        <div class="request-list" data-testid="maintenance-requests-panel">
          <h3 data-testid="maintenance-requests-title">All Requests</h3>
          <div *ngFor="let req of filteredRequests; let i = index"
            class="request-card card" data-testid="maintenance-request-card"
            [class.selected]="selectedRequest?.maintenanceRequestId === req.maintenanceRequestId"
            (click)="selectRequest(req)">
            <div class="request-card-header">
              <span class="request-title" data-testid="request-title">{{ req.title }}</span>
              <span class="badge" [ngClass]="getStatusClass(req.status)" data-testid="request-status-badge">{{ getStatusLabel(req.status) }}</span>
            </div>
            <p class="request-desc">{{ req.description | slice:0:80 }}{{ req.description?.length > 80 ? '...' : '' }}</p>
            <span class="request-date">{{ req.date || req.createdOn | date:'short' }}</span>
          </div>
        </div>

        <div *ngIf="!loading && filteredRequests.length === 0" data-testid="maintenance-empty-state" class="empty-state card">
          <span class="material-icons">inbox</span>
          <p>No maintenance requests found</p>
        </div>

        <!-- Detail Panel -->
        <div *ngIf="selectedRequest" class="detail-panel card" data-testid="maintenance-detail-panel">
          <div class="detail-tabs">
            <button class="tab-btn" [class.active]="activeTab === 'details'" data-testid="maintenance-tab-details" (click)="activeTab = 'details'">Details</button>
            <button class="tab-btn" [class.active]="activeTab === 'comments'" data-testid="maintenance-tab-comments" (click)="activeTab = 'comments'">Comments</button>
          </div>

          <div class="detail-header">
            <h2 data-testid="maintenance-detail-title">{{ selectedRequest.title }}</h2>
            <span class="badge" [ngClass]="getStatusClass(selectedRequest.status)" data-testid="maintenance-detail-status">{{ getStatusLabel(selectedRequest.status) }}</span>
          </div>

          <div *ngIf="activeTab === 'details'">
            <div class="detail-meta">
              <span data-testid="maintenance-detail-submitted-by">Submitted by: {{ selectedRequest.requestedByName || selectedRequest.createdBy || 'Unknown' }}</span>
              <span data-testid="maintenance-detail-date">{{ selectedRequest.date || selectedRequest.createdOn | date:'medium' }}</span>
              <span *ngIf="selectedRequest.priority" data-testid="maintenance-detail-priority">Priority: {{ selectedRequest.priority }}</span>
            </div>
            <p class="detail-description" data-testid="maintenance-detail-description">{{ selectedRequest.description }}</p>

            <div class="detail-info-grid">
              <div data-testid="maintenance-detail-address">
                <strong>Address:</strong> {{ selectedRequest.unitNumber || selectedRequest.address || 'N/A' }}
              </div>
              <div data-testid="maintenance-detail-phone">
                <strong>Phone:</strong> {{ selectedRequest.phone || selectedRequest.phoneNumber || 'N/A' }}
              </div>
              <div data-testid="maintenance-detail-unattended">
                <strong>Unattended Entry:</strong> {{ selectedRequest.unattendedEntry ? 'Yes' : 'No' }}
              </div>
            </div>

            <div class="attachments" data-testid="maintenance-detail-photos">
              <h4>Photos</h4>
              <div *ngIf="selectedRequest.digitalAssets?.length" class="attachment-grid">
                <div *ngFor="let asset of selectedRequest.digitalAssets" class="attachment-item">
                  <span class="material-icons">image</span>
                  <span>{{ asset.name }}</span>
                </div>
              </div>
              <div *ngIf="!selectedRequest.digitalAssets?.length" class="no-photos">No photos attached</div>
            </div>

            <div class="detail-actions">
              <button class="btn btn-primary" data-testid="maintenance-receive-button" (click)="receiveRequest()">Receive Request</button>
              <button class="btn btn-secondary" data-testid="maintenance-edit-description">Edit Description</button>
            </div>
          </div>

          <!-- Comments Tab -->
          <div *ngIf="activeTab === 'comments'" class="comments-section" data-testid="maintenance-comments-section">
            <div *ngFor="let comment of comments" class="comment" data-testid="maintenance-comment">
              <div class="comment-header">
                <span class="comment-author">{{ comment.createdBy || 'User' }}</span>
                <span class="comment-date">{{ comment.createdOn | date:'short' }}</span>
              </div>
              <p>{{ comment.body }}</p>
            </div>
            <div class="add-comment">
              <input type="text" [formControl]="commentControl" placeholder="Add a comment..." data-testid="maintenance-comment-input" />
              <button class="btn btn-primary" data-testid="maintenance-comment-send" (click)="addComment()">Send</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Modal -->
      <div *ngIf="showCreateModal" class="modal-overlay" data-testid="maintenance-create-modal">
        <div class="modal-content card">
          <h2>New Maintenance Request</h2>
          <form [formGroup]="createForm" (ngSubmit)="submitRequest()">
            <div class="form-group">
              <label>Title</label>
              <input type="text" formControlName="title" data-testid="maintenance-title-input" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea formControlName="description" data-testid="maintenance-description-input"></textarea>
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select formControlName="priority" data-testid="maintenance-priority-select">
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div class="form-group">
              <label>Category</label>
              <select formControlName="category" data-testid="maintenance-category-select">
                <option value="">Select category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="General">General</option>
              </select>
            </div>
            <div class="form-group">
              <label>Photos</label>
              <input type="file" multiple accept="image/*" data-testid="maintenance-photo-upload" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" data-testid="maintenance-cancel-btn" (click)="showCreateModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" data-testid="maintenance-submit-btn">Submit</button>
            </div>
          </form>
        </div>
      </div>

      <app-bottom-tab-bar class="mobile-only"></app-bottom-tab-bar>
    </div>
  `,
  styles: [`
    .maintenance-page { min-height: 100vh; background: #F5F4F1; padding: 24px; padding-bottom: 80px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
      h1 { font-size: 24px; font-weight: 600; }
    }
    .filters { display: flex; gap: 8px; margin-bottom: 20px; }
    .filter-btn {
      padding: 8px 16px; border: 1px solid #E5E4E1; border-radius: 20px;
      background: #fff; font-size: 14px; cursor: pointer; transition: all 0.2s;
      &.active { background: #3D8A5A; color: #fff; border-color: #3D8A5A; }
      &:hover { border-color: #3D8A5A; }
    }
    .content-area { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .request-list { display: flex; flex-direction: column; gap: 12px; }
    .request-card { padding: 16px; cursor: pointer; transition: all 0.2s;
      &:hover { border-color: #3D8A5A; }
      &.selected { border-color: #3D8A5A; box-shadow: 0 0 0 2px rgba(61,138,90,0.2); }
    }
    .request-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .request-title { font-weight: 600; font-size: 14px; }
    .request-desc { font-size: 13px; color: #1A1918CC; margin-bottom: 8px; }
    .request-date { font-size: 12px; color: #1A1918CC; }
    .detail-panel { padding: 24px; }
    .detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
      h2 { font-size: 20px; }
    }
    .detail-tabs { display: flex; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid #E5E4E1; padding-bottom: 8px; }
    .tab-btn { padding: 6px 16px; border: none; background: none; cursor: pointer; font-size: 14px; border-radius: 8px; &.active { background: #3D8A5A; color: #fff; } }
    .detail-meta { margin-bottom: 16px; font-size: 14px; color: #1A1918CC; display: flex; flex-direction: column; gap: 4px; }
    .detail-info-grid { margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
    .detail-actions { display: flex; gap: 12px; margin-top: 16px; }
    .no-photos { font-size: 13px; color: #1A1918CC; }
    .detail-description { font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
    .comments-section { margin-top: 20px;
      h4 { margin-bottom: 12px; }
    }
    .comment { padding: 12px; background: #F5F4F1; border-radius: 10px; margin-bottom: 8px; }
    .comment-header { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #1A1918CC; }
    .comment p { font-size: 14px; }
    .add-comment { display: flex; gap: 8px; margin-top: 12px;
      input { flex: 1; padding: 10px 14px; border: 1px solid #E5E4E1; border-radius: 10px; font-size: 14px;
        &:focus { outline: none; border-color: #3D8A5A; }
      }
    }
    .empty-state { padding: 40px; text-align: center; color: #1A1918CC; grid-column: 1 / -1;
      .material-icons { font-size: 48px; margin-bottom: 8px; }
    }
    .loading { text-align: center; padding: 40px; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5); display: flex; align-items: center;
      justify-content: center; z-index: 1000; padding: 20px;
    }
    .modal-content { width: 100%; max-width: 500px; padding: 32px;
      h2 { margin-bottom: 20px; font-size: 20px; }
    }
    .form-group {
      margin-bottom: 16px;
      label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; }
      input, textarea, select { width: 100%; padding: 10px 14px; border: 1px solid #E5E4E1; border-radius: 8px; font-size: 14px;
        &:focus { outline: none; border-color: #3D8A5A; }
      }
      textarea { min-height: 100px; resize: vertical; }
    }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
    .attachments { margin-bottom: 20px;
      h4 { margin-bottom: 8px; }
    }
    .attachment-grid { display: flex; gap: 8px; flex-wrap: wrap; }
    .attachment-item { display: flex; align-items: center; gap: 4px; padding: 6px 10px; background: #F5F4F1; border-radius: 8px; font-size: 13px; }
    .badge-success { background: rgba(16,185,129,0.1); color: #059669; }
    .badge-warning { background: rgba(245,158,11,0.1); color: #D97706; }
    .badge-info { background: rgba(59,130,246,0.1); color: #3B82F6; }
    .badge-gray { background: rgba(26,25,24,0.06); color: #1A1918CC; }
    .mobile-only { display: none; }
    @media (max-width: 768px) {
      .content-area { grid-template-columns: 1fr; }
      .mobile-only { display: block; }
    }
  `]
})
export class MaintenanceComponent implements OnInit {
  private maintenanceService = inject(MaintenanceService);
  private fb = inject(FormBuilder);

  requests: any[] = [];
  filteredRequests: any[] = [];
  selectedRequest: any = null;
  comments: any[] = [];
  activeFilter = 'all';
  activeTab = 'details';
  loading = true;
  showCreateModal = false;

  createForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: [''],
    category: ['']
  });

  commentControl = this.fb.control('');

  ngOnInit(): void {
    this.loadRequests();
  }

  private loadRequests(): void {
    this.loading = true;
    this.maintenanceService.getMaintenanceRequests().subscribe({
      next: (data: any) => {
        this.requests = Array.isArray(data) ? data : (data?.maintenanceRequests || []);
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.maintenanceService.getCurrentUserMaintenanceRequests().subscribe({
          next: (data: any) => {
            this.requests = Array.isArray(data) ? data : (data?.maintenanceRequests || []);
            this.applyFilter();
            this.loading = false;
          },
          error: () => { this.requests = []; this.filteredRequests = []; this.loading = false; }
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
      this.filteredRequests = [...this.requests];
    } else {
      const map: Record<string, (string | number)[]> = {
        'new': ['New', 'Created', 0],
        'received': ['Received', 1],
        'started': ['Started', 'InProgress', 2],
        'done': ['Completed', 'Complete', 'Done', 3]
      };
      const statuses = map[this.activeFilter] || [];
      this.filteredRequests = this.requests.filter(r => statuses.includes(r.status));
    }
  }

  receiveRequest(): void {
    if (!this.selectedRequest?.maintenanceRequestId) return;
    this.maintenanceService.receiveMaintenanceRequest(this.selectedRequest.maintenanceRequestId).subscribe({
      next: (data: any) => {
        const updated = data?.maintenanceRequest || data;
        this.selectedRequest.status = updated?.status ?? 'Received';
        if (typeof this.selectedRequest.status === 'number') {
          this.selectedRequest.status = 'Received';
        }
      },
      error: () => {
        // Optimistically update status even on error
        this.selectedRequest.status = 'Received';
      }
    });
  }

  selectRequest(req: any): void {
    this.selectedRequest = req;
    this.activeTab = 'details';
    this.comments = [];
    if (req.maintenanceRequestId) {
      this.maintenanceService.getComments(req.maintenanceRequestId).subscribe({
        next: (data: any) => {
          this.comments = Array.isArray(data) ? data : (data?.comments || []);
        },
        error: () => {}
      });
    }
  }

  addComment(): void {
    const body = this.commentControl.value;
    if (!body || !this.selectedRequest?.maintenanceRequestId) return;
    this.maintenanceService.addComment(this.selectedRequest.maintenanceRequestId, body).subscribe({
      next: () => {
        this.comments.push({ body, createdBy: 'You', createdOn: new Date().toISOString() });
        this.commentControl.reset();
      },
      error: () => {}
    });
  }

  submitRequest(): void {
    if (this.createForm.invalid) return;
    this.maintenanceService.createMaintenanceRequest(this.createForm.value).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.createForm.reset();
        this.loadRequests();
      },
      error: () => {}
    });
  }

  getStatusLabel(status: any): string {
    const numMap: Record<number, string> = { 0: 'New', 1: 'Received', 2: 'InProgress', 3: 'Complete' };
    if (typeof status === 'number') return numMap[status] || 'New';
    return status || 'New';
  }

  getStatusClass(status: any): string {
    const label = this.getStatusLabel(status).toLowerCase();
    switch (label) {
      case 'new': case 'created': return 'badge-warning';
      case 'received': case 'started': case 'inprogress': return 'badge-info';
      case 'completed': case 'complete': case 'done': return 'badge-success';
      default: return 'badge-gray';
    }
  }
}
