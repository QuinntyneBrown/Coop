import { type Locator, type Page, expect } from '@playwright/test';

export class DigitalAssetsPage {
  readonly page: Page;

  // Top bar
  readonly pageTitle: Locator;
  readonly searchBar: Locator;
  readonly uploadButton: Locator;
  readonly assetInfo: Locator;

  // Asset grid
  readonly assetGrid: Locator;
  readonly assetCards: Locator;

  // Upload dialog
  readonly uploadDialog: Locator;
  readonly fileInput: Locator;
  readonly uploadCancelButton: Locator;
  readonly uploadConfirmButton: Locator;
  readonly uploadProgress: Locator;

  // Asset detail dialog
  readonly assetDetailDialog: Locator;
  readonly assetDetailName: Locator;
  readonly assetDetailSize: Locator;
  readonly assetDetailDate: Locator;
  readonly assetDetailPreview: Locator;
  readonly assetDeleteButton: Locator;
  readonly assetDownloadButton: Locator;

  // Delete dialog
  readonly deleteDialog: Locator;
  readonly deleteConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.getByTestId('assets-page-title');
    this.searchBar = page.getByTestId('assets-search');
    this.uploadButton = page.getByTestId('assets-upload-button');
    this.assetInfo = page.getByTestId('assets-info');

    this.assetGrid = page.getByTestId('assets-grid');
    this.assetCards = page.getByTestId('asset-card');

    this.uploadDialog = page.getByTestId('upload-dialog');
    this.fileInput = page.getByTestId('upload-file-input');
    this.uploadCancelButton = page.getByTestId('upload-cancel');
    this.uploadConfirmButton = page.getByTestId('upload-confirm');
    this.uploadProgress = page.getByTestId('upload-progress');

    this.assetDetailDialog = page.getByTestId('asset-detail-dialog');
    this.assetDetailName = page.getByTestId('asset-detail-name');
    this.assetDetailSize = page.getByTestId('asset-detail-size');
    this.assetDetailDate = page.getByTestId('asset-detail-date');
    this.assetDetailPreview = page.getByTestId('asset-detail-preview');
    this.assetDeleteButton = page.getByTestId('asset-delete-button');
    this.assetDownloadButton = page.getByTestId('asset-download-button');

    this.deleteDialog = page.getByTestId('asset-delete-dialog');
    this.deleteConfirmButton = page.getByTestId('asset-delete-confirm');
  }

  async goto() {
    await this.page.goto('/assets');
  }

  async expectPageLoaded() {
    await expect(this.pageTitle).toHaveText('Digital Assets');
    await expect(this.uploadButton).toBeVisible();
  }

  async expectAssetInfo(text: string) {
    await expect(this.assetInfo).toContainText(text);
  }

  async getAssetCount(): Promise<number> {
    return this.assetCards.count();
  }

  async searchAssets(query: string) {
    await this.searchBar.fill(query);
    await this.page.waitForTimeout(300);
  }

  async clickAsset(index: number) {
    await this.assetCards.nth(index).click();
  }

  async expectAssetCard(index: number, fileName: string) {
    const card = this.assetCards.nth(index);
    await expect(card.getByTestId('asset-name')).toContainText(fileName);
  }

  async uploadFile(filePath: string) {
    await this.uploadButton.click();
    await expect(this.uploadDialog).toBeVisible();
    await this.fileInput.setInputFiles(filePath);
    await this.uploadConfirmButton.click();
  }

  async deleteAsset(index: number) {
    await this.clickAsset(index);
    await expect(this.assetDetailDialog).toBeVisible();
    await this.assetDeleteButton.click();
    await expect(this.deleteDialog).toBeVisible();
    await this.deleteConfirmButton.click();
  }
}
