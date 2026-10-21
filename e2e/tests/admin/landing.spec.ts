import { test, expect } from '../../fixtures/admin/api.fixture';
import { AdminLandingPage } from '../../pages/admin/landing.page';

test.describe('Admin landing page', () => {
  test('welcomes visitors to the co-op by name, in Canadian English', async ({ page }) => {
    const landing = new AdminLandingPage(page);
    await landing.goto();

    await expect(landing.brand).toContainText('OWN Housing Co-op');
    await expect(landing.heroTitle).toHaveText('Welcome to OWN Housing Co-op');
    await expect(landing.heroSubtitle).not.toHaveText(/neighbor\b|neighbors|Your Cooperative/);
  });

  test('Given no director is listed, when the landing page loads, then Board of Directors says none is listed yet', async ({
    page,
    mockApi,
  }) => {
    mockApi.store.jsonContents = mockApi.store.jsonContents.filter(
      (j) => j.name !== 'BoardOfDirectors',
    );
    const landing = new AdminLandingPage(page);
    await landing.goto();

    await expect(landing.boardEmpty).toContainText('No board members listed yet');
    await expect(landing.boardEmpty).toContainText(
      'The board of directors will appear here once the office adds them.',
    );
    await expect(landing.boardMembers).toHaveCount(0);
    await expect(landing.notices).not.toHaveCount(0);
  });

  test('Given there are no documents, when the landing page loads, then Announcements says there are none yet', async ({
    page,
    mockApi,
  }) => {
    mockApi.store.documents = [];
    const landing = new AdminLandingPage(page);
    await landing.goto();

    await expect(landing.noticesEmpty).toContainText('No announcements yet');
    await expect(landing.noticesEmpty).toContainText(
      'News from the co-op will appear here when the office posts it.',
    );
    await expect(landing.notices).toHaveCount(0);
    await expect(landing.boardMembers).not.toHaveCount(0);
  });
});
