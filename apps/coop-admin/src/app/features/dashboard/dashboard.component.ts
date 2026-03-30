import { Component, OnInit, inject } from '@angular/core';
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
      <!-- Top Bar -->
      <div class="top-bar" data-testid="dashboard-top-bar">
        <div class="top-bar-left">
          <span class="material-icons logo-icon" data-testid="dashboard-logo">apartment</span>
          <h1 class="logo-text" data-testid="dashboard-page-title">Dashboard</h1>
        </div>
        <div class="top-bar-right">
          <div class="search-bar" data-testid="dashboard-search">
            <span class="material-icons">search</span>
            <input type="text" placeholder="Search..." />
          </div>
          <button class="icon-btn" data-testid="dashboard-notification-bell">
            <span class="material-icons">notifications</span>
            <span *ngIf="unreadCount > 0" class="notification-badge" data-testid="dashboard-notification-badge">{{ unreadCount }}</span>
          </button>
          <button class="icon-btn hamburger" data-testid="dashboard-hamburger-menu">
            <span class="material-icons">menu</span>
          </button>
        </div>
      </div>

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
              <div class="metric-icon documents"><span class="material-icons">description</span></div>
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
            <a routerLink="/maintenance" class="view-all-link" data-testid="dashboard-view-all-requests">View all</a>
          </div>
          <div class="request-list">
            <div *ngFor="let req of recentRequests" class="request-item" data-testid="dashboard-maintenance-item">
              <div class="request-info">
                <span class="request-title">{{ req.title }}</span>
                <span class="request-date">{{ req.date || req.createdOn }}</span>
              </div>
              <span class="badge" [ngClass]="getStatusClass(req.status)" data-testid="status-badge">{{ req.status || 'New' }}</span>
            </div>
            <div *ngIf="recentRequests.length === 0" class="empty-state">No recent requests</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions card" data-testid="dashboard-quick-actions">
          <div class="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div class="quick-actions-grid">
            <a routerLink="/maintenance" class="quick-action-btn" data-testid="quick-action-maintenance">
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
            <a routerLink="/invitations" class="quick-action-btn" data-testid="quick-action-invitation">
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
            <div *ngFor="let notice of recentNotices" class="notice-item">
              <span class="notice-title">{{ notice.title }}</span>
              <span class="notice-date">{{ notice.publishedOn || notice.createdOn }}</span>
            </div>
            <div *ngIf="recentNotices.length === 0" class="empty-state">No recent notices</div>
          </div>
        </div>
      </div>

      <app-bottom-tab-bar></app-bottom-tab-bar>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: #F5F4F1; padding-bottom: 72px; }
    .top-bar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 20px; background: #fff; border-bottom: 1px solid #E5E4E1;
    }
    .top-bar-left { display: flex; align-items: center; gap: 8px; }
    .logo-icon { color: #3D8A5A; font-size: 28px; }
    .logo-text { font-size: 18px; font-weight: 700; }
    .top-bar-right { display: flex; align-items: center; gap: 8px; }
    .icon-btn {
      background: none; border: none; padding: 8px; border-radius: 10px; cursor: pointer;
      position: relative; color: #1A1918;
      &:hover { background: #F5F4F1; }
    }
    .notification-badge {
      position: absolute; top: 2px; right: 2px; background: #DC3545; color: #fff;
      font-size: 10px; width: 16px; height: 16px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .dashboard-content { padding: 24px 20px; max-width: 800px; margin: 0 auto; }
    .greeting-section {
      margin-bottom: 24px;
      h1 { font-size: 24px; font-weight: 600; margin-bottom: 4px; }
      p { color: #1A1918CC; font-size: 14px; }
    }
    .metric-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .metric-card {
      background: #fff; border-radius: 14px; padding: 20px;
      border: 1px solid #E5E4E1; box-shadow: 0 2px 8px rgba(26,25,24,0.03);
    }
    .metric-card-inner { display: flex; align-items: center; gap: 14px; }
    .metric-icon {
      width: 44px; height: 44px; border-radius: 12px; display: flex;
      align-items: center; justify-content: center;
      &.requests { background: rgba(245,158,11,0.1); color: #D97706; }
      &.messages { background: rgba(59,130,246,0.1); color: #3B82F6; }
      &.documents { background: rgba(139,92,246,0.1); color: #8B5CF6; }
      &.members { background: rgba(16,185,129,0.1); color: #059669; }
      .material-icons { font-size: 22px; }
    }
    .metric-info { display: flex; flex-direction: column; }
    .metric-count { font-size: 24px; font-weight: 700; }
    .metric-label { font-size: 12px; color: #1A1918CC; }
    .card { background: #fff; border-radius: 14px; border: 1px solid #E5E4E1; box-shadow: 0 2px 8px rgba(26,25,24,0.03); }
    .card-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 20px; border-bottom: 1px solid #E5E4E1;
      h3 { font-size: 16px; font-weight: 600; }
    }
    .view-all-link { font-size: 14px; color: #3D8A5A; text-decoration: none; }
    .request-list { padding: 8px 0; }
    .request-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 20px;
      &:not(:last-child) { border-bottom: 1px solid #F5F4F1; }
    }
    .request-info { display: flex; flex-direction: column; }
    .request-title { font-size: 14px; font-weight: 500; }
    .request-date { font-size: 12px; color: #1A1918CC; }
    .empty-state { padding: 24px; text-align: center; color: #1A1918CC; }
    .badge-success { background: rgba(16,185,129,0.1); color: #059669; }
    .badge-warning { background: rgba(245,158,11,0.1); color: #D97706; }
    .badge-info { background: rgba(59,130,246,0.1); color: #3B82F6; }
    .badge-gray { background: rgba(26,25,24,0.06); color: #1A1918CC; }
    .search-bar {
      display: flex; align-items: center; gap: 8px; padding: 8px 14px;
      background: #F5F4F1; border-radius: 10px; border: 1px solid #E5E4E1;
      input { border: none; background: transparent; outline: none; font-size: 14px; }
      .material-icons { font-size: 18px; color: #1A1918CC; }
    }
    .quick-actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 16px 20px; }
    .quick-action-btn {
      display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px;
      border-radius: 10px; background: #F5F4F1; text-decoration: none; color: #1A1918;
      font-size: 13px; text-align: center; transition: background 0.2s;
      &:hover { background: #E5E4E1; }
      .material-icons { font-size: 24px; color: #3D8A5A; }
    }
    .notices-list { padding: 8px 0; }
    .notice-item {
      display: flex; justify-content: space-between; padding: 12px 20px;
      &:not(:last-child) { border-bottom: 1px solid #F5F4F1; }
    }
    .notice-title { font-size: 14px; font-weight: 500; }
    .notice-date { font-size: 12px; color: #1A1918CC; }
    @media (max-width: 768px) {
      .metric-cards { grid-template-columns: 1fr; }
    }
  `]
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
  unreadCount = 0;
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
        const list = Array.isArray(profiles) ? profiles : (profiles?.profiles || []);
        if (list.length > 0) {
          const p = list[0];
          this.displayName = p.firstName || p.firstname || this.displayName;
        }
      },
      error: () => {}
    });
  }

  private loadMetrics(): void {
    this.maintenanceService.getMaintenanceRequests().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.maintenanceRequests || []);
        this.requestsCount = list.filter((r: any) => r.status !== 'Completed' && r.status !== 'Done').length || list.length;
      },
      error: () => { this.requestsCount = 0; }
    });

    this.messagingService.getUnreadCount().subscribe({
      next: (data: any) => {
        this.messagesCount = data?.count ?? data ?? 0;
        this.unreadCount = this.messagesCount;
      },
      error: () => { this.messagesCount = 0; }
    });

    this.userService.getUsers().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.users || []);
        this.membersCount = list.length;
      },
      error: () => { this.membersCount = 0; }
    });

    this.documentService.getDocuments().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.documents || []);
        this.documentsCount = list.length;
      },
      error: () => { this.documentsCount = 0; }
    });
  }

  private loadRecentRequests(): void {
    this.maintenanceService.getMaintenanceRequests().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.maintenanceRequests || []);
        this.recentRequests = list.slice(0, 5);
      },
      error: () => { this.recentRequests = []; }
    });
  }

  private loadRecentNotices(): void {
    this.documentService.getDocuments().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.documents || []);
        this.recentNotices = list
          .filter((d: any) => (d.documentType || d.type || '').toLowerCase().includes('notice'))
          .slice(0, 5);
      },
      error: () => { this.recentNotices = []; }
    });
  }

  getStatusClass(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'new': return 'badge-warning';
      case 'received': return 'badge-info';
      case 'started': return 'badge-info';
      case 'completed': case 'done': return 'badge-success';
      default: return 'badge-gray';
    }
  }
}
