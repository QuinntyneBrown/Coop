import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  CardComponent,
  DescriptionListComponent,
  DialogBodyComponent,
  DialogComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogIconComponent,
  DialogPanelComponent,
  DialogTitleComponent,
  EmptyStateComponent,
  EmptyStateIconComponent,
  EmptyStateTitleComponent,
  FieldHelpComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  PictureListComponent,
  PictureListGridComponent,
  PictureListItemComponent,
  PictureListNoteComponent,
  PictureListThumbComponent,
  ProgressComponent,
  SearchFieldComponent,
  TextFieldComponent,
} from 'components';
import { DigitalAssetService } from '../../../core/services/digital-asset.service';
import { formatFileSize } from './format-file-size';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ButtonComponent,
    CardComponent,
    DescriptionListComponent,
    EmptyStateComponent,
    EmptyStateIconComponent,
    EmptyStateTitleComponent,
    PictureListComponent,
    PictureListGridComponent,
    PictureListItemComponent,
    PictureListNoteComponent,
    PictureListThumbComponent,
    ProgressComponent,
    FieldHelpComponent,
    FieldLabelComponent,
    FormFieldComponent,
    SearchFieldComponent,
    TextFieldComponent,
    DialogBodyComponent,
    DialogComponent,
    DialogFooterComponent,
    DialogHeaderComponent,
    DialogIconComponent,
    DialogPanelComponent,
    DialogTitleComponent,
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AssetsComponent implements OnInit, AfterViewChecked {
  private assetService = inject(DigitalAssetService);
  readonly formatFileSize = formatFileSize;
  assets: any[] = [];
  filteredAssets: any[] = [];
  selectedAsset: any = null;
  showUploadDialog = false;
  showDeleteAssetDialog = false;
  uploadProgressValue = -1;
  selectedFile: File | null = null;

  private readonly uploadDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'uploadDialog',
    { read: ElementRef },
  );
  private readonly detailDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'detailDialog',
    { read: ElementRef },
  );
  private readonly deleteDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'deleteDialog',
    { read: ElementRef },
  );

  // The flags above decide which dialog is open; the native dialogs follow them.
  // Closing runs first so the delete confirmation can replace the detail dialog.
  ngAfterViewChecked(): void {
    const dialogs: [HTMLDialogElement | undefined, boolean][] = [
      [this.uploadDialog()?.nativeElement, this.showUploadDialog],
      [this.detailDialog()?.nativeElement, !!this.selectedAsset && !this.showDeleteAssetDialog],
      [this.deleteDialog()?.nativeElement, this.showDeleteAssetDialog],
    ];
    for (const [dialog, open] of dialogs) {
      if (dialog?.open && !open) dialog.close();
    }
    for (const [dialog, open] of dialogs) {
      if (dialog && !dialog.open && open) dialog.showModal();
    }
  }

  ngOnInit(): void {
    this.loadAssets();
  }

  private loadAssets(): void {
    this.assetService.getDigitalAssets().subscribe({
      next: (data: any) => {
        this.assets = Array.isArray(data) ? data : data?.digitalAssets || [];
        this.filteredAssets = [...this.assets];
      },
      error: () => {},
    });
  }

  onSearchAssets(event: any): void {
    const query = (event.target.value || '').toLowerCase();
    if (!query) {
      this.filteredAssets = [...this.assets];
      return;
    }
    this.filteredAssets = this.assets.filter((a) => (a.name || '').toLowerCase().includes(query));
  }

  openUploadDialog(): void {
    this.showUploadDialog = true;
    this.uploadProgressValue = -1;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  confirmUpload(): void {
    if (!this.selectedFile) return;
    this.uploadProgressValue = 0;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.assetService.upload(formData).subscribe({
      next: () => {
        this.showUploadDialog = false;
        this.loadAssets();
      },
      error: () => {
        this.showUploadDialog = false;
      },
    });
  }

  openAssetDetail(asset: any): void {
    this.selectedAsset = asset;
  }

  openDeleteAssetDialog(): void {
    this.showDeleteAssetDialog = true;
  }

  confirmDeleteAsset(): void {
    if (this.selectedAsset) {
      this.assetService.deleteDigitalAsset(this.selectedAsset.digitalAssetId).subscribe({
        next: () => {
          this.showDeleteAssetDialog = false;
          this.selectedAsset = null;
          this.loadAssets();
        },
        error: () => {
          this.showDeleteAssetDialog = false;
        },
      });
    }
  }
}
