// Every admin screen in the sidebar layout starts the same way: no separate
// top bar, and the page title shown once as the screen's heading.
import { test } from '../../fixtures/admin/auth.fixture';
import { PageHeaderComponent } from '../../pages/admin/page-header.component';

const screens: [path: string, title: string | RegExp][] = [
  ['/dashboard', /^Hello, /],
  ['/maintenance', 'Maintenance Requests'],
  ['/documents', 'Documents'],
  ['/website', 'Website'],
  ['/website/board', 'Board of directors'],
  ['/website/photos', 'Photos'],
  ['/messages', 'Messages'],
  ['/users', 'Users'],
  ['/roles', 'Roles & Privileges'],
  ['/invitations', 'Invitations'],
  ['/settings', 'Settings'],
];

test.describe('Admin page header', () => {
  for (const [path, title] of screens) {
    test(`Given a signed-in admin on ${path}, then it has no top bar and shows its title once`, async ({
      authenticatedPage,
    }) => {
      const header = new PageHeaderComponent(authenticatedPage);
      await header.open(path);
      await header.expectNoTopBar();
      await header.expectSingleHeading(title);
    });
  }
});
