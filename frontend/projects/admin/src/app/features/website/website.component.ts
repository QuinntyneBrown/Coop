import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnInit,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { IconComponent } from 'components';
import type { ContentRecord } from '../../core/models/content-record';
import type { SiteContent } from '../../core/models/site-content';
import { PUBLIC_SITE_URL } from '../../core/public-site-url';
import { SiteContentService } from '../../core/services/site-content.service';
import { fromDraft, toDraft } from './block-draft';
import type { ContentBlock } from './content-block';
import { blocksIn, itemLegend } from './content-blocks';
import type { ContentField } from './content-field';
import { readPath, writePath } from './content-path';
import { moveItem } from './move-item';
import type { PickedPhoto } from './photo-picker/picked-photo';
import { PhotoPickerComponent } from './photo-picker/photo-picker.component';
import { validateBlock } from './validate-block';

type LoadStatus = 'loading' | 'ready' | 'error';

/**
 * The public site content (L2-REQ-095, L2-REQ-096), drawn in
 * docs/mocks/pages/admin-website/ with the block editor in
 * docs/mocks/dialogs/admin-content-editor/ and the photo picker in
 * docs/mocks/dialogs/admin-photo-picker/. Each block opens one editor dialog,
 * drawn from the block's fields in content-blocks.ts; saving sends the whole
 * content with that block replaced. The dialogs are native <dialog> elements:
 * focus is trapped, Escape closes, and the page behind is inert.
 */
@Component({
  selector: 'app-website',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet, PhotoPickerComponent, IconComponent],
  templateUrl: './website.component.html',
  styleUrl: './website.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteComponent implements OnInit {
  private readonly siteContent = inject(SiteContentService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly editorDialog = viewChild<ElementRef<HTMLDialogElement>>('editorDialog');
  private readonly picker = viewChild(PhotoPickerComponent);

  readonly groups = [
    { id: 'every-page', name: 'On every page', blocks: blocksIn('every-page') },
    { id: 'home', name: 'Home page', blocks: blocksIn('home') },
  ];
  readonly itemLegend = itemLegend;

  readonly content = signal<SiteContent | null>(null);
  readonly status = signal<LoadStatus>('loading');
  readonly notice = signal('');

  readonly editing = signal<ContentBlock | null>(null);
  /** The block being edited; lists of lines are one text while editing. */
  readonly draft = signal<ContentRecord>({});
  readonly errors = signal<Record<string, string>>({});
  readonly saving = signal(false);
  readonly saveFailed = signal(false);

  private opener: HTMLElement | null = null;
  /** The photo the picker is choosing for: its object in the draft and its path. */
  private pickingFor: { target: ContentRecord; path: string } | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.status.set('loading');
    this.siteContent.get().subscribe({
      next: (content) => {
        this.content.set(content);
        this.status.set('ready');
      },
      error: () => this.status.set('error'),
    });
  }

  blockValue(block: ContentBlock): ContentRecord {
    const content = this.content();
    return content ? readPath(content, block.path) : {};
  }

  /** A photo address as the admin app can load it: public site paths come from the public site. */
  previewUrl(src: string | undefined): string {
    if (!src) return '';
    return src.startsWith('/') && !src.startsWith('//') ? `${PUBLIC_SITE_URL}${src}` : src;
  }

  fileName(src: string | undefined): string {
    return src ? (src.split('/').pop() ?? src) : '';
  }

  openEditor(block: ContentBlock, event: Event): void {
    this.opener = event.currentTarget as HTMLElement;
    this.editing.set(block);
    this.draft.set(toDraft(block.fields, this.blockValue(block)));
    this.errors.set({});
    this.saveFailed.set(false);
    this.notice.set('');
    // Show the dialog once it holds this block's fields, with focus on the first one.
    afterNextRender(
      () => {
        const dialog = this.editorDialog()?.nativeElement;
        dialog?.showModal();
        dialog?.querySelector<HTMLElement>('input, textarea, select')?.focus();
      },
      { injector: this.injector },
    );
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
    const block = this.editing();
    const content = this.content();
    if (!block || !content) return;

    const errors = validateBlock(block.fields, this.draft());
    this.errors.set(errors);
    if (Object.keys(errors).length > 0) return;

    const updated = writePath(content, block.path, fromDraft(block.fields, this.draft()));
    this.saving.set(true);
    this.saveFailed.set(false);
    this.siteContent.save(updated).subscribe({
      next: (saved) => {
        this.content.set(saved);
        this.closeEditor();
        this.notice.set('Your changes are now on the website.');
      },
      error: () => {
        this.saving.set(false);
        this.saveFailed.set(true);
      },
    });
  }

  /** Re-renders the editor after a change made outside a form control. */
  private touchDraft(): void {
    this.draft.update((draft) => ({ ...draft }));
  }

  addItem(target: ContentRecord, field: ContentField, path: string): void {
    const items: ContentRecord[] = target[field.key] ?? [];
    target[field.key] = [...items, toDraft(field.fields ?? [], field.newItem?.() ?? {})];
    this.touchDraft();
    this.focus(`[data-item="${path}.${items.length}"] :is(input, textarea, select, button)`);
  }

  moveItem(
    target: ContentRecord,
    field: ContentField,
    path: string,
    index: number,
    offset: -1 | 1,
  ) {
    target[field.key] = moveItem(target[field.key], index, offset);
    this.touchDraft();
    // Keep focus on the moved item: the same button while it is still enabled, else the other one.
    const moved = `${path}.${index + offset}`;
    const same = offset < 0 ? 'up' : 'down';
    const other = offset < 0 ? 'down' : 'up';
    this.focus(`[data-move="${moved}.${same}"]:not(:disabled)`, `[data-move="${moved}.${other}"]`);
  }

  removeItem(target: ContentRecord, field: ContentField, path: string, index: number): void {
    target[field.key] = (target[field.key] as ContentRecord[]).filter((_, i) => i !== index);
    this.touchDraft();
    this.focus(`[data-add="${path}"]`);
  }

  choosePhoto(target: ContentRecord, path: string): void {
    this.pickingFor = { target, path };
    this.picker()?.open(target['src'] ?? '');
  }

  onPhotoPicked(photo: PickedPhoto): void {
    if (!this.pickingFor) return;
    const { target, path } = this.pickingFor;
    if (photo.src !== target['src']) {
      // A new photo needs its own description.
      Object.assign(target, photo, { alt: '' });
    }
    this.touchDraft();
    this.focus(`#${this.fieldId(`${path}.alt`)}`);
  }

  /** Lines for the error summary, in field order. */
  errorList(): { id: string; message: string }[] {
    return Object.entries(this.errors()).map(([path, message]) => ({
      id: this.fieldId(path),
      message,
    }));
  }

  fieldId(path: string): string {
    return `content-${path.replace(/\./g, '-')}-field`;
  }

  /** Focuses the first element found, trying each selector in turn, once the view has updated. */
  private focus(...selectors: string[]): void {
    afterNextRender(
      () => {
        for (const selector of selectors) {
          const element = this.host.nativeElement.querySelector<HTMLElement>(selector);
          if (element) {
            element.focus();
            return;
          }
        }
      },
      { injector: this.injector },
    );
  }
}
