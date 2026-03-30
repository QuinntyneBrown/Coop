import { test, expect } from '../fixtures/api.fixture';
import { DigitalAssetsPage } from '../pages/digital-assets.page';
import { SidebarComponent } from '../pages/sidebar.component';
import path from 'path';

test.describe('Digital Assets', () => {
  let assetsPage: DigitalAssetsPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    assetsPage = new DigitalAssetsPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
    await assetsPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the digital assets page', async () => {
      await assetsPage.expectPageLoaded();
    });

    test('should mark assets as active in sidebar', async () => {
      await sidebar.expectActiveLink('assets');
    });

    test('should display page title as Digital Assets', async () => {
      await expect(assetsPage.pageTitle).toHaveText('Digital Assets');
    });

    test('should display search bar', async () => {
      await expect(assetsPage.searchBar).toBeVisible();
    });

    test('should display Upload button', async () => {
      await expect(assetsPage.uploadButton).toBeVisible();
      await expect(assetsPage.uploadButton).toContainText('Upload');
    });

    test('should display asset count and size info', async () => {
      await expect(assetsPage.assetInfo).toBeVisible();
      await expect(assetsPage.assetInfo).toContainText(/\d+ assets/);
    });
  });

  test.describe('Asset Grid', () => {
    test('should display asset grid', async () => {
      await expect(assetsPage.assetGrid).toBeVisible();
    });

    test('should display asset cards with names', async ({ api }) => {
      await api.uploadAsset('test-image.png', Buffer.from('fake-png-content'));
      await assetsPage.goto();

      const count = await assetsPage.getAssetCount();
      expect(count).toBeGreaterThan(0);

      const firstCard = assetsPage.assetCards.first();
      await expect(firstCard.getByTestId('asset-name')).toBeVisible();
    });

    test('should display file size on asset cards', async ({ api }) => {
      await api.uploadAsset('size-test.txt', Buffer.from('some content'));
      await assetsPage.goto();

      const firstCard = assetsPage.assetCards.first();
      const size = firstCard.getByTestId('asset-size');
      await expect(size).toBeVisible();
    });

    test('should display date on asset cards', async ({ api }) => {
      await api.uploadAsset('date-test.txt', Buffer.from('content'));
      await assetsPage.goto();

      const firstCard = assetsPage.assetCards.first();
      const date = firstCard.getByTestId('asset-date');
      await expect(date).toBeVisible();
    });

    test('should display preview thumbnails for images', async ({ api }) => {
      await api.uploadAsset('preview-test.png', Buffer.from('fake-png'));
      await assetsPage.goto();

      const firstCard = assetsPage.assetCards.first();
      const preview = firstCard.getByTestId('asset-preview');
      await expect(preview).toBeVisible();
    });
  });

  test.describe('Search', () => {
    test('should filter assets by search query', async ({ api }) => {
      await api.uploadAsset('unique-searchable-file.txt', Buffer.from('data'));
      await assetsPage.goto();

      await assetsPage.searchAssets('unique-searchable');
      const count = await assetsPage.getAssetCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should show no results for non-matching query', async () => {
      await assetsPage.searchAssets('zzz_nonexistent_asset_zzz');
      const count = await assetsPage.getAssetCount();
      expect(count).toBe(0);
    });
  });

  test.describe('Upload', () => {
    test('should open upload dialog when clicking Upload', async () => {
      await assetsPage.uploadButton.click();
      await expect(assetsPage.uploadDialog).toBeVisible();
    });

    test('should close upload dialog on cancel', async () => {
      await assetsPage.uploadButton.click();
      await assetsPage.uploadCancelButton.click();
      await expect(assetsPage.uploadDialog).toBeHidden();
    });

    test('should display file input in upload dialog', async () => {
      await assetsPage.uploadButton.click();
      await expect(assetsPage.fileInput).toBeAttached();
    });
  });

  test.describe('Asset Detail', () => {
    test('should open asset detail dialog on click', async ({ api }) => {
      await api.uploadAsset('detail-view.txt', Buffer.from('detail content'));
      await assetsPage.goto();

      await assetsPage.clickAsset(0);
      await expect(assetsPage.assetDetailDialog).toBeVisible();
    });

    test('should display asset name in detail dialog', async ({ api }) => {
      await api.uploadAsset('named-asset.txt', Buffer.from('content'));
      await assetsPage.goto();

      await assetsPage.clickAsset(0);
      await expect(assetsPage.assetDetailName).toBeVisible();
    });

    test('should display size and date in detail dialog', async ({ api }) => {
      await api.uploadAsset('info-asset.txt', Buffer.from('content'));
      await assetsPage.goto();

      await assetsPage.clickAsset(0);
      await expect(assetsPage.assetDetailSize).toBeVisible();
      await expect(assetsPage.assetDetailDate).toBeVisible();
    });

    test('should display download and delete buttons in detail', async ({ api }) => {
      await api.uploadAsset('actions-asset.txt', Buffer.from('content'));
      await assetsPage.goto();

      await assetsPage.clickAsset(0);
      await expect(assetsPage.assetDownloadButton).toBeVisible();
      await expect(assetsPage.assetDeleteButton).toBeVisible();
    });
  });

  test.describe('Delete Asset', () => {
    test('should show delete confirmation dialog', async ({ api }) => {
      await api.uploadAsset('delete-me.txt', Buffer.from('to delete'));
      await assetsPage.goto();

      await assetsPage.clickAsset(0);
      await assetsPage.assetDeleteButton.click();
      await expect(assetsPage.deleteDialog).toBeVisible();
    });

    test('should delete asset after confirmation', async ({ api }) => {
      await api.uploadAsset('confirm-delete.txt', Buffer.from('to delete'));
      await assetsPage.goto();

      const initialCount = await assetsPage.getAssetCount();
      await assetsPage.deleteAsset(0);
      await expect(assetsPage.deleteDialog).toBeHidden();
    });
  });
});
