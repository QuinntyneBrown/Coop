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
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AlertActionsComponent,
  AlertBodyComponent,
  AlertComponent,
  AlertTitleComponent,
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
import { PUBLIC_SITE_URL } from '../../../core/public-site-url';
import { BoardService } from '../../../core/services/board.service';
import { DocumentService } from '../../../core/services/document.service';
import { SiteContentService } from '../../../core/services/site-content.service';
import { fromDraft, toDraft } from '../fields/block-draft';
import type { ContentField } from '../fields/content-field';
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
 * /website/home and the menu and footer at /website/menu-and-footer. Every
 * save goes to the draft; the publish bar publishes or discards it
 * (L2-REQ-121).
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
  ],
  templateUrl: './page-editor.component.html',
  styleUrl: './page-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEditorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly siteContent = inject(SiteContentService);
  private readonly documents = inject(DocumentService);
  private readonly board = inject(BoardService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly picker = viewChild(PhotoPickerComponent);
  private readonly preview = viewChild(PreviewPaneComponent);

  readonly paths = APP_PATHS;
  readonly itemLegend = itemLegend;

  readonly mode: EditorMode = (this.route.snapshot.data['mode'] as EditorMode) ?? 'home';
  readonly title = this.mode === 'menu' ? APP_TITLES.websiteMenu : APP_TITLES.websiteHome;
  readonly subtitle =
    this.mode === 'menu'
      ? 'The menu at the top and the footer at the bottom of every page.'
      : 'The home page, section by section, in the order visitors see it.';
  private readonly definitions: SectionDefinition[] =
    this.mode === 'menu' ? MENU_SECTIONS : HOME_SECTIONS;

  readonly status = signal<LoadStatus>('loading');
  /** The content as last saved. */
  readonly content = signal<SiteContent | null>(null);
  /** The content with every section's unsaved edits, so switching sections loses nothing (L2-REQ-119 AC8). */
  private working: SiteContent | null = null;
  /** The sections in the order visitors see them, from the saved content (L2-REQ-120 AC1). */
  readonly sections = computed(() => orderedSections(this.content() ?? {}, this.definitions));
  readonly selected = signal<SectionDefinition>(this.definitions[0]);
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

  /** Shows a section's form; the current form's edits stay in the working copy. */
  select(section: SectionDefinition, fromList = true): void {
    if (!this.working) return;
    if (fromList) this.keepEdits();
    this.selected.set(section);
    this.draft.set(toDraft(section.fields, readSection(this.working, section)));
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

  /** Restores the selected section's saved values (L2-REQ-096 AC6). */
  undo(): void {
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
    return this.sections().indexOf(section) + 1;
  }

  canMove(offset: -1 | 1): boolean {
    const index = this.sections().indexOf(this.selected());
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
