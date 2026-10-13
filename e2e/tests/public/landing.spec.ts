// Acceptance Test
// Traces to: L2-REQ-053, L2-REQ-066, L2-REQ-068, L2-REQ-069, L2-REQ-070, L2-REQ-078
// Description: The public home page renders the OWN design: header with sign in,
// CMS-driven hero with its actions and photograph, the body blocks, the board
// list and published notices from the API, and the contact footer.

import { test, expect } from '../../fixtures/public/auth.fixture';
import { LandingPage } from '../../pages/public/landing.page';

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

    test('opens the login page from Member sign in', async () => {
      await landing.goto();
      await landing.navigateToLogin();
      await expect(landing.page).toHaveURL(/\/login/);
    });
  });

  test.describe('Hero', () => {
    test('renders the title and lead from the Hero CMS content', async ({ mockApi }) => {
      const hero = mockApi.store.jsonContents.find((j) => j.name === 'Hero')!;
      await landing.goto();
      await expect(landing.heroTitle).toHaveText(String(hero.content['title']));
      await expect(landing.heroSubtitle).toHaveText(String(hero.content['subtitle']));
    });

    test('falls back to the default copy when the CMS has no Hero', async ({ mockApi }) => {
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

  test.describe('Footer', () => {
    test('shows how to visit or write, with the phone as a tel link', async () => {
      await landing.goto();
      await expect(landing.footer).toBeVisible();
      await expect(landing.footer).toContainText('Visit or write');
      await expect(landing.footerPhone).toHaveAttribute('href', /^tel:/);
    });
  });
});
