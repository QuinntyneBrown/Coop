import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { ProfileService } from '../../core/services/profile.service';
import { BottomTabBarComponent } from '../../shared/components/bottom-tab-bar.component';
import { MaintenanceStep } from './maintenance-step';
import { nextMaintenanceStep } from './next-maintenance-step';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BottomTabBarComponent],
  template: `
    <div class="maintenance-page">
      <div class="page-header">
        <h1 data-testid="maintenance-page-title">Maintenance Requests</h1>
        <button
          class="btn btn-primary"
          data-testid="maintenance-create-btn"
          (click)="showCreateModal = true"
        >
          <span class="material-icons">add</span> New Request
        </button>
      </div>

      <div class="filters">
        <button
          class="filter-btn"
          [class.active]="activeFilter === 'all'"
          data-testid="maintenance-filter-all"
          (click)="filterBy('all')"
        >
          All
        </button>
        <button
          class="filter-btn"
          [class.active]="activeFilter === 'new'"
          data-testid="maintenance-filter-new"
          (click)="filterBy('new')"
        >
          New
        </button>
        <button
          class="filter-btn"
          [class.active]="activeFilter === 'received'"
          data-testid="maintenance-filter-received"
          (click)="filterBy('received')"
        >
          Received
        </button>
        <button
          class="filter-btn"
          [class.active]="activeFilter === 'started'"
          data-testid="maintenance-filter-started"
          (click)="filterBy('started')"
        >
          Started
        </button>
        <button
          class="filter-btn"
          [class.active]="activeFilter === 'done'"
          data-testid="maintenance-filter-completed"
          (click)="filterBy('done')"
        >
          Completed
        </button>
      </div>

      @if (loading) {
        <div data-testid="maintenance-loading" class="loading">
          <span class="material-icons spin">sync</span>
        </div>
      }

      <div class="content-area">
        <div class="request-list" data-testid="maintenance-requests-panel">
          <h3 data-testid="maintenance-requests-title">All Requests</h3>
          @for (req of filteredRequests; track req; let i = $index) {
            <div
              class="request-card card"
              data-testid="maintenance-request-card"
              [class.selected]="selectedRequest?.maintenanceRequestId === req.maintenanceRequestId"
              (click)="selectRequest(req)"
            >
              <div class="request-card-header">
                <span class="request-title" data-testid="request-title">{{ req.title }}</span>
                <span
                  class="badge"
                  [ngClass]="getStatusClass(req.status)"
                  data-testid="request-status-badge"
                  >{{ getStatusLabel(req.status) }}</span
                >
              </div>
              <p class="request-desc">
                {{ req.description | slice: 0 : 80 }}{{ req.description?.length > 80 ? '...' : '' }}
              </p>
              <span class="request-date">{{
                req.date || req.createdOn | date: 'MMM d, y, h:mm a'
              }}</span>
            </div>
          }
        </div>

        @if (!loading && filteredRequests.length === 0) {
          <div data-testid="maintenance-empty-state" class="empty-state card">
            <span class="material-icons">inbox</span>
            <p>No maintenance requests found</p>
          </div>
        }

        <!-- Detail Panel -->
        @if (selectedRequest) {
          <div class="detail-panel card" data-testid="maintenance-detail-panel">
            <div class="detail-tabs">
              <button
                class="tab-btn"
                [class.active]="activeTab === 'details'"
                data-testid="maintenance-tab-details"
                (click)="activeTab = 'details'"
              >
                Details
              </button>
              <button
                class="tab-btn"
                [class.active]="activeTab === 'comments'"
                data-testid="maintenance-tab-comments"
                (click)="activeTab = 'comments'"
              >
                Comments
              </button>
            </div>
            <div class="detail-header">
              <h2 data-testid="maintenance-detail-title">{{ selectedRequest.title }}</h2>
              <span
                class="badge"
                [ngClass]="getStatusClass(selectedRequest.status)"
                data-testid="maintenance-detail-status"
                >{{ getStatusLabel(selectedRequest.status) }}</span
              >
            </div>
            @if (activeTab === 'details') {
              <div>
                <div class="detail-meta">
                  <span class="submitted-by" data-testid="maintenance-detail-submitted-by">
                    @if (submitterPhotoUrl) {
                      <img
                        class="submitter-photo"
                        [src]="submitterPhotoUrl"
                        alt=""
                        data-testid="maintenance-detail-submitter-photo"
                      />
                    }
                    Submitted by:
                    {{
                      selectedRequest.requestedByName || selectedRequest.createdBy || 'Unknown'
                    }}</span
                  >
                  <span data-testid="maintenance-detail-date">{{
                    selectedRequest.date || selectedRequest.createdOn | date: 'MMM d, y, h:mm a'
                  }}</span>
                  @if (selectedRequest.priority) {
                    <span data-testid="maintenance-detail-priority"
                      >Priority: {{ selectedRequest.priority }}</span
                    >
                  }
                </div>
                <p class="detail-description" data-testid="maintenance-detail-description">
                  {{ selectedRequest.description }}
                </p>
                <div class="detail-info-grid">
                  <div data-testid="maintenance-detail-address">
                    <strong>Address:</strong>
                    {{ selectedRequest.unitNumber || selectedRequest.address || 'N/A' }}
                  </div>
                  <div data-testid="maintenance-detail-phone">
                    <strong>Phone:</strong>
                    {{ selectedRequest.phone || selectedRequest.phoneNumber || 'N/A' }}
                  </div>
                  <div data-testid="maintenance-detail-unattended">
                    <strong>Unattended Entry:</strong>
                    {{ selectedRequest.unattendedEntry ? 'Yes' : 'No' }}
                  </div>
                </div>
                <div class="attachments" data-testid="maintenance-detail-photos">
                  <h4>Photos</h4>
                  @if (selectedRequest.digitalAssets?.length) {
                    <ul class="attachment-grid">
                      @for (
                        asset of selectedRequest.digitalAssets;
                        track asset.digitalAssetId;
                        let i = $index
                      ) {
                        <li class="attachment-item" data-testid="maintenance-detail-photo">
                          @if (photoUrls[asset.digitalAssetId]) {
                            <a
                              [href]="photoUrls[asset.digitalAssetId]"
                              target="_blank"
                              rel="noopener"
                            >
                              <img
                                [src]="photoUrls[asset.digitalAssetId]"
                                [alt]="'Photo ' + (i + 1) + ' of ' + selectedRequest.title"
                              />
                            </a>
                          } @else {
                            <span class="material-icons" aria-hidden="true">image</span>
                            <span>Loading photo…</span>
                          }
                        </li>
                      }
                    </ul>
                  }
                  @if (!selectedRequest.digitalAssets?.length) {
                    <div class="no-photos">No photos attached</div>
                  }
                </div>
                <div class="detail-actions">
                  @if (nextStep(selectedRequest.status); as step) {
                    <button
                      class="btn btn-primary"
                      [attr.data-testid]="step.testId"
                      [disabled]="advancing"
                      (click)="advance(step)"
                    >
                      {{ step.label }}
                    </button>
                  }
                  <button class="btn btn-secondary" data-testid="maintenance-edit-description">
                    Edit Description
                  </button>
                </div>
                @if (stepFailed) {
                  <p class="step-error" role="alert" data-testid="maintenance-step-error">
                    That change was not saved. Please try again.
                  </p>
                }
              </div>
            }
            <!-- Comments Tab -->
            @if (activeTab === 'comments') {
              <div class="comments-section" data-testid="maintenance-comments-section">
                @for (comment of comments; track comment) {
                  <div class="comment" data-testid="maintenance-comment">
                    <div class="comment-header">
                      <span class="comment-author">{{ comment.createdBy || 'User' }}</span>
                      <span class="comment-date">{{
                        comment.createdOn | date: 'MMM d, y, h:mm a'
                      }}</span>
                    </div>
                    <p>{{ comment.body }}</p>
                  </div>
                }
                <div class="add-comment">
                  <input
                    type="text"
                    [formControl]="commentControl"
                    placeholder="Add a comment..."
                    data-testid="maintenance-comment-input"
                  />
                  <button
                    class="btn btn-primary"
                    data-testid="maintenance-comment-send"
                    (click)="addComment()"
                  >
                    Send
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Create Modal -->
      @if (showCreateModal) {
        <div class="modal-overlay" data-testid="maintenance-create-modal">
          <div class="modal-content card">
            <h2>New Maintenance Request</h2>
            <form [formGroup]="createForm" (ngSubmit)="submitRequest()">
              <div class="form-group">
                <label>Title</label>
                <input type="text" formControlName="title" data-testid="maintenance-title-input" />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea
                  formControlName="description"
                  data-testid="maintenance-description-input"
                ></textarea>
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
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  data-testid="maintenance-photo-upload"
                />
              </div>
              <div class="modal-actions">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-testid="maintenance-cancel-btn"
                  (click)="showCreateModal = false"
                >
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" data-testid="maintenance-submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <app-bottom-tab-bar class="mobile-only"></app-bottom-tab-bar>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .maintenance-page {
        min-height: 100vh;
        background: #f5f4f1;
        padding: 24px;
        padding-bottom: 80px;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        h1 {
          font-size: 24px;
          font-weight: 600;
        }
      }
      .filters {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 20px;
      }
      .filter-btn {
        padding: 8px 16px;
        border: 1px solid #e5e4e1;
        border-radius: 20px;
        background: #fff;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        &.active {
          background: #3d8a5a;
          color: #fff;
          border-color: #3d8a5a;
        }
        &:hover {
          border-color: #3d8a5a;
        }
      }
      .content-area {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .request-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .request-card {
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          border-color: #3d8a5a;
        }
        &.selected {
          border-color: #3d8a5a;
          box-shadow: 0 0 0 2px rgba(61, 138, 90, 0.2);
        }
      }
      .request-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .request-title {
        font-weight: 600;
        font-size: 14px;
      }
      .request-desc {
        font-size: 13px;
        color: #1a1918cc;
        margin-bottom: 8px;
      }
      .request-date {
        font-size: 12px;
        color: #1a1918cc;
      }
      .detail-panel {
        padding: 24px;
      }
      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        h2 {
          font-size: 20px;
        }
      }
      .detail-tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 16px;
        border-bottom: 1px solid #e5e4e1;
        padding-bottom: 8px;
      }
      .tab-btn {
        padding: 6px 16px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 14px;
        border-radius: 8px;
        &.active {
          background: #3d8a5a;
          color: #fff;
        }
      }
      .detail-meta {
        margin-bottom: 16px;
        font-size: 14px;
        color: #1a1918cc;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .submitted-by {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .submitter-photo {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }
      .detail-info-grid {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 14px;
      }
      .detail-actions {
        display: flex;
        gap: 12px;
        margin-top: 16px;
      }
      .step-error {
        margin-top: 12px;
        color: #b42318;
      }
      .no-photos {
        font-size: 13px;
        color: #1a1918cc;
      }
      .detail-description {
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .comments-section {
        margin-top: 20px;
        h4 {
          margin-bottom: 12px;
        }
      }
      .comment {
        padding: 12px;
        background: #f5f4f1;
        border-radius: 10px;
        margin-bottom: 8px;
      }
      .comment-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        font-size: 12px;
        color: #1a1918cc;
      }
      .comment p {
        font-size: 14px;
      }
      .add-comment {
        display: flex;
        gap: 8px;
        margin-top: 12px;
        input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #e5e4e1;
          border-radius: 10px;
          font-size: 14px;
          &:focus {
            outline: none;
            border-color: #3d8a5a;
          }
        }
      }
      .empty-state {
        padding: 40px;
        text-align: center;
        color: #1a1918cc;
        grid-column: 1 / -1;
        .material-icons {
          font-size: 48px;
          margin-bottom: 8px;
        }
      }
      .loading {
        text-align: center;
        padding: 40px;
      }
      .spin {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
      }
      .modal-content {
        width: 100%;
        max-width: 500px;
        padding: 32px;
        h2 {
          margin-bottom: 20px;
          font-size: 20px;
        }
      }
      .form-group {
        margin-bottom: 16px;
        label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 500;
        }
        input,
        textarea,
        select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e5e4e1;
          border-radius: 8px;
          font-size: 14px;
          &:focus {
            outline: none;
            border-color: #3d8a5a;
          }
        }
        textarea {
          min-height: 100px;
          resize: vertical;
        }
      }
      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 20px;
      }
      .attachments {
        margin-bottom: 20px;
        h4 {
          margin-bottom: 8px;
        }
      }
      .attachment-grid {
        list-style: none;
        padding: 0;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        img {
          width: 160px;
          max-width: 100%;
          border-radius: 8px;
        }
      }
      .attachment-item {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
        background: #f5f4f1;
        border-radius: 8px;
        font-size: 13px;
      }
      /* Design-system tones; each request status has its own (New warning,
         Received gray, Started info, Completed success). */
      .badge-success {
        background: #d7ecde;
        color: #245737;
      }
      .badge-warning {
        background: #fef3c7;
        color: #92400e;
      }
      .badge-info {
        background: #dbeafe;
        color: #1e40af;
      }
      .badge-gray {
        background: #e5e4e1;
        color: #1a1918;
      }
      .mobile-only {
        display: none;
      }
      @media (max-width: 768px) {
        .content-area {
          grid-template-columns: 1fr;
        }
        .mobile-only {
          display: block;
        }
      }
    `,
  ],
})
export class MaintenanceComponent implements OnInit {
  private maintenanceService = inject(MaintenanceService);
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);

  requests: any[] = [];
  filteredRequests: any[] = [];
  selectedRequest: any = null;
  comments: any[] = [];
  activeFilter = 'all';
  activeTab = 'details';
  loading = true;
  showCreateModal = false;
  advancing = false;
  stepFailed = false;
  readonly nextStep = nextMaintenanceStep;
  photoUrls: Record<string, string> = {};
  submitterPhotoUrl = '';

  createForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: [''],
    category: [''],
  });

  commentControl = this.fb.control('');

  ngOnInit(): void {
    this.loadRequests();
  }

  private loadRequests(): void {
    this.loading = true;
    this.maintenanceService.getMaintenanceRequests().subscribe({
      next: (data: any) => {
        this.requests = Array.isArray(data) ? data : data?.maintenanceRequests || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.maintenanceService.getCurrentUserMaintenanceRequests().subscribe({
          next: (data: any) => {
            this.requests = Array.isArray(data) ? data : data?.maintenanceRequests || [];
            this.applyFilter();
            this.loading = false;
          },
          error: () => {
            this.requests = [];
            this.filteredRequests = [];
            this.loading = false;
          },
        });
      },
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
        new: ['New', 'Created', 0],
        received: ['Received', 1],
        started: ['Started', 'InProgress', 2],
        done: ['Completed', 'Complete', 'Done', 3],
      };
      const statuses = map[this.activeFilter] || [];
      this.filteredRequests = this.requests.filter((r) => statuses.includes(r.status));
    }
  }

  advance(step: MaintenanceStep): void {
    const request = this.selectedRequest;
    if (!request?.maintenanceRequestId) return;
    const calls = {
      receive: (id: string) => this.maintenanceService.receiveMaintenanceRequest(id),
      start: (id: string) => this.maintenanceService.startMaintenanceRequest(id),
      complete: (id: string) => this.maintenanceService.completeMaintenanceRequest(id),
    };
    this.advancing = true;
    this.stepFailed = false;
    calls[step.action](request.maintenanceRequestId).subscribe({
      next: (data: any) => {
        const updated = data?.maintenanceRequest || data;
        request.status = updated?.status ?? request.status;
        this.applyFilter();
        this.advancing = false;
      },
      error: () => {
        this.stepFailed = true;
        this.advancing = false;
      },
    });
  }

  selectRequest(req: any): void {
    this.selectedRequest = req;
    this.activeTab = 'details';
    this.stepFailed = false;
    this.comments = [];
    this.submitterPhotoUrl = '';
    if (req.requestedByProfileId) {
      this.profileService.getAvatarUrl(req.requestedByProfileId).subscribe({
        next: (url) => {
          if (this.selectedRequest === req) this.submitterPhotoUrl = url;
        },
        error: () => {},
      });
    }
    for (const asset of req.digitalAssets ?? []) {
      if (asset.url && !this.photoUrls[asset.digitalAssetId]) {
        this.maintenanceService.getPhoto(asset.url).subscribe({
          next: (blob) => (this.photoUrls[asset.digitalAssetId] = URL.createObjectURL(blob)),
          error: () => {},
        });
      }
    }
    if (req.maintenanceRequestId) {
      this.maintenanceService.getComments(req.maintenanceRequestId).subscribe({
        next: (data: any) => {
          this.comments = Array.isArray(data) ? data : data?.comments || [];
        },
        error: () => {},
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
      error: () => {},
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
      error: () => {},
    });
  }

  getStatusLabel(status: any): string {
    const numMap: Record<number, string> = {
      0: 'New',
      1: 'Received',
      2: 'Started',
      3: 'Completed',
    };
    if (typeof status === 'number') return numMap[status] || 'New';
    return status || 'New';
  }

  getStatusClass(status: any): string {
    const label = this.getStatusLabel(status).toLowerCase();
    switch (label) {
      case 'new':
      case 'created':
        return 'badge-warning';
      case 'received':
        return 'badge-gray';
      case 'started':
      case 'inprogress':
        return 'badge-info';
      case 'completed':
      case 'complete':
      case 'done':
        return 'badge-success';
      default:
        return 'badge-gray';
    }
  }
}
