import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JsonContentService } from '../../core/services/json-content.service';
import { ApiService } from '../../core/services/api.service';
import { catchError, of, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Navigation bar -->
    <nav class="landing-navbar" data-testid="landing-navbar">
      <div class="nav-inner">
        <div class="nav-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="var(--primary)"/>
            <text x="14" y="19" text-anchor="middle" fill="white" font-size="14" font-weight="600" font-family="Outfit">C</text>
          </svg>
          <span>Coop</span>
        </div>
        <div class="nav-links">
          <a routerLink="/login" data-testid="landing-login-link" class="nav-link">Sign In</a>
          <a routerLink="/register" data-testid="landing-register-link" class="nav-link nav-link-primary">Get Started</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero" data-testid="landing-hero">
      <div class="hero-inner">
        <h1 data-testid="landing-hero-title">{{ heroTitle }}</h1>
        <p class="hero-subtitle" data-testid="landing-hero-subtitle">{{ heroSubtitle }}</p>
        <a routerLink="/register" class="btn btn-primary btn-lg" data-testid="landing-hero-cta">Join Now</a>
      </div>
    </section>

    <!-- Board of Directors -->
    <section class="section board-section" data-testid="landing-board-section">
      <div class="section-inner">
        <h2 class="section-title">Board of Directors</h2>
        <div class="board-grid">
          <div
            class="board-member-card card"
            *ngFor="let member of boardMembers"
            data-testid="landing-board-member"
          >
            <div class="member-avatar">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>{{ member.name || member.Name }}</h3>
            <p class="member-role">{{ member.role || member.Role || member.title || member.Title || 'Board Member' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Public Notices -->
    <section class="section notices-section" data-testid="landing-notices-section">
      <div class="section-inner">
        <h2 class="section-title">Public Notices</h2>
        <div class="notices-grid" *ngIf="notices.length > 0; else noNotices">
          <div
            class="notice-card card"
            *ngFor="let notice of notices"
            data-testid="landing-notice-card"
          >
            <h3>{{ notice.title || notice.Title }}</h3>
            <p>{{ notice.content || notice.Content || notice.description || notice.Description | slice:0:150 }}...</p>
            <span class="notice-date">{{ notice.createdAt || notice.CreatedAt | date:'mediumDate' }}</span>
          </div>
        </div>
        <ng-template #noNotices>
          <p class="empty-text">No public notices at this time.</p>
        </ng-template>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <p>&copy; {{ currentYear }} Coop. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    :host { display: block; }

    .landing-navbar {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
    }

    .nav-links {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .nav-link {
      font-weight: 500;
      color: var(--text-primary);
      padding: 8px 16px;
      border-radius: var(--radius-md);
      text-decoration: none;

      &:hover { text-decoration: none; background: var(--primary-light); }

      &-primary {
        background: var(--primary);
        color: #fff !important;
        &:hover { background: var(--primary-dark); }
      }
    }

    .hero {
      background: linear-gradient(135deg, var(--primary) 0%, #2D6B44 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
    }

    .hero-inner {
      max-width: 700px;
      margin: 0 auto;

      h1 { font-size: 40px; font-weight: 700; margin-bottom: 16px; line-height: 1.2; }
    }

    .hero-subtitle {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 32px;
      line-height: 1.5;
    }

    .btn-lg { padding: 14px 32px; font-size: 18px; border-radius: var(--radius-md); background: white; color: var(--primary); font-weight: 600; text-decoration: none; display: inline-block; }
    .btn-lg:hover { background: #f0f0f0; text-decoration: none; }

    .section {
      padding: 60px 20px;
    }

    .section-inner {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 32px;
      text-align: center;
    }

    .board-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .board-member-card {
      text-align: center;
      padding: 24px;

      h3 { font-size: 16px; margin-top: 12px; }
      .member-role { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }
    }

    .member-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    .notices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .notice-card {
      h3 { font-size: 18px; margin-bottom: 8px; }
      p { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
      .notice-date { font-size: 12px; color: var(--text-secondary); margin-top: 12px; display: block; }
    }

    .empty-text {
      text-align: center;
      color: var(--text-secondary);
      font-size: 16px;
    }

    .landing-footer {
      background: var(--surface);
      border-top: 1px solid var(--border);
      padding: 24px 20px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 14px;
    }

    @media (max-width: 640px) {
      .hero-inner h1 { font-size: 28px; }
      .hero { padding: 48px 20px; }
      .section { padding: 40px 16px; }
      .board-grid { grid-template-columns: repeat(2, 1fr); }
      .notices-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class LandingComponent implements OnInit {
  private jsonContentService = inject(JsonContentService);
  private api = inject(ApiService);

  heroTitle = 'Welcome to Your Cooperative';
  heroSubtitle = 'Manage your community, submit requests, and stay connected with your neighbors.';
  boardMembers: any[] = [];
  notices: any[] = [];
  currentYear = new Date().getFullYear();

  ngOnInit() {
    // Load CMS content
    forkJoin([
      this.jsonContentService.getByName('Hero').pipe(catchError(() => of(null))),
      this.jsonContentService.getByName('BoardOfDirectors').pipe(catchError(() => of(null))),
      this.jsonContentService.getByName('Landing').pipe(catchError(() => of(null))),
    ]).subscribe(([hero, board, landing]) => {
      if (hero?.content) {
        const c = hero.content as any;
        if (c.title || c.Title) this.heroTitle = c.title || c.Title;
        if (c.subtitle || c.Subtitle) this.heroSubtitle = c.subtitle || c.Subtitle;
      }
      if (landing?.content) {
        const c = landing.content as any;
        if (c.title || c.Title) this.heroTitle = c.title || c.Title;
        if (c.subtitle || c.Subtitle) this.heroSubtitle = c.subtitle || c.Subtitle;
      }
      if (board?.content) {
        const c = board.content as any;
        const members = c.members || c.Members || c.boardMembers || c.BoardMembers;
        if (Array.isArray(members)) {
          this.boardMembers = members;
        }
      }
    });

    // Load public notices
    this.api.get<any>('notice/published').pipe(
      catchError(() => of({ notices: [] })),
    ).subscribe(resp => {
      const notices = Array.isArray(resp) ? resp : resp?.notices ?? [];
      this.notices = notices;
    });

    // If board is empty from CMS, try fetching from dedicated endpoint
    this.api.get<any>('board-members').pipe(
      catchError(() => this.api.get<any>('boardmembers').pipe(
        map((resp: any) => resp?.boardMembers ?? []),
        catchError(() => of([])),
      )),
    ).subscribe(members => {
      const m = Array.isArray(members) ? members : members?.boardMembers ?? [];
      if (this.boardMembers.length === 0 && m.length > 0) {
        this.boardMembers = m;
      }
    });
  }
}
