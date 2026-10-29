import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnInit,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AlertActionsComponent,
  AlertBodyComponent,
  AlertComponent,
  AlertTitleComponent,
  SectionListAddLabelComponent,
  SectionListAddComponent,
  DialogTitleComponent,
  DialogPanelComponent,
  DialogIconComponent,
  DialogHeaderComponent,
  DialogFooterComponent,
  DialogComponent,
  DialogBodyComponent,
  CheckboxTextComponent,
  CheckboxComponent,
  SectionListToolsComponent,
  InlineStatusComponent,
  BadgeComponent,
  BreadcrumbComponent,
  ButtonComponent,
  CardComponent,
  CardTitleComponent,
  FieldErrorComponent,
  FieldHelpComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  LinkedSummaryComponent,
  LinkedSummaryListComponent,
  LinkedSummaryTextComponent,
  LinkedSummaryTitleComponent,
  ListComponent,
  ListTitleComponent,
  LoadingComponent,
  PageEditorComponent as LibPageEditorComponent,
  PageEditorPaneComponent,
  PageEditorTabsComponent,
  PhotoPickerActionsComponent,
  PhotoPickerBodyComponent,
  PhotoPickerComponent as LibPhotoPickerComponent,
  PictureListThumbComponent,
  PlacementNoteComponent,
  SectionListButtonComponent,
  SectionListComponent,
  SectionListItemComponent,
  SelectComponent,
  SpinnerComponent,
  TabComponent,
  TabsComponent,
  TextFieldComponent,
  TextareaComponent,
} from 'components';
import { APP_PATHS } from '../../../core/app-paths';
import { APP_TITLES } from '../../../core/app-titles';
import type { ContentRecord } from '../../../core/models/content-record';
import type { SiteContent } from '../../../core/models/site-content';
import type { WebsitePage } from '../../../core/models/website-page';
import type { WebsitePageDraft } from '../../../core/models/website-page-draft';
import { PUBLIC_SITE_URL } from '../../../core/public-site-url';
import { BoardService } from '../../../core/services/board.service';
import { DocumentService } from '../../../core/services/document.service';
import { PageService } from '../../../core/services/page.service';
import { SiteContentService } from '../../../core/services/site-content.service';
import { fromDraft, toDraft } from '../fields/block-draft';
import type { ContentField } from '../fields/content-field';
import { frenchLabel, frenchOf, frenchPath } from '../fields/french-text';
import {
  isHomeSectionHidden,
  moveHomeSection,
  setHomeSectionHidden,
} from '../fields/home-section-tools';
import { HOME_SECTIONS } from '../fields/home-sections';
import { itemLegend } from '../fields/item-legend';
import { MENU_SECTIONS } from '../fields/menu-sections';
import { moveItem } from '../fields/move-item';
import { orderedSections } from '../fields/ordered-sections';
import {
  BLOCK_ICONS,
  BLOCK_KINDS,
  type BlockKind,
  PAGE_BANNER,
  blockDefinition,
  blockLabel,
  newBlock,
} from '../fields/page-blocks';
import type { SectionDefinition } from '../fields/section-definition';
import { readSection, writeSection } from '../fields/section-store';
import { validateBlock } from '../fields/validate-block';
import type { PickedPhoto } from '../photo-picker/picked-photo';
import { PhotoPickerComponent } from '../photo-picker/photo-picker.component';
import { PreviewPaneComponent } from '../preview-pane/preview-pane.component';
import { PublishBarComponent } from '../publish-bar/publish-bar.component';
import type { EditorMode } from './editor-mode';
import type { EditorTab } from './editor-tab';
import { type LinkedItem, linkedSummaryOf } from './linked-summary-of';
import { noticeItemsFrom } from './notice-items-from';

type LoadStatus = 'loading' | 'ready' | 'error';

/**
 * The page editor screen (L2-REQ-119, L2-REQ-124; ADR 0020), drawn in
 * docs/mocks/pages/admin-page-editor/: the sections in the order visitors see
 * them on the left, the selected section's form in the centre (drawn from the
 * section's fields, as the former block editor did) and the preview on the
 * right. Below 64rem the three panes are tabs. Edits the home page at
 * /website/home and the menu and footer at /website/menu-and-footer, where
 * every save goes to the draft and the publish bar publishes or discards it
 * (L2-REQ-121), and one website page at /website/pages/{id} or a new one at
 * /website/pages/new, where the Page banner is fixed first, body blocks are
 * added, moved and removed, and "Save page" changes the page at once
 * (L2-REQ-123). Below each text visitors read is an optional field for its
 * French (L2-REQ-130).
 */
@Component({
  selector: 'app-page-editor',
  standalone: true,
  imports: [
    FormsModule,
    NgTemplateOutlet,
    RouterLink,
    PhotoPickerComponent,
    PreviewPaneComponent,
    PublishBarComponent,
    IconComponent,
    ButtonComponent,
    BreadcrumbComponent,
    CardComponent,
    CardTitleComponent,
    ListComponent,
    ListTitleComponent,
    PhotoPickerActionsComponent,
    PhotoPickerBodyComponent,
    PictureListThumbComponent,
    LibPhotoPickerComponent,
    AlertActionsComponent,
    AlertBodyComponent,
    AlertComponent,
    AlertTitleComponent,
    LoadingComponent,
    SpinnerComponent,
    FieldErrorComponent,
    FieldHelpComponent,
    FieldLabelComponent,
    FormFieldComponent,
    SelectComponent,
    TextFieldComponent,
    TextareaComponent,
    LibPageEditorComponent,
    PageEditorPaneComponent,
    PageEditorTabsComponent,
    TabsComponent,
    TabComponent,
    SectionListComponent,
    SectionListItemComponent,
    SectionListButtonComponent,
    SectionListToolsComponent,
    InlineStatusComponent,
    BadgeComponent,
    PlacementNoteComponent,
    LinkedSummaryComponent,
    LinkedSummaryTextComponent,
    LinkedSummaryTitleComponent,
    LinkedSummaryListComponent,
    CheckboxComponent,
    CheckboxTextComponent,
    DialogBodyComponent,
    DialogComponent,
    DialogFooterComponent,
    DialogHeaderComponent,
    DialogIconComponent,
    DialogPanelComponent,
    DialogTitleComponent,
    SectionListAddComponent,
    SectionListAddLabelComponent,
  ],
  templateUrl: './page-editor.component.html',
  styleUrl: './page-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEditorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly documentTitle = inject(Title);
  private readonly siteContent = inject(SiteContentService);
  private readonly pageService = inject(PageService);
  private readonly documents = inject(DocumentService);
  private readonly board = inject(BoardService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly picker = viewChild(PhotoPickerComponent);
  private readonly preview = viewChild(PreviewPaneComponent);
  private readonly removeDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'removeDialog',
    { read: ElementRef },
  );

  readonly paths = APP_PATHS;
  readonly itemLegend = itemLegend;
  readonly frenchLabel = frenchLabel;
  readonly frenchPath = frenchPath;

  readonly mode: EditorMode = (this.route.snapshot.data['mode'] as EditorMode) ?? 'home';
  /** In `page` mode, the page being edited; null for a new page. */
  readonly pageId: string | null =
    this.mode === 'page' ? (this.route.snapshot.paramMap.get('pageId') ?? null) : null;
  readonly blockKinds = BLOCK_KINDS;
  readonly blockIcons = BLOCK_ICONS;
  readonly blockLabel = blockLabel;
  readonly publicSiteUrl = PUBLIC_SITE_URL;
  private readonly definitions: SectionDefinition[] =
    this.mode === 'menu' ? MENU_SECTIONS : HOME_SECTIONS;

  readonly status = signal<LoadStatus>('loading');
  /** The content as last saved. */
  readonly content = signal<SiteContent | null>(null);
  /** The content with every section's unsaved edits, so switching sections loses nothing (L2-REQ-119 AC8). */
  private working: SiteContent | null = null;
  /** In `page` mode: the page as last saved (null for a new page) and the page as the editor holds it. */
  readonly page = signal<WebsitePage | null>(null);
  readonly pageDraft = signal<ContentRecord>(emptyPage());
  /** The sections in the order visitors see them (L2-REQ-120 AC1): from the saved content, or the Page banner and the body blocks. */
  readonly sections = computed(() =>
    this.mode === 'page'
      ? [PAGE_BANNER, ...this.blocks().map(blockDefinition)]
      : orderedSections(this.content() ?? {}, this.definitions),
  );
  readonly selected = signal<SectionDefinition>(
    this.mode === 'page' ? PAGE_BANNER : this.definitions[0],
  );
  readonly title = computed(() => {
    if (this.mode === 'menu') return APP_TITLES.websiteMenu;
    if (this.mode === 'home') return APP_TITLES.websiteHome;
    return this.page()?.title ?? APP_TITLES.websitePageNew;
  });
  readonly subtitle =
    this.mode === 'menu'
      ? 'The menu at the top and the footer at the bottom of every page.'
      : this.mode === 'home'
        ? 'The home page, section by section, in the order visitors see it.'
        : 'The page banner, then the body block by block, in the order visitors see it.';
  /** The public address the preview shows: the home page, or the page's own address. */
  readonly previewPath = computed(() => {
    const slug = this.page()?.slug;
    return this.mode === 'page' && slug ? `/pages/${slug}` : '/';
  });
  readonly removeBusy = signal(false);
  readonly removeFailed = signal(false);
  /** Whether a section tool is saving, and what the last one did (L2-REQ-120 AC2, AC3, AC7). */
  readonly toolBusy = signal(false);
  readonly toolStatus = signal('');
  readonly toolFailed = signal(false);
  /** The selected section as the form binds it; lists of lines are one text while editing. */
  readonly draft = signal<ContentRecord>({});
  readonly errors = signal<Record<string, string>>({});
  readonly saving = signal(false);
  readonly saveFailed = signal(false);
  readonly notice = signal('');
  readonly tab = signal<EditorTab>('edit');

  /** The items of the selected linked section: null until they load or when they cannot. */
  readonly linkedItems = signal<LinkedItem[] | null>(null);
  readonly linkedSummary = computed(() => {
    const kind = this.selected().linked;
    return kind ? linkedSummaryOf(kind, this.linkedItems()) : null;
  });

  /** The photo the picker is choosing for: its object in the draft and its path. */
  private pickingFor: { target: ContentRecord; path: string } | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    if (this.mode === 'page') {
      this.loadPage();
      return;
    }
    this.status.set('loading');
    this.siteContent.getDraft().subscribe({
      next: (content) => {
        this.content.set(content);
        this.working = content;
        this.select(this.sections()[0], false);
        this.status.set('ready');
      },
      error: () => this.status.set('error'),
    });
  }

  private loadPage(): void {
    if (!this.pageId) {
      this.page.set(null);
      this.setPage(emptyPage());
      this.status.set('ready');
      return;
    }
    this.status.set('loading');
    this.pageService.getAll().subscribe({
      next: (pages) => {
        const page = pages.find((p) => p.pageId === this.pageId);
        if (!page) {
          this.status.set('error');
          return;
        }
        this.page.set(page);
        this.setPage(draftOf(page));
        this.documentTitle.setTitle(`${page.title} · ${APP_TITLES.suffix}`);
        this.status.set('ready');
      },
      error: () => this.status.set('error'),
    });
  }

  /** Starts editing a page from its saved values. */
  private setPage(draft: ContentRecord): void {
    this.pageDraft.set(draft);
    this.working = draft as unknown as SiteContent;
    this.select(this.sections()[0], false);
  }

  /** The body blocks the editor holds. */
  blocks(): ContentRecord[] {
    const blocks = this.pageDraft()['sections'];
    return Array.isArray(blocks) ? blocks : [];
  }

  /** The banner's values as the form binds them; the banner is the page itself. */
  banner(): ContentRecord {
    return this.pageDraft();
  }

  /** The page's public address, derived from the title as the API does (L2-REQ-123 AC8). */
  pageAddress(): string | null {
    const slug = this.page()?.slug;
    return slug ? `/pages/${slug}` : null;
  }

  isBanner(section: SectionDefinition): boolean {
    return section.kind === PAGE_BANNER.kind;
  }

  /** Adds a block of a kind at the end of the body and selects it (L2-REQ-123 AC1). */
  addBlock(kind: BlockKind): void {
    this.keepEdits();
    const blocks = [...this.blocks(), newBlock(kind)];
    this.pageDraft.update((page) => ({ ...page, sections: blocks }));
    this.working = this.pageDraft() as unknown as SiteContent;
    this.select(this.sections()[blocks.length], true);
  }

  /** Moves the selected block up or down in the page held by the editor (L2-REQ-123 AC2). */
  moveBlock(offset: -1 | 1): void {
    const index = this.indexOf(this.selected()) - 1;
    if (index < 0) return;
    this.keepEdits();
    const blocks = moveItem(this.blocks(), index, offset);
    this.pageDraft.update((page) => ({ ...page, sections: blocks }));
    this.working = this.pageDraft() as unknown as SiteContent;
    const direction = offset < 0 ? 'up' : 'down';
    const other = offset < 0 ? 'down' : 'up';
    this.select(this.sections()[index + offset + 1], false);
    this.toolStatus.set(
      `“${this.selected().name}” moved ${direction} to position ${index + offset + 1}.`,
    );
    this.focus(
      `[data-testid="section-move-${direction}"]:not(:disabled)`,
      `[data-testid="section-move-${other}"]`,
    );
  }

  /** Removes the selected block from the page held by the editor (L2-REQ-123 AC2). */
  removeBlock(): void {
    const index = this.indexOf(this.selected()) - 1;
    if (index < 0) return;
    const name = this.selected().name;
    const blocks = this.blocks().filter((_, i) => i !== index);
    this.pageDraft.update((page) => ({ ...page, sections: blocks }));
    this.working = this.pageDraft() as unknown as SiteContent;
    this.select(this.sections()[Math.min(index, blocks.length - 1) + 1] ?? PAGE_BANNER, false);
    this.toolStatus.set(`“${name}” was removed from the page. Save the page to keep the change.`);
    this.focus(
      '[data-testid="section-remove"]:not(:disabled)',
      '[data-testid="section-add-heading"]',
    );
  }

  /** The banner's photo through the picker; a new photo needs its own description. */
  chooseBannerPhoto(): void {
    this.pickingFor = { target: this.pageDraft(), path: 'banner' };
    this.picker()?.open(String(this.pageDraft()['heroImageUrl'] ?? ''));
  }

  removeBannerPhoto(): void {
    this.pageDraft.update((page) => ({
      ...page,
      heroImageUrl: '',
      heroImageAlt: '',
      fr: { ...page['fr'], heroImageAlt: '' },
    }));
    this.working = this.pageDraft() as unknown as SiteContent;
    this.focus('[data-testid="page-hero-choose"]');
  }

  /** Validates the banner and every block, then creates or updates the page (L2-REQ-123). */
  private savePage(): void {
    this.keepEdits();
    const page = this.pageDraft();
    const errors = validatePage(page, this.sections());
    this.errors.set(errors);
    if (Object.keys(errors).length > 0) {
      this.focus('[data-testid="section-form-errors"]');
      return;
    }
    const draft: WebsitePageDraft = {
      title: String(page['title'] ?? ''),
      heroImageUrl: String(page['heroImageUrl'] ?? ''),
      heroImageAlt: String(page['heroImageAlt'] ?? ''),
      fr: frenchOf({
        title: String(page['fr']?.['title'] ?? '').trim(),
        heroImageAlt: String(page['heroImageUrl'] ?? '').trim()
          ? String(page['fr']?.['heroImageAlt'] ?? '').trim()
          : '',
      }),
      published: page['published'] === true,
      // The blocks as the editor holds them: keepEdits already turned the forms' values into blocks.
      sections: this.blocks().map((block) => ({ ...block, kind: String(block['kind']) })),
    };
    this.saving.set(true);
    this.saveFailed.set(false);
    const existing = this.page();
    const request = existing
      ? this.pageService.update(existing.pageId, draft)
      : this.pageService.create(draft);
    request.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.page.set(saved);
        this.setPage(draftOf(saved));
        this.notice.set(
          saved.published
            ? `“${saved.title}” is saved. Visitors can open it from the menu.`
            : `“${saved.title}” is saved. It is not in the website menu yet.`,
        );
        this.documentTitle.setTitle(`${saved.title} · ${APP_TITLES.suffix}`);
        this.preview()?.reload();
        // A new page now has an address of its own; the screen stays, so the message is heard.
        if (!existing) this.location.replaceState(APP_PATHS.websitePage(saved.pageId));
      },
      error: (error: { status?: number; error?: { message?: string } }) => {
        this.saving.set(false);
        const message = error?.error?.message ?? '';
        if (error?.status === 400 && message.includes('A page with this title already exists.')) {
          this.errors.set({ title: 'A page with this title already exists.' });
          this.focus('[data-testid="section-form-errors"]');
          return;
        }
        this.saveFailed.set(true);
      },
    });
  }

  openRemove(): void {
    this.removeFailed.set(false);
    this.removeDialog()?.nativeElement.showModal();
  }

  closeRemove(): void {
    this.removeDialog()?.nativeElement.close();
  }

  /** Removes the page and returns to the Website area (L2-REQ-080). */
  removePage(): void {
    const page = this.page();
    if (!page) return;
    this.removeBusy.set(true);
    this.removeFailed.set(false);
    this.pageService.remove(page.pageId).subscribe({
      next: () => {
        this.removeBusy.set(false);
        this.closeRemove();
        void this.router.navigate([APP_PATHS.website]);
      },
      error: () => {
        this.removeBusy.set(false);
        this.removeFailed.set(true);
      },
    });
  }

  /** Shows a section's form; the current form's edits stay in the working copy. */
  select(section: SectionDefinition, fromList = true): void {
    if (!this.working) return;
    if (fromList) this.keepEdits();
    // The list may have been rebuilt by keepEdits; keep the entry of the same kind.
    section = this.sections().find((s) => s.kind === section.kind) ?? section;
    this.selected.set(section);
    const source = this.mode === 'page' ? this.pageDraft() : this.working;
    this.draft.set(toDraft(section.fields, readSection(source, section)));
    this.errors.set({});
    this.saveFailed.set(false);
    this.notice.set('');
    this.loadLinked(section);
    if (fromList) {
      this.tab.set('edit');
      this.focus('#section-title');
    }
  }

  /** Puts the current form's values back into the working copy. */
  private keepEdits(): void {
    if (!this.working) return;
    const section = this.selected();
    if (this.mode === 'page') {
      if (!this.isBanner(section)) {
        this.pageDraft.update((page) =>
          writeSection(page, section, fromDraft(section.fields, this.draft())),
        );
      }
      this.working = this.pageDraft() as unknown as SiteContent;
      return;
    }
    this.working = writeSection(this.working, section, fromDraft(section.fields, this.draft()));
  }

  private loadLinked(section: SectionDefinition): void {
    this.linkedItems.set(null);
    if (section.linked === 'notices') {
      this.documents.getDocuments().subscribe({
        next: (response) => this.linkedItems.set(noticeItemsFrom(response)),
        error: () => this.linkedItems.set(null),
      });
    } else if (section.linked === 'board') {
      this.board.getAll().subscribe({
        next: (directors) =>
          this.linkedItems.set(directors.map((d) => ({ name: d.name, detail: d.title }))),
        error: () => this.linkedItems.set(null),
      });
    }
  }

  /** Restores the selected section's saved values (L2-REQ-096 AC6); for a page, the whole page as last saved. */
  undo(): void {
    if (this.mode === 'page') {
      const page = this.page();
      this.setPage(page ? draftOf(page) : emptyPage());
      this.errors.set({});
      this.saveFailed.set(false);
      this.focus('input, textarea, select');
      return;
    }
    const saved = this.content();
    if (!saved || !this.working) return;
    const section = this.selected();
    this.working = writeSection(this.working, section, readSection(saved, section));
    this.draft.set(toDraft(section.fields, readSection(saved, section)));
    this.errors.set({});
    this.saveFailed.set(false);
    this.focus('input, textarea, select');
  }

  save(event: Event): void {
    event.preventDefault();
    if (this.mode === 'page') {
      this.savePage();
      return;
    }
    if (!this.working) return;
    const section = this.selected();

    const errors = validateBlock(section.fields, this.draft());
    this.errors.set(errors);
    if (Object.keys(errors).length > 0) {
      this.focus('[data-testid="section-form-errors"]');
      return;
    }

    this.keepEdits();
    const updated = this.working;
    this.saving.set(true);
    this.saveFailed.set(false);
    this.siteContent.save(updated).subscribe({
      next: (saved) => {
        this.content.set(saved);
        this.working = saved;
        this.saving.set(false);
        this.notice.set('Saved to your draft. Publish when you are ready for visitors to see it.');
        this.preview()?.reload();
      },
      error: () => {
        this.saving.set(false);
        this.saveFailed.set(true);
      },
    });
  }

  /** True for a home page section the office hid (L2-REQ-120 AC3). */
  isHidden(section: SectionDefinition): boolean {
    return !section.path && isHomeSectionHidden(this.content() ?? {}, section.kind);
  }

  /** The 1-based place of a section in the list. */
  position(section: SectionDefinition): number {
    return this.indexOf(section) + 1;
  }

  /** Where a section sits in the list, by its kind, since the list is rebuilt as the content changes. */
  private indexOf(section: SectionDefinition): number {
    return this.sections().findIndex((s) => s.kind === section.kind);
  }

  canMove(offset: -1 | 1): boolean {
    const index = this.indexOf(this.selected());
    return index + offset >= 0 && index + offset < this.sections().length;
  }

  /** Swaps the selected section with its neighbour and saves the order to the draft at once (L2-REQ-120 AC2). */
  move(offset: -1 | 1): void {
    const section = this.selected();
    const direction = offset < 0 ? 'up' : 'down';
    const other = offset < 0 ? 'down' : 'up';
    this.applyTool(
      (content) => moveHomeSection(content, section.kind, offset),
      () => `“${section.name}” moved ${direction} to position ${this.position(section)}.`,
      // Focus stays on the same button while it is enabled, else moves to the other one.
      [
        `[data-testid="section-move-${direction}"]:not(:disabled)`,
        `[data-testid="section-move-${other}"]`,
      ],
    );
  }

  /** Hides or shows the selected section and saves the draft at once (L2-REQ-120 AC3). */
  toggleHidden(): void {
    const section = this.selected();
    const hidden = !this.isHidden(section);
    this.applyTool(
      (content) => setHomeSectionHidden(content, section.kind, hidden),
      () =>
        hidden
          ? `“${section.name}” is hidden in your draft. Its photos and captions are kept.`
          : `“${section.name}” is shown again in your draft.`,
    );
  }

  /** Saves a change to the order or visibility; the list only changes once the draft is saved (L2-REQ-120 AC7). */
  private applyTool(
    change: (content: SiteContent) => SiteContent,
    message: () => string,
    focusAfter: string[] = [],
  ): void {
    const saved = this.content();
    if (!saved || !this.working) return;
    this.toolBusy.set(true);
    this.toolFailed.set(false);
    this.toolStatus.set('');
    const working = this.working;
    this.siteContent.save(change(saved)).subscribe({
      next: (content) => {
        this.content.set(content);
        this.working = change(working);
        this.toolBusy.set(false);
        this.toolStatus.set(message());
        this.preview()?.reload();
        if (focusAfter.length > 0) this.focus(...focusAfter);
      },
      error: () => {
        this.toolBusy.set(false);
        this.toolFailed.set(true);
      },
    });
  }

  /** A photo address as the admin app can load it: public site paths come from the public site. */
  previewUrl(src: string | undefined): string {
    if (!src) return '';
    return src.startsWith('/') && !src.startsWith('//') ? `${PUBLIC_SITE_URL}${src}` : src;
  }

  /** Names the banner's photo by its file name when the address has one (L2-REQ-123). */
  photoName(src: string | undefined): string {
    if (!src) return 'No photo chosen yet';
    const name = this.fileName(src);
    return name.includes('.') ? `Current photo: ${name}` : 'Current photo';
  }

  fileName(src: string | undefined): string {
    return src ? (src.split('/').pop() ?? src) : '';
  }

  /** Re-renders the form after a change made outside a form control. */
  private touchDraft(): void {
    this.draft.update((draft) => ({ ...draft }));
  }

  addItem(target: ContentRecord, field: ContentField, path: string): void {
    const items: ContentRecord[] = target[field.key] ?? [];
    target[field.key] = [...items, toDraft(field.fields ?? [], field.newItem?.() ?? {})];
    this.touchDraft();
    this.focus(`[data-item="${path}.${items.length}"] :is(input, textarea, select, button)`);
  }

  moveListItem(
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
    if (path === 'banner') {
      if (photo.src !== target['heroImageUrl']) {
        this.pageDraft.update((page) => ({
          ...page,
          heroImageUrl: photo.src,
          heroImageAlt: '',
          fr: { ...page['fr'], heroImageAlt: '' },
        }));
        this.working = this.pageDraft() as unknown as SiteContent;
      }
      this.focus('#page-hero-alt-field');
      return;
    }
    if (photo.src !== target['src']) {
      // A new photo needs its own description, in English and in French (L2-REQ-130 AC5).
      Object.assign(target, photo, { alt: '', fr: { ...target['fr'], alt: '' } });
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

/** A page the office has not saved yet: no title, no photo, not in the menu (L2-REQ-123 AC7). */
function emptyPage(): ContentRecord {
  return {
    title: '',
    heroImageUrl: '',
    heroImageAlt: '',
    fr: { title: '', heroImageAlt: '' },
    published: false,
    sections: [],
  };
}

/** The page as the editor holds it, from the page as saved. */
function draftOf(page: WebsitePage): ContentRecord {
  return {
    title: page.title,
    heroImageUrl: page.heroImageUrl ?? '',
    heroImageAlt: page.heroImageAlt ?? '',
    fr: { title: page.fr?.title ?? '', heroImageAlt: page.fr?.heroImageAlt ?? '' },
    published: page.published,
    sections: structuredClone(page.sections ?? []),
  };
}

/** The banner's rules and every block's rules, keyed by field path (L2-REQ-080 AC13, L2-REQ-097, L2-REQ-123 AC3). */
function validatePage(page: ContentRecord, sections: SectionDefinition[]): Record<string, string> {
  const errors: Record<string, string> = {};
  const title = String(page['title'] ?? '').trim();
  if (!title) errors['title'] = 'Give the page a title';
  else if (!/[\p{L}\p{N}]/u.test(title))
    errors['title'] = 'The title needs at least one letter or number.';
  else if (title.length > 120) errors['title'] = 'Keep the title under 120 characters';
  const alt = String(page['heroImageAlt'] ?? '').trim();
  if (String(page['heroImageUrl'] ?? '').trim() && !alt) {
    errors['heroImageAlt'] = 'Describe this photo for people who cannot see it';
  } else if (alt.length > 250) {
    errors['heroImageAlt'] = 'Keep the description under 250 characters';
  }
  if (String(page['fr']?.['title'] ?? '').trim().length > 120)
    errors['fr.title'] = 'Keep “Page title in French” under 120 characters';
  if (String(page['fr']?.['heroImageAlt'] ?? '').trim().length > 250)
    errors['fr.heroImageAlt'] = 'Keep the French description under 250 characters';
  for (const section of sections.slice(1)) {
    const block = toDraft(section.fields, readSection(page, section));
    for (const [path, message] of Object.entries(validateBlock(section.fields, block))) {
      errors[`${section.path}.${path}`] = `${section.name}: ${message}`;
    }
  }
  return errors;
}
