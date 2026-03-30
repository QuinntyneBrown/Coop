import { type Locator, type Page, expect } from '@playwright/test';

export class SidebarComponent {
  readonly page: Page;

  // Branding
  readonly sidebar: Locator;
  readonly logo: Locator;
  readonly appTitle: Locator;

  // Navigation links
  readonly dashboardLink: Locator;
  readonly maintenanceLink: Locator;
  readonly documentsLink: Locator;
  readonly messagesLink: Locator;
  readonly usersLink: Locator;
  readonly rolesLink: Locator;
  readonly profilesLink: Locator;
  readonly assetsLink: Locator;
  readonly invitationsLink: Locator;
  readonly settingsLink: Locator;

  // User info at bottom
  readonly userInfo: Locator;
  readonly userAvatar: Locator;
  readonly userName: Locator;
  readonly userRole: Locator;

  constructor(page: Page) {
    this.page = page;

    this.sidebar = page.getByTestId('sidebar');
    this.logo = page.getByTestId('sidebar-logo');
    this.appTitle = page.getByTestId('sidebar-app-title');

    this.dashboardLink = page.getByTestId('sidebar-nav-dashboard');
    this.maintenanceLink = page.getByTestId('sidebar-nav-maintenance');
    this.documentsLink = page.getByTestId('sidebar-nav-documents');
    this.messagesLink = page.getByTestId('sidebar-nav-messages');
    this.usersLink = page.getByTestId('sidebar-nav-users');
    this.rolesLink = page.getByTestId('sidebar-nav-roles');
    this.profilesLink = page.getByTestId('sidebar-nav-profiles');
    this.assetsLink = page.getByTestId('sidebar-nav-assets');
    this.invitationsLink = page.getByTestId('sidebar-nav-invitations');
    this.settingsLink = page.getByTestId('sidebar-nav-settings');

    this.userInfo = page.getByTestId('sidebar-user-info');
    this.userAvatar = page.getByTestId('sidebar-user-avatar');
    this.userName = page.getByTestId('sidebar-user-name');
    this.userRole = page.getByTestId('sidebar-user-role');
  }

  async expectVisible() {
    await expect(this.sidebar).toBeVisible();
    await expect(this.appTitle).toHaveText('Coop Manager');
  }

  async expectUserInfo(name: string, role: string) {
    await expect(this.userInfo).toBeVisible();
    await expect(this.userName).toHaveText(name);
    await expect(this.userRole).toHaveText(role);
  }

  async navigateTo(
    section:
      | 'dashboard'
      | 'maintenance'
      | 'documents'
      | 'messages'
      | 'users'
      | 'roles'
      | 'profiles'
      | 'assets'
      | 'invitations'
      | 'settings',
  ) {
    const linkMap: Record<string, Locator> = {
      dashboard: this.dashboardLink,
      maintenance: this.maintenanceLink,
      documents: this.documentsLink,
      messages: this.messagesLink,
      users: this.usersLink,
      roles: this.rolesLink,
      profiles: this.profilesLink,
      assets: this.assetsLink,
      invitations: this.invitationsLink,
      settings: this.settingsLink,
    };
    await linkMap[section].click();
  }

  async expectActiveLink(section: string) {
    const link = this.page.getByTestId(`sidebar-nav-${section}`);
    await expect(link).toHaveAttribute('data-active', 'true');
  }
}
