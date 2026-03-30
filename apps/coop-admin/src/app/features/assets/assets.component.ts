import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalAssetService } from '../../core/services/digital-asset.service';
import { TopbarComponent } from '../../layout/topbar.component';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, TopbarComponent],
  template: `
    <app-topbar title="Digital Assets"></app-topbar>
    <div class="assets-page">
      <div class="page-header">
        <div>
          <h2>Digital Assets</h2>
          <span class="stats">{{ assets.length }} assets</span>
        </div>
        <button class="btn btn-primary" data-testid="assets-upload-btn" (click)="fileInput.click()">
          <span class="material-icons">upload</span> Upload
        </button>
        <input #fileInput type="file" hidden (change)="uploadFile($event)" data-testid="assets-file-input" />
      </div>

      <div class="assets-grid">
        <div *ngFor="let asset of assets" class="asset-card card" data-testid="asset-card">
          <div class="asset-thumb">
            <span class="material-icons">insert_drive_file</span>
          </div>
          <div class="asset-info">
            <span class="asset-name">{{ asset.name }}</span>
            <span class="asset-meta">{{ asset.contentType }} &middot; {{ asset.createdOn | date:'shortDate' }}</span>
          </div>
          <button class="icon-btn" (click)="deleteAsset(asset)"><span class="material-icons">delete</span></button>
        </div>
      </div>

      <div *ngIf="assets.length === 0" class="empty-state card">
        <span class="material-icons">cloud_upload</span>
        <p>No assets uploaded yet</p>
      </div>
    </div>
  `,
  styles: [`
    .assets-page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
      h2 { font-size: 20px; font-weight: 600; }
      .stats { font-size: 13px; color: #1A1918CC; }
    }
    .assets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .asset-card { padding: 16px; display: flex; align-items: center; gap: 12px; }
    .asset-thumb {
      width: 48px; height: 48px; border-radius: 10px; background: #F5F4F1;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      .material-icons { color: #1A1918CC; }
    }
    .asset-info { flex: 1; }
    .asset-name { display: block; font-size: 14px; font-weight: 500; }
    .asset-meta { font-size: 12px; color: #1A1918CC; }
    .icon-btn { background: none; border: none; cursor: pointer; padding: 4px; color: #1A1918CC; }
    .empty-state { padding: 40px; text-align: center; color: #1A1918CC;
      .material-icons { font-size: 48px; margin-bottom: 8px; }
    }
  `]
})
export class AssetsComponent implements OnInit {
  private assetService = inject(DigitalAssetService);
  assets: any[] = [];

  ngOnInit(): void {
    this.loadAssets();
  }

  private loadAssets(): void {
    this.assetService.getDigitalAssets().subscribe({
      next: (data: any) => {
        this.assets = Array.isArray(data) ? data : (data?.digitalAssets || []);
      },
      error: () => {}
    });
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    this.assetService.upload(formData).subscribe({
      next: () => this.loadAssets(),
      error: () => {}
    });
  }

  deleteAsset(asset: any): void {
    this.assetService.deleteDigitalAsset(asset.digitalAssetId).subscribe({
      next: () => this.loadAssets(),
      error: () => {}
    });
  }
}
