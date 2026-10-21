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
import {
  AlertActionsComponent,
  AlertBodyComponent,
  AlertComponent,
  AlertTitleComponent,
  AvatarComponent,
  AvatarImageComponent,
  ButtonComponent,
  CardComponent,
  CardTitleComponent,
  DialogBodyComponent,
  DialogComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogIconComponent,
  DialogPanelComponent,
  DialogTitleComponent,
  EmptyStateActionsComponent,
  EmptyStateComponent,
  EmptyStateIconComponent,
  EmptyStateTextComponent,
  EmptyStateTitleComponent,
  FieldErrorComponent,
  FieldHelpComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  LoadingComponent,
  SpinnerComponent,
  TextFieldComponent,
} from 'components';
import { BoardService } from '../../core/services/board.service';
import type { Director } from '../../core/models/director';
import type { DirectorDraft } from '../../core/models/director-draft';
import type { DirectorFormErrors } from './director-form-errors';
import { directorFromDraft } from './director-from-draft';
import { initialsOf } from './initials-of';
import { moveDirector } from './move-director';
import { validateDirectorDraft } from './validate-director-draft';

type ListStatus = 'loading' | 'ready' | 'error';

const emptyDraft = (): DirectorDraft => ({ name: '', title: '', photoUrl: '' });

const SAVE_FAILED = "We couldn't save the board list. Try again.";

/**
 * The Board of Directors list the home page shows (L2-REQ-085), drawn in
 * docs/mocks/pages/admin-board/ with the editor and remove dialogs in
 * docs/mocks/dialogs/admin-director-editor/ and admin-director-remove/. Every
 * change saves the whole list straight away. Both dialogs are native <dialog>
 * elements: focus is trapped, Escape closes, and the page behind is inert.
 */
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    FormsModule,
    IconComponent,
    ButtonComponent,
    AvatarComponent,
    AvatarImageComponent,
    CardComponent,
    CardTitleComponent,
    EmptyStateActionsComponent,
    EmptyStateComponent,
    EmptyStateIconComponent,
    EmptyStateTextComponent,
    EmptyStateTitleComponent,
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
    TextFieldComponent,
    DialogBodyComponent,
    DialogComponent,
    DialogFooterComponent,
    DialogHeaderComponent,
    DialogIconComponent,
    DialogPanelComponent,
    DialogTitleComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  private readonly boardService = inject(BoardService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly editorDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'editorDialog',
    { read: ElementRef },
  );
  private readonly removeDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'removeDialog',
    { read: ElementRef },
  );

  readonly initialsOf = initialsOf;

  readonly directors = signal<Director[]>([]);
  readonly status = signal<ListStatus>('loading');
  readonly notice = signal('');
  readonly listError = signal('');
  readonly moving = signal(false);

  /** Position of the director being edited; null while adding. */
  readonly editingIndex = signal<number | null>(null);
  draft: DirectorDraft = emptyDraft();
  readonly errors = signal<DirectorFormErrors>({});
  readonly saving = signal(false);
  readonly saveFailed = signal(false);

  readonly removingIndex = signal<number | null>(null);
  readonly removeBusy = signal(false);
  readonly removeFailed = signal(false);

  private opener: HTMLElement | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.status.set('loading');
    this.boardService.getAll().subscribe({
      next: (directors) => {
        this.directors.set(directors);
        this.status.set('ready');
      },
      error: () => {
        this.directors.set([]);
        this.status.set('error');
      },
    });
  }

  removingName(): string {
    const index = this.removingIndex();
    return index === null ? '' : (this.directors()[index]?.name ?? '');
  }

  openEditor(index: number | null, event: Event): void {
    this.opener = event.currentTarget as HTMLElement;
    this.editingIndex.set(index);
    const director = index === null ? null : this.directors()[index];
    this.draft = director
      ? { name: director.name, title: director.title, photoUrl: director.photoUrl ?? '' }
      : emptyDraft();
    this.errors.set({});
    this.saveFailed.set(false);
    this.clearMessages();
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
    const errors = validateDirectorDraft(this.draft);
    this.errors.set(errors);
    if (errors.name || errors.title) return;

    const director = directorFromDraft(this.draft);
    const index = this.editingIndex();
    const directors =
      index === null
        ? [...this.directors(), director]
        : this.directors().map((existing, i) => (i === index ? director : existing));

    this.saving.set(true);
    this.saveFailed.set(false);
    this.boardService.save(directors).subscribe({
      next: (saved) => {
        this.directors.set(saved);
        this.closeEditor();
        this.notice.set(`“${director.name}” is now on the board list.`);
      },
      error: () => {
        this.saving.set(false);
        this.saveFailed.set(true);
      },
    });
  }

  move(index: number, offset: -1 | 1): void {
    const directors = moveDirector(this.directors(), index, offset);
    if (directors === this.directors()) return;
    const target = index + offset;
    const name = directors[target].name;

    this.clearMessages();
    this.moving.set(true);
    this.boardService.save(directors).subscribe({
      next: (saved) => {
        this.moving.set(false);
        this.directors.set(saved);
        this.notice.set(`“${name}” moved to position ${target + 1}.`);
        this.focusMoveButton(target, offset);
      },
      error: () => {
        this.moving.set(false);
        this.listError.set(SAVE_FAILED);
        this.load();
      },
    });
  }

  confirmRemove(index: number, event: Event): void {
    this.opener = event.currentTarget as HTMLElement;
    this.removingIndex.set(index);
    this.removeFailed.set(false);
    this.clearMessages();
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
    const index = this.removingIndex();
    if (index === null) return;
    const name = this.removingName();
    const directors = this.directors().filter((_, i) => i !== index);

    this.removeBusy.set(true);
    this.removeFailed.set(false);
    this.boardService.save(directors).subscribe({
      next: (saved) => {
        this.directors.set(saved);
        // The remove button left with the director; return focus to the screen's add action.
        this.opener = this.host.nativeElement.querySelector<HTMLElement>(
          '[data-testid="board-add-button"]',
        );
        this.closeRemove();
        this.notice.set(`“${name}” was removed from the board list.`);
      },
      error: () => {
        this.removeBusy.set(false);
        this.removeFailed.set(true);
      },
    });
  }

  private clearMessages(): void {
    this.notice.set('');
    this.listError.set('');
  }

  /** Keep focus on the moved director, on the same button while it is still enabled. */
  private focusMoveButton(index: number, offset: -1 | 1): void {
    afterNextRender(
      () => {
        const card = this.host.nativeElement.querySelectorAll<HTMLElement>(
          '[data-testid="director-card"]',
        )[index];
        const buttons = [
          card?.querySelector<HTMLButtonElement>(
            `[data-testid="director-move-${offset < 0 ? 'up' : 'down'}"]`,
          ),
          card?.querySelector<HTMLButtonElement>(
            `[data-testid="director-move-${offset < 0 ? 'down' : 'up'}"]`,
          ),
        ];
        buttons.find((button) => button && !button.disabled)?.focus();
      },
      { injector: this.injector },
    );
  }
}
