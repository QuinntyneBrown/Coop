import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  BadgeComponent,
  BadgeTone,
  ButtonComponent,
  CardComponent,
  CardTitleComponent,
  IconComponent,
  ListBodyComponent,
  ListComponent,
  ListItemComponent,
  ListMetaComponent,
  ListTitleComponent,
  MetricCardComponent,
  MetricCardIconComponent,
  StatComponent,
  StatLabelComponent,
  StatValueComponent,
} from 'components';
import { AuthService } from '../../core/services/auth.service';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MessagingService } from '../../core/services/messaging.service';
import { UserService } from '../../core/services/user.service';
import { ProfileService } from '../../core/services/profile.service';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    ButtonComponent,
    BadgeComponent,
    CardComponent,
    CardTitleComponent,
    ListBodyComponent,
    ListComponent,
    ListItemComponent,
    ListMetaComponent,
    ListTitleComponent,
    MetricCardComponent,
    MetricCardIconComponent,
    StatComponent,
    StatLabelComponent,
    StatValueComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private maintenanceService = inject(MaintenanceService);
  private messagingService = inject(MessagingService);
  private userService = inject(UserService);
  private profileService = inject(ProfileService);
  private documentService = inject(DocumentService);

  /** The office's counts and actions are left out for members (L2-REQ-104 AC5). */
  office = false;
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
    this.authService.office$.subscribe((office) => {
      this.office = office;
      if (office) this.loadMembersCount();
    });
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

  private loadMembersCount(): void {
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : data?.users || [];
        this.membersCount = list.length;
      },
      error: () => {
        this.membersCount = 0;
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

  getStatusTone(status: string): BadgeTone {
    switch ((status || '').toLowerCase()) {
      case 'new':
        return 'warning';
      case 'received':
        return 'neutral';
      case 'started':
        return 'info';
      case 'completed':
      case 'done':
        return 'success';
      default:
        return 'neutral';
    }
  }
}
