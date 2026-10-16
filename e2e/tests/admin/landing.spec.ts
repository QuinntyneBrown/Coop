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
});
