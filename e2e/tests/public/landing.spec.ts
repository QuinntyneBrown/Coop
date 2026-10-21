// Acceptance Test
// Traces to: L2-REQ-053, L2-REQ-066, L2-REQ-067, L2-REQ-068, L2-REQ-069, L2-REQ-070,
// L2-REQ-071, L2-REQ-078, L2-REQ-079, L2-REQ-082, L2-REQ-101
// Description: The public home page renders the OWN design: header with sign in,
// CMS-driven hero with its actions and photograph, the body blocks, the board
// list and published notices from the API, the contact footer, and the phone
// menu and one-column reflow on a narrow viewport.

import { test, expect } from '../../fixtures/public/auth.fixture';
import { LandingPage } from '../../pages/public/landing.page';
import { ADMIN_LOGIN_URL, LoginPage as AdminLoginPage } from '../../pages/admin/login.page';

const DEFAULT_HERO_TITLE = 'A home of our own, in the heart of Toronto.';

test.describe('Home page', () => {
  let landing: LandingPage;

  test.beforeEach(async ({ page }) => {
    landing = new LandingPage(page);
  });

  test.describe('Header', () => {
    test('shows the Co-op name and a Member sign in link without signing in', async () => {
      await landing.goto();
      await expect(landing.header).toBeVisible();
      await expect(landing.brand).toContainText('OWN Housing Co-op');
      await expect(landing.signInLink).toBeVisible();
    });

    // L2-REQ-066 AC4, L2-REQ-101 AC3
    test('opens the admin login screen from Member sign in', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await landing.goto();
      await landing.signInLink.click();
      await new AdminLoginPage(page).expectOpen();
    });

    // L2-REQ-101 AC6
    test('reaches Member sign in with the keyboard, with its label and a focus ring', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await landing.goto();
      await expect(landing.signInLink).toHaveText('Member sign in');
      await expect(landing.signInLink).toHaveAttribute('href', ADMIN_LOGIN_URL);
      await landing.tabTo(landing.signInLink);
      expect(await landing.focusOutline(landing.signInLink)).toBe('solid');
      await page.keyboard.press('Enter');
      await new AdminLoginPage(page).expectOpen();
    });

    test('lists the website pages after the home page sections', async ({ mockApi, page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      const seeded = mockApi.store.pages[0];
      await landing.goto();
      await expect(landing.nav.getByRole('link')).toHaveText([
        'Home',
        'About us',
        'Living here',
        "What's on",
        'Contact',
        seeded.title,
      ]);
      await expect(landing.navPageLinks).toHaveAttribute('href', `/pages/${seeded.slug}`);
      await expect(landing.nav.getByRole('link', { name: 'Home' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    test('shows only the home page sections when there are no pages', async ({ mockApi, page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      mockApi.store.pages = [];
      await landing.goto();
      await expect(landing.navPageLinks).toHaveCount(0);
      await expect(landing.nav.getByRole('link')).toHaveCount(5);
    });
  });

  test.describe('Hero', () => {
    test('renders the title and lead from the published site content', async ({ mockApi }) => {
      const content = mockApi.store.jsonContents.find((j) => j.name === 'SiteContent')!.content;
      content.home.hero.title = 'A home for retired women, run by its members';
      content.home.hero.lead =
        'Submit requests, read notices, and stay in touch with your neighbours.';
      await landing.goto();
      await expect(landing.heroTitle).toHaveText('A home for retired women, run by its members');
      await expect(landing.heroSubtitle).toHaveText(
        'Submit requests, read notices, and stay in touch with your neighbours.',
      );
    });

    test('falls back to the default copy when there is no site content', async ({ mockApi }) => {
      mockApi.store.jsonContents = [];
      await landing.goto();
      await expect(landing.heroTitle).toHaveText(DEFAULT_HERO_TITLE);
    });

    test('offers Book a visit and How to apply', async () => {
      await landing.goto();
      await expect(landing.heroCta).toHaveText(/Book a visit/);
      await expect(landing.heroSecondaryCta).toHaveText('How to apply');
    });

    test('shows the hero photograph with a description', async () => {
      await landing.goto();
      await expect(landing.heroPhoto).toBeVisible();
      await expect(landing.heroPhoto).toHaveAttribute('alt', /\S+/);
    });

    test('stacks the hero in one column on a phone', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await landing.goto();
      const text = await landing.heroTitle.boundingBox();
      const photo = await landing.heroPhoto.boundingBox();
      expect(text && photo && photo.y >= text.y + text.height).toBeTruthy();
    });
  });

  test.describe('Body blocks', () => {
    test('shows at a glance, who we are, the gallery and the building and community rows', async () => {
      await landing.goto();
      await expect(landing.stats).toBeVisible();
      await expect(landing.about).toContainText('Who we are');
      await expect(landing.gallery).toBeVisible();
      await expect(landing.galleryPhotos).toHaveCount(6);
      await expect(landing.features).toContainText('Our building');
      await expect(landing.features).toContainText('Our community');
    });

    test('describes every photograph for screen readers', async () => {
      await landing.goto();
      const photos = await landing.galleryPhotos.all();
      for (const photo of photos) {
        await expect(photo).toHaveAttribute('alt', /\S+/);
      }
    });

    test('shows a word from a member and the visit band with a tel link', async () => {
      await landing.goto();
      await expect(landing.quote).toBeVisible();
      await expect(landing.visit).toContainText('Come and see for yourself.');
      await expect(landing.visit.getByRole('link', { name: '416 555 0142' })).toHaveAttribute(
        'href',
        /^tel:/,
      );
    });
  });

  test.describe('Board', () => {
    test('lists the board members from the BoardOfDirectors CMS content', async ({ mockApi }) => {
      const board = mockApi.store.jsonContents.find((j) => j.name === 'BoardOfDirectors')!;
      const members = board.content['members'] as { name: string; title: string }[];
      await landing.goto();
      await landing.expectBoardSectionVisible();
      await expect(landing.boardMembers).toHaveCount(members.length);
      for (const member of members) {
        await expect(landing.boardMember(member.name)).toContainText(member.title);
      }
    });

    test('falls back to the published board member profiles when the CMS list is empty', async ({
      mockApi,
    }) => {
      mockApi.store.jsonContents = mockApi.store.jsonContents.filter(
        (j) => j.name !== 'BoardOfDirectors',
      );
      const profiles = mockApi.store.profiles.filter((p) => p.type === 1);
      await landing.goto();
      await expect(landing.boardMembers).toHaveCount(profiles.length);
      await expect(
        landing.boardMember(`${profiles[0].firstname} ${profiles[0].lastname}`),
      ).toContainText(profiles[0].boardTitle!);
    });
  });

  test.describe("What's on", () => {
    test('shows each published notice with its date, title and excerpt', async ({ mockApi }) => {
      const published = mockApi.store.documents.filter(
        (d) => d.documentType === 'Notice' && d.status === 'Published',
      );
      await landing.goto();
      await landing.expectNoticesVisible();
      await expect(landing.noticeCards).toHaveCount(published.length);
      const card = landing.noticeCard(published[0].name);
      await expect(card).toContainText(published[0].body.slice(0, 30));
      await expect(card.locator('time')).toHaveAttribute('datetime', /\d{4}-\d{2}-\d{2}/);
    });

    test('says when there are no notices', async ({ mockApi }) => {
      mockApi.store.documents = [];
      await landing.goto();
      await expect(landing.noticesEmpty).toHaveText('No notices right now. Check back soon.');
      await expect(landing.noticeCards).toHaveCount(0);
    });
  });

  test.describe('Phone menu', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
    });

    test('hides the horizontal links behind a labelled Menu button', async () => {
      await landing.goto();
      await expect(landing.nav).toBeHidden();
      await expect(landing.signInLink).toBeHidden();
      await expect(landing.menuButton).toHaveText(/Menu/);
      await expect(landing.menuButton).toHaveAttribute('aria-expanded', 'false');
      await expect(landing.menu).toBeHidden();
    });

    test('opens a panel with the links, Member sign in and Book a visit', async () => {
      await landing.goto();
      await landing.openMenu();
      await expect(landing.menuButton).toHaveText(/Close/);
      await expect(landing.menuButton).toHaveAttribute('aria-expanded', 'true');
      await expect(landing.menuLinks).toHaveText([
        'Home',
        'About us',
        'Living here',
        "What's on",
        'Contact',
      ]);
      await expect(landing.menuPageLinks).toHaveText(['How to apply']);
      await expect(landing.menuSignInLink).toBeVisible();
      await expect(landing.menu.getByRole('link', { name: 'Book a visit' })).toBeVisible();
    });

    test('closes on Escape and returns focus to the Menu button', async () => {
      await landing.goto();
      await landing.openMenu();
      await landing.closeMenuWithEscape();
      await expect(landing.menu).toBeHidden();
      await expect(landing.menuButton).toHaveAttribute('aria-expanded', 'false');
      await expect(landing.menuButton).toBeFocused();
    });

    // L2-REQ-067 AC2, L2-REQ-101 AC3
    test('opens the admin login screen from the panel', async ({ page }) => {
      await landing.goto();
      await landing.openMenu();
      await landing.menuSignInLink.click();
      await new AdminLoginPage(page).expectOpen();
    });
  });

  test.describe('Reflow', () => {
    for (const width of [360, 320]) {
      test(`fits a ${width} px viewport without horizontal scrolling`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await landing.goto();
        expect(await landing.hasHorizontalScroll()).toBe(false);
        await expect(landing.heroCta).toBeVisible();
        await landing.visit.scrollIntoViewIfNeeded();
        await expect(landing.visit.getByRole('link', { name: 'Send us a note' })).toBeVisible();
      });
    }

    test('shows the horizontal links and hides the Menu button on a desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await landing.goto();
      await expect(landing.nav).toBeVisible();
      await expect(landing.signInLink).toBeVisible();
      await expect(landing.menuButton).toBeHidden();
    });
  });

  test.describe('Footer', () => {
    test('shows how to visit or write, with the phone as a tel link', async () => {
      await landing.goto();
      await expect(landing.footer).toBeVisible();
      await expect(landing.footer).toContainText('Visit or write');
      await expect(landing.footerPhone).toHaveAttribute('href', /^tel:/);
    });
  });
});
