import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService, UserProfile } from '../../core/services/user.service';
import { MaintenanceService, MaintenanceRequest } from '../../core/services/maintenance.service';
import { MessagingService } from '../../core/services/messaging.service';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { catchError, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Greeting -->
    <div class="dashboard-content">
      <div class="greeting-section">
        <h1 data-testid="dashboard-greeting">Hello, {{ firstName }}</h1>
        <p data-testid="dashboard-subtitle">Here's your overview</p>
      </div>

      <!-- Metric Cards -->
      <div class="metric-grid">
        <div class="metric-card card" data-testid="dashboard-metric-card" data-testid2="dashboard-metric-requests">
          <div class="metric-card-inner" data-testid="dashboard-metric-requests">
            <div class="metric-icon requests">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">Requests</span>
              <span class="metric-count" data-testid="dashboard-metric-requests-count">{{ requestsCount }}</span>
            </div>
          </div>
        </div>

        <div class="metric-card card" data-testid="dashboard-metric-card">
          <div class="metric-card-inner" data-testid="dashboard-metric-messages">
            <div class="metric-icon messages">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">Messages</span>
              <span class="metric-count" data-testid="dashboard-metric-messages-count">{{ messagesCount }}</span>
            </div>
          </div>
        </div>

        <div class="metric-card card" data-testid="dashboard-metric-card">
          <div class="metric-card-inner" data-testid="dashboard-metric-members">
            <div class="metric-icon members">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">Members</span>
              <span class="metric-count" data-testid="dashboard-metric-members-count">{{ membersCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Requests -->
      <div class="recent-requests card" data-testid="dashboard-recent-requests">
        <div class="card-header">
          <h3>Recent Requests</h3>
          <a routerLink="/maintenance" class="view-all" data-testid="dashboard-view-all-requests">View all</a>
        </div>
        <div class="request-list" *ngIf="recentRequests.length > 0; else noRequests">
          <div
            class="request-item"
            *ngFor="let req of recentRequests"
            data-testid="dashboard-recent-request-item"
          >
            <span class="status-dot" [class]="getStatusClass(req.status)"></span>
            <div class="request-info">
              <span class="request-title">{{ req.title }}</span>
              <span class="request-status">{{ req.status }}</span>
            </div>
            <span class="request-date">{{ req.createdAt | date:'shortDate' }}</span>
          </div>
        </div>
        <ng-template #noRequests>
          <p class="empty-text">No recent requests</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content {
      padding: 24px 16px;
      max-width: 900px;
      margin: 0 auto;
    }

    .greeting-section {
      margin-bottom: 24px;
      h1 { font-size: 24px; font-weight: 600; }
      p { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }
    }

    .metric-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }

    .metric-card-inner {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.requests { background: #3D8A5A20; color: var(--primary); }
      &.messages { background: #3B82F620; color: var(--info); }
      &.members { background: #F59E0B20; color: var(--warning); }
    }

    .metric-info {
      display: flex;
      flex-direction: column;
    }

    .metric-label {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .metric-count {
      font-size: 24px;
      font-weight: 600;
    }

    .recent-requests {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 { font-size: 18px; font-weight: 600; }
        .view-all { font-size: 14px; color: var(--primary); font-weight: 500; }
      }
    }

    .request-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);

      &:last-child { border-bottom: none; }
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;

      &.new { background: var(--success); }
      &.started, &.in-progress { background: var(--warning); }
      &.done, &.completed { background: var(--success); }
      &.cancelled { background: var(--error); }
    }

    .request-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .request-title { font-size: 14px; font-weight: 500; }
      .request-status { font-size: 12px; color: var(--text-secondary); text-transform: capitalize; }
    }

    .request-date {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .empty-text {
      text-align: center;
      color: var(--text-secondary);
      padding: 16px 0;
      font-size: 14px;
    }

    @media (min-width: 640px) {
      .metric-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .dashboard-content { padding: 32px; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService);
  private maintenanceService = inject(MaintenanceService);
  private messagingService = inject(MessagingService);
  private authService = inject(AuthService);
  private api = inject(ApiService);

  firstName = '';
  requestsCount = '0';
  messagesCount = '0';
  membersCount = '0';
  recentRequests: MaintenanceRequest[] = [];

  ngOnInit() {
    // Load user profile
    this.userService.getProfile().pipe(
      catchError(() => of(null)),
    ).subscribe(profile => {
      if (profile) {
        this.firstName = profile.firstName || profile.username || this.authService.currentUser?.username || '';
      } else {
        this.firstName = this.authService.currentUser?.username || '';
      }
    });

    // Load maintenance requests
    this.maintenanceService.getMyRequests().pipe(
      catchError(() => of([])),
    ).subscribe(requests => {
      this.requestsCount = String(requests.length);
      this.recentRequests = requests.slice(0, 5);
    });

    // Load conversations count
    this.messagingService.getConversations().pipe(
      catchError(() => of([])),
    ).subscribe(conversations => {
      this.messagesCount = String(conversations.length);
    });

    // Load members count
    this.api.get<any>('user/members').pipe(
      catchError(() => this.api.get<any>('members').pipe(catchError(() => of([])))),
    ).subscribe(resp => {
      const members = Array.isArray(resp) ? resp : resp?.members ?? [];
      this.membersCount = String(members.length || '0');
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'new';
    const s = status.toLowerCase();
    if (s === 'new' || s === 'open') return 'new';
    if (s === 'started' || s === 'in-progress' || s === 'inprogress') return 'started';
    if (s === 'done' || s === 'completed' || s === 'closed') return 'done';
    if (s === 'cancelled') return 'cancelled';
    return 'new';
  }
}
