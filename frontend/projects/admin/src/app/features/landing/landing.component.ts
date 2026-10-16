import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';
import { JsonContentService } from '../../core/services/json-content.service';
import { DocumentService } from '../../core/services/document.service';
import { BoardService } from '../../core/services/board.service';
import type { Director } from '../../core/models/director';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="landing-page">
      <!-- Navbar -->
      <nav class="navbar" data-testid="landing-navbar">
        <div class="navbar-brand">
          <span class="material-icons">apartment</span>
          <span class="brand-text">Coop</span>
        </div>
        <div class="navbar-actions">
          <a routerLink="/login" class="nav-link" data-testid="landing-login-link">Sign In</a>
          <a routerLink="/register" class="btn btn-primary" data-testid="landing-register-link"
            >Register</a
          >
        </div>
      </nav>

      <!-- Hero -->
      <section class="hero" data-testid="landing-hero">
        <div class="hero-content">
          <h1 data-testid="landing-hero-title">{{ heroTitle || 'Welcome to Your Cooperative' }}</h1>
          <p data-testid="landing-hero-subtitle">
            {{
              heroSubtitle ||
                'Manage your community, maintenance requests, documents, and more - all in one place.'
            }}
          </p>
          <a routerLink="/register" class="btn btn-primary btn-lg" data-testid="landing-hero-cta"
            >Get Started</a
          >
        </div>
        <div class="hero-image">
          <span class="material-icons hero-icon">apartment</span>
        </div>
      </section>

      <!-- Board of Directors -->
      <section class="board-section" data-testid="landing-board-section">
        <h2 class="section-title">Board of Directors</h2>
        <div class="board-grid">
          @for (member of boardMembers; track member) {
            <div class="board-member-card" data-testid="landing-board-member">
              <div class="member-avatar">{{ getInitials(member.name) }}</div>
              <h3>{{ member.name }}</h3>
              <p>{{ member.title }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Public Notices -->
      <section class="notices-section" data-testid="landing-notices-section">
        <h2 class="section-title">Announcements</h2>
        <div class="notices-grid">
          @for (notice of notices; track notice) {
            <div class="notice-card card" data-testid="landing-notice-card">
              <h3>{{ notice.title }}</h3>
              <p>{{ notice.body || notice.description }}</p>
              <span class="notice-date">{{ notice.publishedOn || notice.date }}</span>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .landing-page {
        min-height: 100vh;
        background: #f5f4f1;
      }
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 40px;
        background: #fff;
        border-bottom: 1px solid #e5e4e1;
      }
      .navbar-brand {
        display: flex;
        align-items: center;
        gap: 8px;
        .material-icons {
          color: #3d8a5a;
          font-size: 28px;
        }
        .brand-text {
          font-size: 20px;
          font-weight: 700;
          color: #1a1918;
        }
      }
      .navbar-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .nav-link {
        color: #1a1918;
        font-weight: 500;
        text-decoration: none;
      }
      .hero {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 80px 40px;
        max-width: 1200px;
        margin: 0 auto;
        gap: 40px;
      }
      .hero-content {
        flex: 1;
        h1 {
          font-size: 42px;
          font-weight: 700;
          color: #1a1918;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        p {
          font-size: 18px;
          color: #1a1918cc;
          margin-bottom: 32px;
          line-height: 1.6;
        }
      }
      .hero-image {
        flex-shrink: 0;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3d8a5a, #4ca76d);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .hero-icon {
        font-size: 120px;
        color: rgba(255, 255, 255, 0.9);
      }
      .btn-lg {
        padding: 14px 32px;
        font-size: 16px;
      }
      .section-title {
        font-size: 28px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 32px;
        color: #1a1918;
      }
      .board-section,
      .notices-section {
        padding: 60px 40px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .board-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 24px;
      }
      .board-member-card {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        border: 1px solid #e5e4e1;
        box-shadow: 0 2px 8px rgba(26, 25, 24, 0.03);
        h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        p {
          font-size: 14px;
          color: #1a1918cc;
        }
      }
      .member-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin: 0 auto 12px;
        background: #3d8a5a;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 600;
      }
      .notices-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
      }
      .notice-card {
        padding: 24px;
        h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        p {
          font-size: 14px;
          color: #1a1918cc;
          margin-bottom: 12px;
          line-height: 1.5;
        }
      }
      .notice-date {
        font-size: 12px;
        color: #1a1918cc;
      }
      @media (max-width: 768px) {
        .hero {
          flex-direction: column;
          padding: 40px 20px;
          text-align: center;
        }
        .hero-image {
          width: 200px;
          height: 200px;
        }
        .hero-icon {
          font-size: 80px;
        }
        .hero-content h1 {
          font-size: 28px;
        }
        .board-section,
        .notices-section {
          padding: 40px 20px;
        }
      }
    `,
  ],
})
export class LandingComponent implements OnInit {
  private jsonContentService = inject(JsonContentService);
  private documentService = inject(DocumentService);
  private boardService = inject(BoardService);

  heroTitle = '';
  heroSubtitle = '';
  boardMembers: Director[] = [];
  notices: any[] = [];

  ngOnInit(): void {
    this.loadContent();
    this.loadBoard();
    this.loadNotices();
  }

  private loadContent(): void {
    this.jsonContentService.getByName('landing-page').subscribe({
      next: (data: any) => {
        if (data) {
          const content = data.json ? JSON.parse(data.json) : data;
          this.heroTitle = content.heroTitle || content.title || 'Welcome to Your Cooperative';
          this.heroSubtitle = content.heroSubtitle || content.subtitle || '';
        }
      },
      error: () => undefined,
    });
  }

  /** The same Board of Directors list the admin Board screen edits (L2-REQ-085). */
  private loadBoard(): void {
    this.boardService.getAll().subscribe({
      next: (directors) => {
        this.boardMembers = directors;
      },
      error: () => {
        this.boardMembers = [];
      },
    });
  }

  private loadNotices(): void {
    this.documentService.getPublishedDocuments().subscribe({
      next: (data: any) => {
        const docs = Array.isArray(data) ? data : data?.documents || [];
        this.notices = docs
          .filter((d: any) => d.documentType === 'Notice' || d.type === 'Notice')
          .slice(0, 6);
        if (this.notices.length === 0) {
          this.notices = docs.slice(0, 6);
        }
      },
      error: () => {
        this.notices = [];
      },
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
