import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  AlertActionsComponent,
  AlertBodyComponent,
  AlertComponent,
  ButtonComponent,
  EmptyStateComponent,
  EmptyStateIconComponent,
  EmptyStateTextComponent,
  IconComponent,
  InlineStatusComponent,
  LoadingComponent,
  PictureListAddComponent,
  PictureListChoiceComponent,
  PictureListComponent,
  PictureListGridComponent,
  SpinnerComponent,
} from 'components';
import { ApiService } from '../../../core/services/api.service';
import { DigitalAssetService } from '../../../core/services/digital-asset.service';
import type { LibraryPhoto } from './library-photo';
import { measurePhoto } from './measure-photo';
import type { PickedPhoto } from './picked-photo';
import { photoFileError } from './photo-file-error';

type LibraryStatus = 'loading' | 'ready' | 'error';

/**
 * Chooses a photo from the Assets library or uploads a new one into it
 * (L2-REQ-097 AC1), drawn in docs/mocks/dialogs/admin-photo-picker/. A native
 * <dialog> stacked over the block editor: focus is trapped, Escape closes it
 * alone, and the editor behind is inert.
 */
@Component({
  selector: 'app-photo-picker',
  standalone: true,
  imports: [
    IconComponent,
    ButtonComponent,
    EmptyStateComponent,
    EmptyStateIconComponent,
    EmptyStateTextComponent,
    PictureListAddComponent,
    PictureListChoiceComponent,
    PictureListComponent,
    PictureListGridComponent,
    AlertActionsComponent,
    AlertBodyComponent,
    AlertComponent,
    InlineStatusComponent,
    LoadingComponent,
    SpinnerComponent,
  ],
  templateUrl: './photo-picker.component.html',
  styleUrl: './photo-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoPickerComponent {
  private readonly assets = inject(DigitalAssetService);
  private readonly api = inject(ApiService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly picked = output<PickedPhoto>();

  readonly status = signal<LibraryStatus>('loading');
  readonly photos = signal<LibraryPhoto[]>([]);
  readonly current = signal('');
  readonly uploading = signal(false);
  readonly uploadError = signal('');

  open(currentSrc: string): void {
    this.current.set(currentSrc);
    this.uploadError.set('');
    this.uploading.set(false);
    this.dialog().nativeElement.showModal();
    this.load();
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  load(): void {
    this.status.set('loading');
    this.assets.getDigitalAssets().subscribe({
      next: (response) => {
        const list = Array.isArray(response) ? response : (response?.digitalAssets ?? []);
        this.photos.set(
          list
            .filter((asset: { contentType?: string }) => asset.contentType?.startsWith('image/'))
            .map((asset: { digitalAssetId: string; name: string }) => ({
              id: asset.digitalAssetId,
              name: asset.name,
              src: this.serveUrl(asset.digitalAssetId),
            })),
        );
        this.status.set('ready');
      },
      error: () => this.status.set('error'),
    });
  }

  async choose(photo: LibraryPhoto): Promise<void> {
    const size = await measurePhoto(photo.src);
    this.close();
    this.picked.emit({ src: photo.src, ...size });
  }

  upload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const problem = photoFileError(file);
    this.uploadError.set(problem ?? '');
    if (problem) return;

    const form = new FormData();
    form.append('file', file);
    this.uploading.set(true);
    this.assets.upload(form).subscribe({
      next: async (response) => {
        const id = response?.digitalAsset?.digitalAssetId;
        const local = URL.createObjectURL(file);
        const size = await measurePhoto(local);
        URL.revokeObjectURL(local);
        this.uploading.set(false);
        this.close();
        this.picked.emit({ src: this.serveUrl(id), ...size });
      },
      error: () => {
        this.uploading.set(false);
        this.uploadError.set("We couldn't upload the photo. Try again.");
      },
    });
  }

  private serveUrl(id: string): string {
    return `${this.api.apiUrl}/digitalasset/serve/${id}`;
  }
}
