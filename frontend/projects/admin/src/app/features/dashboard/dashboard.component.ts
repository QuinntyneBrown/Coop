import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MessagingService } from '../../core/services/messaging.service';
import { UserService } from '../../core/services/user.service';
import { ProfileService } from '../../core/services/profile.service';
import { DocumentService } from '../../core/services/document.service';
import { BottomTabBarComponent } from '../../shared/components/bottom-tab-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BottomTabBarComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard-content">
        <!-- Greeting -->
        <div class="greeting-section">
          <h1 data-testid="dashboard-greeting">Hello, {{ displayName }}</h1>
          <p data-testid="dashboard-subtitle">Here's your overview</p>
        </div>

        <!-- Metric Cards -->
        <div class="metric-cards" data-testid="dashboard-metric-cards">
          <div class="metric-card" data-testid="metric-open-requests">
            <div class="metric-card-inner">
              <div class="metric-icon requests"><span class="material-icons">build</span></div>
              <div class="metric-info">
                <span class="metric-count" data-testid="metric-value">{{ requestsCount }}</span>
                <span class="metric-label">Open Requests</span>
              </div>
            </div>
          </div>
          <div class="metric-card" data-testid="metric-unread-messages">
            <div class="metric-card-inner">
              <div class="metric-icon messages"><span class="material-icons">chat</span></div>
              <div class="metric-info">
                <span class="metric-count" data-testid="metric-value">{{ messagesCount }}</span>
                <span class="metric-label">Unread Messages</span>
              </div>
            </div>
          </div>
          <div class="metric-card" data-testid="metric-documents">
            <div class="metric-card-inner">
              <div class="metric-icon documents">
                <span class="material-icons">description</span>
              </div>
              <div class="metric-info">
                <span class="metric-count" data-testid="metric-value">{{ documentsCount }}</span>
                <span class="metric-label">Documents</span>
              </div>
            </div>
          </div>
          <div class="metric-card" data-testid="metric-active-members">
            <div class="metric-card-inner">
              <div class="metric-icon members"><span class="material-icons">people</span></div>
              <div class="metric-info">
                <span class="metric-count" data-testid="metric-value">{{ membersCount }}</span>
                <span class="metric-label">Active Members</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Maintenance Requests -->
        <div class="recent-requests card" data-testid="dashboard-recent-maintenance">
          <div class="card-header">
            <h3>Recent Maintenance Requests</h3>
            <a
              routerLink="/maintenance"
              class="view-all-link"
              data-testid="dashboard-view-all-requests"
              >View all</a
            >
          </div>
          <div class="request-list">
            @for (req of recentRequests; track req) {
              <div class="request-item" data-testid="dashboard-maintenance-item">
                <div class="request-info">
                  <span class="request-title">{{ req.title }}</span>
                  <span class="request-date" data-testid="dashboard-maintenance-date">{{
                    req.date || req.createdOn | date: 'mediumDate'
                  }}</span>
                </div>
                <span
                  class="badge"
                  [ngClass]="getStatusClass(req.status)"
                  data-testid="status-badge"
                  >{{ req.status || 'New' }}</span
                >
              </div>
            }
            @if (recentRequests.length === 0) {
              <div class="empty-state">No recent requests</div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions card" data-testid="dashboard-quick-actions">
          <div class="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div class="quick-actions-grid">
            <a
              routerLink="/maintenance"
              class="quick-action-btn"
              data-testid="quick-action-maintenance"
            >
              <span class="material-icons">build</span>
              <span>New Maintenance</span>
            </a>
            <a routerLink="/documents" class="quick-action-btn" data-testid="quick-action-document">
              <span class="material-icons">description</span>
              <span>Create Document</span>
            </a>
            <a routerLink="/messages" class="quick-action-btn" data-testid="quick-action-message">
              <span class="material-icons">chat</span>
              <span>New Message</span>
            </a>
            <a
              routerLink="/invitations"
              class="quick-action-btn"
              data-testid="quick-action-invitation"
            >
              <span class="material-icons">mail</span>
              <span>Send Invitation</span>
            </a>
          </div>
        </div>

        <!-- Recent Notices -->
        <div class="recent-notices card" data-testid="dashboard-recent-notices">
          <div class="card-header">
            <h3>Recent Notices</h3>
          </div>
          <div class="notices-list">
            @for (notice of recentNotices; track notice) {
              <div class="notice-item">
                <span class="notice-title">{{ notice.title }}</span>
                <span class="notice-date">{{
                  notice.publishedOn || notice.createdOn | date: 'mediumDate'
                }}</span>
              </div>
            }
            @if (recentNotices.length === 0) {
              <div class="empty-state">No recent notices</div>
            }
          </div>
        </div>
      </div>

      <app-bottom-tab-bar></app-bottom-tab-bar>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .dashboard {
        min-height: 100vh;
        background: #f5f4f1;
        padding-bottom: 72px;
      }
      .dashboard-content {
        padding: 24px 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      .greeting-section {
        margin-bottom: 24px;
        h1 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        p {
          color: #1a1918cc;
          font-size: 14px;
        }
      }
      .metric-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 24px;
      }
      .metric-card {
        background: #fff;
        border-radius: 14px;
        padding: 20px;
        border: 1px solid #e5e4e1;
        box-shadow: 0 2px 8px rgba(26, 25, 24, 0.03);
      }
      .metric-card-inner {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .metric-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.requests {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }
        &.messages {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }
        &.documents {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }
        &.members {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }
        .material-icons {
          font-size: 22px;
        }
      }
      .metric-info {
        display: flex;
        flex-direction: column;
      }
      .metric-count {
        font-size: 24px;
        font-weight: 700;
      }
      .metric-label {
        font-size: 14px;
        color: #1a1918cc;
      }
      .card {
        background: #fff;
        border-radius: 14px;
        border: 1px solid #e5e4e1;
        box-shadow: 0 2px 8px rgba(26, 25, 24, 0.03);
        margin-bottom: 24px;
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e5e4e1;
        h3 {
          font-size: 16px;
          font-weight: 600;
        }
      }
      .view-all-link {
        font-size: 14px;
        color: #3d8a5a;
        text-decoration: none;
      }
      .request-list {
        padding: 8px 0;
      }
      .request-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        &:not(:last-child) {
          border-bottom: 1px solid #f5f4f1;
        }
      }
      .request-info {
        display: flex;
        flex-direction: column;
      }
      .request-title {
        font-size: 14px;
        font-weight: 500;
      }
      .request-date {
        font-size: 14px;
        color: #1a1918cc;
      }
      .empty-state {
        padding: 24px;
        text-align: center;
        color: #1a1918cc;
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
      .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        padding: 16px 20px;
      }
      .quick-action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px;
        border-radius: 10px;
        background: #f5f4f1;
        text-decoration: none;
        color: #1a1918;
        font-size: 14px;
        text-align: center;
        transition: background 0.2s;
        &:hover {
          background: #e5e4e1;
        }
        .material-icons {
          font-size: 24px;
          color: #3d8a5a;
        }
      }
      .notices-list {
        padding: 8px 0;
      }
      .notice-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 20px;
        &:not(:last-child) {
          border-bottom: 1px solid #f5f4f1;
        }
      }
      .notice-title {
        font-size: 14px;
        font-weight: 500;
      }
      .notice-date {
        font-size: 14px;
        color: #1a1918cc;
      }
      @media (max-width: 768px) {
        .metric-cards {
          grid-template-columns: 1fr;
        }
        .quick-actions-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private maintenanceService = inject(MaintenanceService);
  private messagingService = inject(MessagingService);
  private userService = inject(UserService);
  private profileService = inject(ProfileService);
  private documentService = inject(DocumentService);

  displayName = '';
  requestsCount = 0;
  messagesCount = 0;
  documentsCount = 0;
  membersCount = 0;
  recentRequests: any[] = [];
  recentNotices: any[] = [];

  ngOnInit(): void {
    this.displayName = this.authService.currentUser?.username || 'User';
    this.loadProfileName();
    this.loadMetrics();
    this.loadRecentRequests();
    this.loadRecentNotices();
  }

  private loadProfileName(): void {
    this.profileService.getProfilesByCurrentUser().subscribe({
      next: (profiles: any) => {
        const list = Array.isArray(profiles) ? profiles : profiles?.profiles || [];
        if (list.length > 0) {
          const p = list[0];
          this.displayName = p.firstName || p.firstname || this.displayName;
        }
      },
      error: () => {},
    });
  }

  private loadMetrics(): void {
    this.maintenanceService.getMaintenanceRequests().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : data?.maintenanceRequests || [];
        this.requestsCount =
          list.filter((r: any) => r.status !== 'Completed' && r.status !== 'Done').length ||
          list.length;
      },
      error: () => {
        this.requestsCount = 0;
      },
    });

    this.messagingService.getUnreadCount().subscribe({
      next: (data: any) => {
        this.messagesCount = data?.count ?? data ?? 0;
      },
      error: () => {
        this.messagesCount = 0;
      },
    });

    this.userService.getUsers().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : data?.users || [];
        this.membersCount = list.length;
      },
      error: () => {
        this.membersCount = 0;
      },
    });

    this.documentService.getDocuments().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : data?.documents || [];
        this.documentsCount = list.length;
      },
      error: () => {
        this.documentsCount = 0;
      },
    });
  }

  private loadRecentRequests(): void {
    this.maintenanceService.getMaintenanceRequests().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : data?.maintenanceRequests || [];
        this.recentRequests = list.slice(0, 5);
      },
      error: () => {
        this.recentRequests = [];
      },
    });
  }

  private loadRecentNotices(): void {
    this.documentService.getDocuments().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : data?.documents || [];
        this.recentNotices = list
          .filter((d: any) => (d.documentType || d.type || '').toLowerCase().includes('notice'))
          .slice(0, 5);
      },
      error: () => {
        this.recentNotices = [];
      },
    });
  }

  getStatusClass(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'new':
        return 'badge-warning';
      case 'received':
        return 'badge-gray';
      case 'started':
        return 'badge-info';
      case 'completed':
      case 'done':
        return 'badge-success';
      default:
        return 'badge-gray';
    }
  }
}
