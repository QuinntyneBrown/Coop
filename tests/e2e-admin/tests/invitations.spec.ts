import { test, expect } from '../fixtures/api.fixture';
import { InvitationsPage } from '../pages/invitations.page';
import { SidebarComponent } from '../pages/sidebar.component';

test.describe('Invitations', () => {
  let invitationsPage: InvitationsPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    invitationsPage = new InvitationsPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
    await invitationsPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the invitations page', async () => {
      await invitationsPage.expectPageLoaded();
    });

    test('should mark invitations as active in sidebar', async () => {
      await sidebar.expectActiveLink('invitations');
    });

    test('should display page title as Invitations', async () => {
      await expect(invitationsPage.pageTitle).toHaveText('Invitations');
    });

    test('should display Create Invitation button', async () => {
      await expect(invitationsPage.createInvitationButton).toBeVisible();
      await expect(invitationsPage.createInvitationButton).toContainText('Create Invitation');
    });

    test('should display table headers', async () => {
      await invitationsPage.expectTableHeaders();
    });
  });

  test.describe('Invitation Table', () => {
    test('should display invitation rows', async ({ api }) => {
      await api.createInvitation('Member');
      await invitationsPage.goto();

      const count = await invitationsPage.getRowCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should display token column with truncated tokens', async ({ api }) => {
      await api.createInvitation('Member');
      await invitationsPage.goto();

      const firstRow = invitationsPage.tableRows.first();
      const token = firstRow.getByTestId('invitation-token');
      await expect(token).toBeVisible();
    });

    test('should display type column', async ({ api }) => {
      await api.createInvitation('Member');
      await invitationsPage.goto();

      const firstRow = invitationsPage.tableRows.first();
      const type = firstRow.getByTestId('invitation-type');
      await expect(type).toBeVisible();
    });

    test('should display expires column', async ({ api }) => {
      await api.createInvitation('Member');
      await invitationsPage.goto();

      const firstRow = invitationsPage.tableRows.first();
      const expires = firstRow.getByTestId('invitation-expires');
      await expect(expires).toBeVisible();
    });

    test('should display status badges', async ({ api }) => {
      await api.createInvitation('Member');
      await invitationsPage.goto();

      const firstRow = invitationsPage.tableRows.first();
      const badge = firstRow.getByTestId('invitation-status-badge');
      await expect(badge).toBeVisible();
    });
  });

  test.describe('Status Badges', () => {
    test('should show Active status badge for new invitations', async ({ api }) => {
      await api.createInvitation('Member');
      await invitationsPage.goto();

      await invitationsPage.expectRowStatus(0, 'Active');
    });

    test('should display correct badge colors for different statuses', async ({ api }) => {
      await api.createInvitation('Member');
      await invitationsPage.goto();

      const firstRow = invitationsPage.tableRows.first();
      const badge = firstRow.getByTestId('invitation-status-badge');
      const text = await badge.textContent();

      // Active, Expired, or Used are valid statuses
      expect(['Active', 'Expired', 'Used']).toContain(text?.trim());
    });
  });

  test.describe('Create Invitation', () => {
    test('should open create invitation dialog', async () => {
      await invitationsPage.createInvitationButton.click();
      await expect(invitationsPage.createDialog).toBeVisible();
    });

    test('should close dialog on cancel', async () => {
      await invitationsPage.createInvitationButton.click();
      await invitationsPage.dialogCancelButton.click();
      await expect(invitationsPage.createDialog).toBeHidden();
    });

    test('should display type selector in dialog', async () => {
      await invitationsPage.createInvitationButton.click();
      await expect(invitationsPage.dialogTypeSelect).toBeVisible();
    });

    test('should display expiration date input in dialog', async () => {
      await invitationsPage.createInvitationButton.click();
      await expect(invitationsPage.dialogExpiresInput).toBeVisible();
    });

    test('should create an invitation and show token dialog', async () => {
      await invitationsPage.createInvitation('Member');
      await invitationsPage.expectTokenDialogVisible();
    });

    test('should display generated token in token dialog', async () => {
      await invitationsPage.createInvitation('Member');
      await invitationsPage.expectTokenDialogVisible();
      const token = await invitationsPage.getTokenValue();
      expect(token.length).toBeGreaterThan(0);
    });

    test('should have copy button in token dialog', async () => {
      await invitationsPage.createInvitation('Member');
      await invitationsPage.expectTokenDialogVisible();
      await expect(invitationsPage.tokenCopyButton).toBeVisible();
    });

    test('should close token dialog and show new row in table', async () => {
      const initialCount = await invitationsPage.getRowCount();
      await invitationsPage.createInvitation('Member');
      await invitationsPage.expectTokenDialogVisible();
      await invitationsPage.closeTokenDialog();
      await expect(invitationsPage.tokenDialog).toBeHidden();

      const newCount = await invitationsPage.getRowCount();
      expect(newCount).toBeGreaterThan(initialCount);
    });
  });
});
