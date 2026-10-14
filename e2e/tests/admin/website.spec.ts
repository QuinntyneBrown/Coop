// Acceptance Test
// Traces to: L2-REQ-095, L2-REQ-096, L2-REQ-097, L2-REQ-098, L2-REQ-099
// Description: An office administrator edits the public site content from the
// admin Website screen: the blocks in page order, load error and Try again,
// the block editor with its required fields, safe-link and photo-description
// checks, failed save, Cancel and Escape, list items added, moved and removed,
// photos chosen from the Assets library or uploaded, and the public site
// showing what was saved.

import { test, expect } from '../../fixtures/admin/api.fixture';
import type { MockApi } from '../../fixtures/mock-api/mock-api';
import { SidebarComponent } from '../../pages/admin/sidebar.component';
import { WebsitePage } from '../../pages/admin/website.page';

/** The published site content in the mock store. */
function published(mockApi: MockApi): Record<string, any> {
  return mockApi.store.jsonContents.find((j) => j.name === 'SiteContent')!.content;
}

/** A 1x1 PNG, the smallest real photo. */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

const HOME_BLOCKS = [
  'Hero',
  'At a glance',
  'Who we are',
  'A look around',
  'Our building and community',
  "What's on",
  'Meet the board',
  'A word from a member',
  'Visit or apply',
];

test.describe('Website content', () => {
  let website: WebsitePage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    website = new WebsitePage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
  });

  test.describe('Blocks', () => {
    test('lists the header, the footer and the home page blocks in page order', async () => {
      await website.goto();
      await website.expectPageLoaded();
      await sidebar.expectActiveLink('website');
      await expect(website.group('On every page').getByRole('heading', { level: 3 })).toHaveText([
        'Header',
        'Footer',
      ]);
      await expect(website.group('Home page').getByRole('heading', { level: 3 })).toHaveText(
        HOME_BLOCKS,
      );
      await expect(website.block('Header')).toContainText('OWN Housing Co-op');
      await expect(website.block('Hero')).toContainText(
        'A home of our own, in the heart of Toronto.',
      );
      await expect(website.block('At a glance')).toContainText('3 figures');
      await expect(website.block('A look around')).toContainText('6 photos');
    });

    test('offers Try again when the content cannot be loaded', async ({ mockApi }) => {
      mockApi.failing.add('GET site-content');
      await website.goto();
      await expect(website.error).toContainText(
        "We couldn't load the website content. Check your connection and try again.",
      );
      mockApi.failing.clear();
      await website.retryButton.click();
      await website.expectPageLoaded();
      await expect(website.error).toBeHidden();
    });
  });

  test.describe('Edit a block', () => {
    test('opens the editor filled in and closes it with Cancel or Escape without saving', async ({
      authenticatedPage,
      mockApi,
    }) => {
      await website.goto();
      await website.openEditor('Hero');
      await expect(website.editorHeading).toHaveText('Edit Hero');
      await expect(website.field('Title')).toHaveValue(
        'A home of our own, in the heart of Toronto.',
      );
      await expect(website.field('Label', 'Main button')).toHaveValue('Book a visit');
      await expect(website.field('Photo description')).toHaveValue(/^Our brick building/);
      await expect(website.field('Small heading above the title (optional)')).toBeFocused();

      await website.field('Title').fill('Changed but cancelled');
      await website.cancelButton.click();
      await expect(website.editor).toBeHidden();
      await expect(website.editButton('Hero')).toBeFocused();

      await website.openEditor('Hero');
      await expect(website.field('Title')).toHaveValue(
        'A home of our own, in the heart of Toronto.',
      );
      await authenticatedPage.keyboard.press('Escape');
      await expect(website.editor).toBeHidden();
      expect(published(mockApi).home.hero.title).toBe(
        'A home of our own, in the heart of Toronto.',
      );
    });

    test('saves a changed hero and the public home page shows it', async ({ mockApi }) => {
      await website.goto();
      await website.openEditor('Hero');
      await website.field('Title').fill('Come home to the co-op.');
      await website.field('Label', 'Main button').fill('Meet the board');
      await website.field('Address', 'Main button').fill('/#board');
      await website.save();

      await expect(website.editor).toBeHidden();
      await expect(website.notice).toHaveText('Your changes are now on the website.');
      await expect(website.block('Hero')).toContainText('Come home to the co-op.');
      expect(published(mockApi).home.hero.title).toBe('Come home to the co-op.');

      const home = await website.openPublicHomePage();
      await expect(home.heroTitle).toHaveText('Come home to the co-op.');
      await expect(home.heroCta).toHaveText('Meet the board');
      await expect(home.heroCta).toHaveAttribute('href', '/#board');
    });

    test('keeps the editor open and names the empty required field', async ({ mockApi }) => {
      await website.goto();
      await website.openEditor('Hero');
      await website.field('Title').fill('');
      await website.field('Label', 'Second button').fill('');
      await website.save();

      await expect(website.editor).toBeVisible();
      await expect(website.editorErrors).toContainText(
        'Something needs attention before your changes can be saved.',
      );
      await expect(website.fieldError('Title')).toHaveText('Fill in “Title”');
      await expect(website.fieldError('Label', 'Second button')).toHaveText('Fill in “Label”');
      await expect(website.field('Title')).toHaveAttribute('aria-invalid', 'true');
      expect(published(mockApi).home.hero.title).toBe(
        'A home of our own, in the heart of Toronto.',
      );
    });

    test('refuses an unsafe link address', async ({ mockApi }) => {
      await website.goto();
      await website.openEditor('Hero');
      await website.field('Address', 'Main button').fill('javascript:alert(1)');
      await website.save();

      await expect(website.fieldError('Address', 'Main button')).toHaveText(
        'Use a page on this site, a web address, an e-mail address or a phone number.',
      );
      expect(published(mockApi).home.hero.primaryAction.href).toBe('/#visit');
    });

    test('keeps the entered values and explains when the save fails', async ({ mockApi }) => {
      mockApi.failing.add('PUT site-content');
      await website.goto();
      await website.openEditor('Visit or apply');
      await website.field('Title').fill('Drop in any weekday.');
      await website.save();

      await expect(website.editorFailed).toHaveText("We couldn't save your changes. Try again.");
      await expect(website.field('Title')).toHaveValue('Drop in any weekday.');
      await expect(website.saveButton).toBeEnabled();

      mockApi.failing.clear();
      await website.save();
      await expect(website.editor).toBeHidden();
      expect(published(mockApi).home.visit.title).toBe('Drop in any weekday.');
    });
  });

  test.describe('Lists', () => {
    test('adds, moves and removes menu links and the public header follows', async ({
      mockApi,
    }) => {
      await website.goto();
      await website.openEditor('Header');
      await expect(website.itemButton('Move menu link 1 up')).toBeDisabled();
      await expect(website.itemButton('Move menu link 5 down')).toBeDisabled();

      await website.itemButton('Add menu link').click();
      await expect(website.field('Label', 'Menu link 6')).toBeFocused();
      await website.field('Label', 'Menu link 6').fill('Our garden');
      await website.field('Address', 'Menu link 6').fill('/pages/our-garden');
      await website.itemButton('Move menu link 6 up').click();
      await expect(website.field('Label', 'Menu link 5')).toHaveValue('Our garden');
      await website.itemButton('Remove menu link 2').click();
      await website.save();

      await expect(website.notice).toHaveText('Your changes are now on the website.');
      expect(published(mockApi).header.menuLinks.map((l: any) => l.label)).toEqual([
        'Home',
        'Living here',
        "What's on",
        'Our garden',
        'Contact',
      ]);

      const home = await website.openPublicHomePage();
      await home.page.setViewportSize({ width: 1280, height: 800 });
      await expect(home.navLink('Our garden')).toHaveAttribute('href', '/pages/our-garden');
      await expect(home.navLink('About us')).toHaveCount(0);
    });

    test('edits the checklist of a building row one item per line', async ({ mockApi }) => {
      await website.goto();
      await website.openEditor('Our building and community');
      await website
        .field('Checklist (one item per line)', 'Row 1')
        .fill('Step-free entrance\n\nTwo lifts\n');
      await website.save();

      await expect(website.editor).toBeHidden();
      expect(published(mockApi).home.features.rows[0].items).toEqual([
        'Step-free entrance',
        'Two lifts',
      ]);
    });
  });

  test.describe('Photos', () => {
    test('chooses a photo from the library and asks for a new description', async ({ mockApi }) => {
      const asset = mockApi.createAsset({
        fileName: 'garden-party.png',
        contentType: 'image/png',
        size: 68,
      });
      mockApi.createAsset({ fileName: 'minutes.pdf', contentType: 'application/pdf', size: 68 });
      await website.goto();
      await website.openEditor('Hero');
      await website.openPicker();
      await expect(website.pickerOption('garden-party.png')).toBeVisible();
      await expect(website.pickerOptions.filter({ hasText: 'minutes.pdf' })).toHaveCount(0);

      await website.pickerOption('garden-party.png').click();
      await expect(website.picker).toBeHidden();
      await expect(website.field('Photo description')).toHaveValue('');
      await website.save();
      await expect(website.fieldError('Photo description')).toHaveText(
        'Describe this photo for people who cannot see it',
      );

      await website.field('Photo description').fill('Neighbours at the garden party.');
      await website.save();
      await expect(website.editor).toBeHidden();
      const photo = published(mockApi).home.hero.photo;
      expect(photo.src).toBe(
        `http://localhost:5000/api/digitalasset/serve/${asset.digitalAssetId}`,
      );
      expect(photo.alt).toBe('Neighbours at the garden party.');
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
    });

    test('says when the library has no photos, and Cancel keeps the current photo', async ({
      mockApi,
    }) => {
      mockApi.store.assets = [];
      await website.goto();
      await website.openEditor('A word from a member');
      await website.openPicker();
      await expect(website.pickerEmpty).toHaveText(
        'No photos in the library yet. Upload one below.',
      );
      await website.pickerCancel.click();
      await expect(website.picker).toBeHidden();
      await expect(website.field('Photo description')).toHaveValue(/^Beatrix/);
    });

    test('uploads a new photo into the library and uses it', async ({ mockApi }) => {
      await website.goto();
      await website.openEditor('A word from a member');
      await website.openPicker();
      await website.uploadPhoto('beatrix.png', PNG);
      await expect(website.picker).toBeHidden();
      await website.field('Photo description').fill('Beatrix in her garden.');
      await website.save();

      await expect(website.editor).toBeHidden();
      const uploaded = mockApi.store.assets.find((a) => a.name === 'beatrix.png')!;
      expect(published(mockApi).home.quote.photo.src).toBe(
        `http://localhost:5000/api/digitalasset/serve/${uploaded.digitalAssetId}`,
      );
    });

    test('refuses a file that is not a photo', async ({ mockApi }) => {
      const before = mockApi.store.assets.length;
      await website.goto();
      await website.openEditor('A word from a member');
      await website.openPicker();
      await website.uploadPhoto('notes.txt', Buffer.from('notes'), 'text/plain');
      await expect(website.pickerUploadError).toHaveText('Choose a JPEG, PNG or WebP photo.');
      expect(mockApi.store.assets).toHaveLength(before);
    });

    test('explains when the upload fails', async ({ mockApi }) => {
      mockApi.failing.add('POST digitalasset/upload');
      await website.goto();
      await website.openEditor('A word from a member');
      await website.openPicker();
      await website.uploadPhoto('beatrix.png', PNG);
      await expect(website.pickerUploadError).toHaveText(
        "We couldn't upload the photo. Try again.",
      );
      await expect(website.picker).toBeVisible();
    });
  });

  test('fits a 320 px wide screen without horizontal scrolling', async ({ authenticatedPage }) => {
    await authenticatedPage.setViewportSize({ width: 320, height: 640 });
    await website.goto();
    await website.expectPageLoaded();
    expect(await website.hasHorizontalScroll()).toBe(false);
    await website.openEditor('Header');
    expect(await website.hasHorizontalScroll()).toBe(false);
  });
});
