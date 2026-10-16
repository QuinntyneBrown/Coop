import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalAssetService } from '../../core/services/digital-asset.service';
import { TopbarComponent } from '../../layout/topbar.component';
import { formatFileSize } from './format-file-size';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, TopbarComponent],
  template: `
    <app-topbar title="Digital Assets"></app-topbar>
    <div class="assets-page">
      <div class="page-header">
        <div>
          <h2 data-testid="assets-page-title">Digital Assets</h2>
          <span class="stats" data-testid="assets-info">{{ assets.length }} assets</span>
        </div>
        <div class="page-actions">
          <input
            type="text"
            class="search-input"
            placeholder="Search assets..."
            data-testid="assets-search"
            (input)="onSearchAssets($event)"
          />
          <button
            class="btn btn-primary"
            data-testid="assets-upload-button"
            (click)="openUploadDialog()"
          >
            <span class="material-icons">upload</span> Upload
          </button>
        </div>
      </div>

      <div class="assets-grid" data-testid="assets-grid">
        @for (asset of filteredAssets; track asset) {
          <div class="asset-card card" data-testid="asset-card" (click)="openAssetDetail(asset)">
            <div class="asset-thumb" data-testid="asset-preview">
              <span class="material-icons">insert_drive_file</span>
            </div>
            <div class="asset-info">
              <span class="asset-name" data-testid="asset-name">{{ asset.name }}</span>
              <span class="asset-meta">
                <span data-testid="asset-size">{{
                  formatFileSize(asset.contentLength ?? asset.size)
                }}</span>
                &middot;
                <span data-testid="asset-date">{{ asset.createdOn | date: 'mediumDate' }}</span>
              </span>
            </div>
          </div>
        }
      </div>

      @if (filteredAssets.length === 0) {
        <div class="empty-state card">
          <span class="material-icons">cloud_upload</span>
          <p>No assets uploaded yet</p>
        </div>
      }

      <!-- Upload Dialog -->
      @if (showUploadDialog) {
        <div class="modal-overlay" data-testid="upload-dialog">
          <div class="modal-content card">
            <h3>Upload File</h3>
            <div class="upload-field">
              <label for="asset-upload-file">Choose a file</label>
              <input
                id="asset-upload-file"
                type="file"
                class="file-input"
                aria-describedby="asset-upload-help"
                data-testid="upload-file-input"
                (change)="onFileSelected($event)"
              />
              <span class="upload-help" id="asset-upload-help"
                >Any file, such as a photo or a PDF, up to 28 MB.</span
              >
            </div>
            @if (uploadProgressValue >= 0) {
              <div class="progress-bar" data-testid="upload-progress">
                <div class="progress-fill" [style.width.%]="uploadProgressValue"></div>
              </div>
            }
            <div class="modal-actions">
              <button
                class="btn btn-secondary"
                data-testid="upload-cancel"
                (click)="showUploadDialog = false"
              >
                Cancel
              </button>
              <button
                class="btn btn-primary"
                data-testid="upload-confirm"
                (click)="confirmUpload()"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Asset Detail Dialog -->
      @if (selectedAsset && !showDeleteAssetDialog) {
        <div class="modal-overlay" data-testid="asset-detail-dialog">
          <div class="modal-content card">
            <h3>Asset Details</h3>
            <div class="asset-detail-info">
              <div data-testid="asset-detail-preview" class="asset-preview">
                <span class="material-icons">insert_drive_file</span>
              </div>
              <dl class="asset-detail-fields">
                <div>
                  <dt>File name</dt>
                  <dd data-testid="asset-detail-name">{{ selectedAsset.name }}</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd data-testid="asset-detail-size">
                    {{ formatFileSize(selectedAsset.contentLength ?? selectedAsset.size) }}
                  </dd>
                </div>
                <div>
                  <dt>Uploaded</dt>
                  <dd data-testid="asset-detail-date">
                    {{ selectedAsset.createdOn | date: 'MMM d, y, h:mm a' }}
                  </dd>
                </div>
              </dl>
            </div>
            <div class="modal-actions asset-detail-actions">
              <button class="btn btn-primary" data-testid="asset-download-button">Download</button>
              <button class="btn btn-secondary" (click)="selectedAsset = null">Close</button>
              <button
                class="btn btn-danger asset-delete-action"
                data-testid="asset-delete-button"
                (click)="openDeleteAssetDialog()"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Delete Asset Dialog -->
      @if (showDeleteAssetDialog) {
        <div class="modal-overlay" data-testid="asset-delete-dialog">
          <div class="modal-content card">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this asset?</p>
            <div class="modal-actions">
              <button
                class="btn btn-secondary"
                data-testid="asset-delete-cancel"
                (click)="showDeleteAssetDialog = false"
              >
                Cancel
              </button>
              <button
                class="btn btn-danger"
                data-testid="asset-delete-confirm"
                (click)="confirmDeleteAsset()"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .assets-page {
        padding: 24px;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        h2 {
          font-size: 20px;
          font-weight: 600;
        }
        .stats {
          font-size: 13px;
          color: #1a1918cc;
        }
      }
      .assets-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
        min-height: 24px;
        padding: 4px 0;
      }
      .asset-card {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .asset-thumb {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        background: #f5f4f1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        .material-icons {
          color: #1a1918cc;
        }
      }
      .asset-info {
        flex: 1;
      }
      .asset-name {
        display: block;
        font-size: 14px;
        font-weight: 500;
      }
      .asset-meta {
        font-size: 12px;
        color: #1a1918cc;
      }
      .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #1a1918cc;
      }
      .page-actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .search-input {
        padding: 8px 14px;
        border: 1px solid #e5e4e1;
        border-radius: 8px;
        font-size: 14px;
        &:focus {
          outline: none;
          border-color: #3d8a5a;
        }
      }
      .empty-state {
        padding: 40px;
        text-align: center;
        color: #1a1918cc;
        .material-icons {
          font-size: 48px;
          margin-bottom: 8px;
        }
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal-content {
        width: 100%;
        max-width: 500px;
        padding: 32px;
        h3 {
          margin-bottom: 20px;
        }
      }
      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 20px;
      }
      .asset-detail-actions {
        justify-content: flex-start;
        flex-wrap: wrap;
      }
      .asset-delete-action {
        margin-left: auto;
      }
      .upload-field {
        display: grid;
        gap: 8px;
        label {
          font-size: 16px;
          font-weight: 600;
        }
      }
      .file-input {
        width: 100%;
        min-height: 48px;
        padding: 6px;
        border: 1px solid #e5e4e1;
        border-radius: 12px;
        font-size: 16px;
        color: #1a1918;
        &::file-selector-button {
          min-height: 44px;
          margin-right: 12px;
          padding: 10px 20px;
          border: 1px solid #e5e4e1;
          border-radius: 12px;
          background: #f5f4f1;
          color: #1a1918;
          font: inherit;
          font-weight: 500;
          cursor: pointer;
        }
        &:hover::file-selector-button {
          background: #e5e4e1;
        }
        &:focus-visible {
          outline: 3px solid #3d8a5a;
          outline-offset: 2px;
        }
      }
      .upload-help {
        font-size: 14px;
        color: #1a1918cc;
      }
      .progress-bar {
        height: 6px;
        background: #e5e4e1;
        border-radius: 3px;
        margin-top: 12px;
        overflow: hidden;
      }
      .progress-fill {
        height: 100%;
        background: #3d8a5a;
        transition: width 0.3s;
      }
      .btn-danger {
        background: #dc3545;
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
      }
      .asset-detail-info {
        text-align: center;
        margin-bottom: 16px;
      }
      .asset-detail-fields {
        display: grid;
        gap: 12px;
        margin: 0;
        text-align: left;
        dt {
          font-size: 14px;
          color: #1a1918cc;
        }
        dd {
          margin: 2px 0 0;
          font-size: 16px;
          overflow-wrap: anywhere;
        }
      }
      .asset-preview {
        margin-bottom: 16px;
        .material-icons {
          font-size: 64px;
          color: #1a1918cc;
        }
      }
      @media (max-width: 768px) {
        .assets-page {
          padding: 16px;
        }
        .page-header {
          flex-wrap: wrap;
          gap: 12px;
        }
        .page-actions {
          flex: 1 1 100%;
          flex-wrap: wrap;
        }
        .search-input {
          flex: 1 1 160px;
          min-width: 0;
        }
      }
    `,
  ],
})
export class AssetsComponent implements OnInit {
  private assetService = inject(DigitalAssetService);
  readonly formatFileSize = formatFileSize;
  assets: any[] = [];
  filteredAssets: any[] = [];
  selectedAsset: any = null;
  showUploadDialog = false;
  showDeleteAssetDialog = false;
  uploadProgressValue = -1;
  selectedFile: File | null = null;

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
