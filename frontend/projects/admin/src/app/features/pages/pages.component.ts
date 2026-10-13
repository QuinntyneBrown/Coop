import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageService } from '../../core/services/page.service';
import type { WebsitePage } from '../../core/models/website-page';
import type { WebsitePageDraft } from '../../core/models/website-page-draft';
import { BottomTabBarComponent } from '../../shared/components/bottom-tab-bar.component';
import type { PageFormErrors } from './page-form-errors';
import { validatePageDraft } from './validate-page-draft';

type ListStatus = 'loading' | 'ready' | 'error';

const emptyDraft = (): WebsitePageDraft => ({ title: '', heroImageUrl: '', body: '' });

/**
 * The website pages the office manages (L2-REQ-080), drawn in
 * docs/mocks/pages/admin-pages/ with the editor and remove dialogs in
 * docs/mocks/dialogs/admin-page-editor/ and admin-page-remove/. Both dialogs
 * are native <dialog> elements: focus is trapped, Escape closes, and the page
 * behind is inert while they are open.
 */
@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [FormsModule, BottomTabBarComponent],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesComponent implements OnInit {
  private readonly pageService = inject(PageService);
  private readonly editorDialog = viewChild<ElementRef<HTMLDialogElement>>('editorDialog');
  private readonly removeDialog = viewChild<ElementRef<HTMLDialogElement>>('removeDialog');

  readonly pages = signal<WebsitePage[]>([]);
  readonly status = signal<ListStatus>('loading');
  readonly notice = signal('');

  readonly editing = signal<WebsitePage | null>(null);
  draft: WebsitePageDraft = emptyDraft();
  readonly errors = signal<PageFormErrors>({});
  readonly saving = signal(false);
  readonly saveFailed = signal(false);

  readonly removing = signal<WebsitePage | null>(null);
  readonly removeBusy = signal(false);
  readonly removeFailed = signal(false);

  private opener: HTMLElement | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.status.set('loading');
    this.pageService.getAll().subscribe({
      next: (pages) => {
        this.pages.set(pages);
        this.status.set('ready');
      },
      error: () => {
        this.pages.set([]);
        this.status.set('error');
      },
    });
  }

  openEditor(page: WebsitePage | null, event: Event): void {
    this.opener = event.currentTarget as HTMLElement;
    this.editing.set(page);
    this.draft = page
      ? { title: page.title, heroImageUrl: page.heroImageUrl ?? '', body: page.body }
      : emptyDraft();
    this.errors.set({});
    this.saveFailed.set(false);
    this.notice.set('');
    this.editorDialog()?.nativeElement.showModal();
  }

  closeEditor(): void {
    this.editorDialog()?.nativeElement.close();
  }

  /** The native close event: Escape, Cancel or a finished save. */
  onEditorClosed(): void {
    this.saving.set(false);
    this.opener?.focus();
  }

  save(event: Event): void {
    event.preventDefault();
    const editing = this.editing();
    const errors = validatePageDraft(this.draft, this.pages(), editing?.pageId ?? null);
    this.errors.set(errors);
    if (errors.title || errors.body) return;

    this.saving.set(true);
    this.saveFailed.set(false);
    const request = editing
      ? this.pageService.update(editing.pageId, this.draft)
      : this.pageService.create(this.draft);
    request.subscribe({
      next: (page) => {
        this.closeEditor();
        this.notice.set(`“${page.title}” is now on the website.`);
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.saveFailed.set(true);
      },
    });
  }

  confirmRemove(page: WebsitePage, event: Event): void {
    this.opener = event.currentTarget as HTMLElement;
    this.removing.set(page);
    this.removeFailed.set(false);
    this.notice.set('');
    this.removeDialog()?.nativeElement.showModal();
  }

  closeRemove(): void {
    this.removeDialog()?.nativeElement.close();
  }

  onRemoveClosed(): void {
    this.removeBusy.set(false);
    this.opener?.focus();
  }

  remove(): void {
    const page = this.removing();
    if (!page) return;
    this.removeBusy.set(true);
    this.removeFailed.set(false);
    this.pageService.remove(page.pageId).subscribe({
      next: () => {
        this.closeRemove();
        this.notice.set(`“${page.title}” was removed from the website.`);
        this.load();
      },
      error: () => {
        this.removeBusy.set(false);
        this.removeFailed.set(true);
      },
    });
  }
}
