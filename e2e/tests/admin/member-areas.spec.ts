// Acceptance Test
// Traces to: L2-REQ-112, L2-REQ-117
// Description: A member who signs in on the admin site sees only the member
// areas and is sent to the dashboard when typing an office address; the
// office keeps every section.

import { test, expect } from '../../fixtures/admin/auth.fixture';
import { SidebarComponent } from '../../pages/admin/sidebar.component';
import { DashboardPage } from '../../pages/admin/dashboard.page';

const MEMBER_AREAS = ['Dashboard', 'Maintenance', 'Documents', 'Messages', 'My profile'];

// The office's grouped sidebar (L2-REQ-118 AC1): Dashboard, Website, Community, Operations, Access, Settings.
const OFFICE_SECTIONS = [
  'Dashboard',
  'Website',
  'Documents',
  'Messages',
  'Profiles',
  'Maintenance',
  'Users',
  'Roles and privileges',
  'Invitations',
  'Settings',
];

test.describe('Member areas by role', () => {
  test.describe('Sidebar', () => {
    test('Given a member signs in, when the dashboard loads, then the sidebar lists only the member areas', async ({
      memberPage,
    }) => {
      const dashboard = new DashboardPage(memberPage);
      await dashboard.goto();
      const sidebar = new SidebarComponent(memberPage);

      await sidebar.expectLinks(MEMBER_AREAS);
      await sidebar.expectUserInfo('member', 'Member');
    });

    test('Given a member on the sidebar, when they choose My profile, then their profile opens and the link is current', async ({
      memberPage,
    }) => {
      await new DashboardPage(memberPage).goto();
      const sidebar = new SidebarComponent(memberPage);

      await sidebar.profileLink.click();

      await expect(memberPage).toHaveURL(/\/profile$/);
      await expect(sidebar.profileLink).toHaveAttribute('aria-current', 'page');
    });

    test('Given an administrator signs in, when the dashboard loads, then the sidebar lists every section and no My profile', async ({
      authenticatedPage,
    }) => {
      await new DashboardPage(authenticatedPage).goto();
      const sidebar = new SidebarComponent(authenticatedPage);

      await sidebar.expectLinks(OFFICE_SECTIONS);
      await sidebar.expectGroupHeadings(['Community', 'Operations', 'Access']);
      await expect(sidebar.profileLink).toHaveCount(0);
    });
  });

  test.describe('Typed office addresses', () => {
    for (const path of ['/website', '/website/home', '/website/board', '/pages', '/board', '/assets', '/users', '/roles', '/profiles', '/invitations', '/settings']) {
      test(`Given a member, when they type ${path}, then the dashboard opens instead`, async ({ memberPage }) => {
        await memberPage.goto(path);

        await expect(memberPage).toHaveURL(/\/dashboard$/);
        await expect(new DashboardPage(memberPage).greeting).toBeVisible();
      });
    }

    test('Given an administrator, when they type /users, then the Users screen opens', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/users');

      await expect(authenticatedPage).toHaveURL(/\/users$/);
    });
  });
});
