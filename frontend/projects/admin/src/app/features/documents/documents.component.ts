import {
  Component,
  ElementRef,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import {
  AlertBodyComponent,
  AlertComponent,
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  CardTitleComponent,
  CheckboxComponent,
  CheckboxTextComponent,
  DialogBodyComponent,
  DialogComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogIconComponent,
  DialogPanelComponent,
  DialogTitleComponent,
  EmptyStateComponent,
  EmptyStateIconComponent,
  EmptyStateTextComponent,
  FieldHelpComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  IconName,
  LoadingComponent,
  SearchFieldComponent,
  SelectComponent,
  SpinnerComponent,
  TabComponent,
  TabPanelComponent,
  TabsComponent,
  TextFieldComponent,
  TextareaComponent,
} from 'components';
import { AuthService } from '../../core/services/auth.service';
import { DocumentService } from '../../core/services/document.service';
import { noticeNotSentMessage, noticeSentMessage } from './notice-messages';
import { documentTypeLabel } from './document-type-label';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    IconComponent,
    ButtonComponent,
    AvatarComponent,
    BadgeComponent,
    CardComponent,
    CardTitleComponent,
    EmptyStateComponent,
    EmptyStateIconComponent,
    EmptyStateTextComponent,
    AlertBodyComponent,
    AlertComponent,
    LoadingComponent,
    SpinnerComponent,
    CheckboxComponent,
    CheckboxTextComponent,
    FieldHelpComponent,
    FieldLabelComponent,
    FormFieldComponent,
    SearchFieldComponent,
    SelectComponent,
    TextFieldComponent,
    TextareaComponent,
    TabComponent,
    TabPanelComponent,
    TabsComponent,
    DialogBodyComponent,
    DialogComponent,
    DialogFooterComponent,
    DialogHeaderComponent,
    DialogIconComponent,
    DialogPanelComponent,
    DialogTitleComponent,
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DocumentsComponent implements OnInit {
  private documentService = inject(DocumentService);
  private authService = inject(AuthService);

  /** Documents are read only for members (L2-REQ-104 AC6). */
  office = false;
  private readonly documentDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'documentDialog',
    { read: ElementRef },
  );
  private readonly deleteDocDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'deleteDocDialog',
    { read: ElementRef },
  );
  private readonly viewerDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'viewerDialog',
    { read: ElementRef },
  );

  readonly filterTabs = [
    { filter: 'all', label: 'All Documents' },
    { filter: 'notices', label: 'Notices' },
    { filter: 'bylaws', label: 'By-Laws' },
    { filter: 'reports', label: 'Reports' },
  ];

  documents: any[] = [];
  filteredDocuments: any[] = [];
  selectedDocument: any = null;
  activeFilter = 'all';
  readonly typeLabel = documentTypeLabel;
  loading = true;
  showDocumentDialog = false;
  showDeleteDocDialog = false;
  editingDocument: any = null;
  deletingDocument: any = null;
  dialogDoc: any = { title: '', type: 'Notice', content: '', status: 'Draft', send: false };
  saving = false;
  dialogError = '';
  statusMessage = '';
  /** The document this dialog already created, so Save after a failed send does not create another (ADR 0007). */
  private savedDocumentId: string | null = null;

  ngOnInit(): void {
    this.authService.office$.subscribe((office) => (this.office = office));
    this.loadDocuments();
  }

  private loadDocuments(): void {
    this.loading = true;
    this.documentService.getDocuments().subscribe({
      next: (data: any) => {
        this.documents = Array.isArray(data) ? data : data?.documents || [];
        // Sort newest first
        this.documents.sort((a: any, b: any) => {
          const dateA = new Date(a.createdOn || 0).getTime();
          const dateB = new Date(b.createdOn || 0).getTime();
          return dateB - dateA;
        });
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.documents = [];
        this.filteredDocuments = [];
        this.loading = false;
      },
    });
  }

  filterBy(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredDocuments = [...this.documents];
    } else {
      const typeMap: Record<string, string[]> = {
        notices: ['Notice'],
        bylaws: ['ByLaw', 'By-Law', 'Bylaw'],
        reports: ['Report'],
      };
      const types = typeMap[this.activeFilter] || [];
      this.filteredDocuments = this.documents.filter((d) =>
        types.some((t) => (d.documentType || d.type || '').toLowerCase() === t.toLowerCase()),
      );
    }
  }

  openDocument(doc: any): void {
    this.selectedDocument = doc;
    this.viewerDialog()?.nativeElement.showModal();
  }

  closeDocument(): void {
    this.selectedDocument = null;
    this.viewerDialog()?.nativeElement.close();
  }

  onSearchDocuments(event: any): void {
    const query = (event.target.value || '').toLowerCase();
    if (!query) {
      this.applyFilter();
      return;
    }
    this.filteredDocuments = this.documents.filter((d) =>
      (d.name || d.title || '').toLowerCase().includes(query),
    );
  }

  getStatusLabel(doc: any): string {
    if (doc.status) return doc.status;
    if (doc.published === true) return 'Published';
    return 'Draft';
  }

  openCreateDialog(): void {
    this.editingDocument = null;
    this.dialogDoc = { title: '', type: 'Notice', content: '', status: 'Draft', send: false };
    this.savedDocumentId = null;
    this.dialogError = '';
    this.statusMessage = '';
    this.showDocumentDialog = true;
    this.documentDialog()?.nativeElement.showModal();
  }

  closeDocumentDialog(): void {
    this.showDocumentDialog = false;
    this.documentDialog()?.nativeElement.close();
  }

  /** Escape does not close the dialog while a save is in flight, like Cancel and Close. */
  onDocumentDialogCancel(event: Event): void {
    if (this.saving) event.preventDefault();
  }

  saveDocument(): void {
    if (!this.dialogDoc.title || this.dialogDoc.title.trim() === '') {
      return;
    }
    const doc = this.dialogDoc;
    const publish = doc.status === 'Published';
    const send = doc.type === 'Notice' && publish && doc.send === true;
    let published = false;
    this.saving = true;
    this.dialogError = '';
    this.createOnce(doc)
      .pipe(
        switchMap((id) =>
          publish ? this.documentService.publishDocument(id).pipe(map(() => id)) : of(id),
        ),
        tap(() => (published = publish)),
        switchMap((id) =>
          send ? this.documentService.sendNotice(id).pipe(map(() => true)) : of(false),
        ),
      )
      .subscribe({
        next: (sent) => {
          this.saving = false;
          this.closeDocumentDialog();
          if (sent) this.statusMessage = noticeSentMessage(doc.title);
          this.loadDocuments();
        },
        error: () => {
          this.saving = false;
          if (send && published) {
            this.dialogError = noticeNotSentMessage(doc.title);
            return;
          }
          this.closeDocumentDialog();
          this.loadDocuments();
        },
      });
  }

  private createOnce(doc: any): Observable<string> {
    if (this.savedDocumentId) return of(this.savedDocumentId);
    const payload = { name: doc.title, body: doc.content };
    const created =
      doc.type === 'Notice'
        ? this.documentService.createNotice(payload).pipe(map((r: any) => r.notice.documentId))
        : this.documentService.createDocument(payload).pipe(map((r: any) => r.document.documentId));
    return created.pipe(tap((id: string) => (this.savedDocumentId = id)));
  }

  confirmDeleteDocument(doc: any, event: Event): void {
    event.stopPropagation();
    this.deletingDocument = doc;
    this.showDeleteDocDialog = true;
    this.deleteDocDialog()?.nativeElement.showModal();
  }

  closeDeleteDocDialog(): void {
    this.showDeleteDocDialog = false;
    this.deleteDocDialog()?.nativeElement.close();
  }

  deleteDocument(): void {
    if (this.deletingDocument?.documentId) {
      this.documentService.deleteDocument(this.deletingDocument.documentId).subscribe({
        next: () => {
          this.closeDeleteDocDialog();
          this.loadDocuments();
        },
        error: () => {
          this.closeDeleteDocDialog();
          this.loadDocuments();
        },
      });
    } else {
      this.closeDeleteDocDialog();
      this.loadDocuments();
    }
  }

  getDocIcon(doc: any): IconName {
    const type = (doc.documentType || doc.type || '').toLowerCase();
    if (type.includes('notice')) return 'megaphone';
    if (type.includes('law')) return 'scales';
    if (type.includes('report')) return 'chart';
    return 'documents';
  }
}
