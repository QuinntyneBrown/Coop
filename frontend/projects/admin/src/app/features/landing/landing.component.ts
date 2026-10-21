import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';

import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AvatarComponent,
  ButtonComponent,
  CardComponent,
  ListBodyComponent,
  ListComponent,
  ListItemComponent,
  ListMetaComponent,
  ListTitleComponent,
  LogoMarkComponent,
  NavLinkComponent,
  SkipLinkComponent,
  TopBarBrandComponent,
  TopBarComponent,
  TopBarSpacerComponent,
} from 'components';
import { JsonContentService } from '../../core/services/json-content.service';
import { DocumentService } from '../../core/services/document.service';
import { BoardService } from '../../core/services/board.service';
import type { Director } from '../../core/models/director';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ButtonComponent,
    AvatarComponent,
    CardComponent,
    ListBodyComponent,
    ListComponent,
    ListItemComponent,
    ListMetaComponent,
    ListTitleComponent,
    LogoMarkComponent,
    NavLinkComponent,
    SkipLinkComponent,
    TopBarBrandComponent,
    TopBarComponent,
    TopBarSpacerComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
          this.heroTitle = content.heroTitle || content.title || 'Welcome to OWN Housing Co-op';
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

  noticeDate(notice: any): string {
    return notice.publishedOn || notice.date || notice.createdOn;
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
