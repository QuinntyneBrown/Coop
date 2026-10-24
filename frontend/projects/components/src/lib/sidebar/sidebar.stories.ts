import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AvatarComponent } from '../avatar/avatar.component';
import { IconComponent } from '../icon/icon.component';
import { LogoMarkComponent } from '../logo-mark/logo-mark.component';
import { NavLinkComponent } from '../nav-link/nav-link.component';
import { SidebarComponent } from './sidebar.component';
import { SidebarBrandComponent } from './sidebar-brand.component';
import { SidebarFooterComponent } from './sidebar-footer.component';
import { SidebarGroupComponent } from './sidebar-group.component';
import { SidebarNavComponent } from './sidebar-nav.component';
import { SidebarUserComponent } from './sidebar-user.component';
import { SidebarUserNameComponent } from './sidebar-user-name.component';
import { SidebarUserRoleComponent } from './sidebar-user-role.component';

// The office's sections, grouped as the sidebar always shows them (L2-REQ-118 AC1).
const groups: [heading: string | null, sections: [label: string, icon: string][]][] = [
  [
    null,
    [
      ['Dashboard', 'dashboard'],
      ['Website', 'website'],
    ],
  ],
  [
    'Community',
    [
      ['Documents', 'documents'],
      ['Messages', 'messages'],
      ['Profiles', 'profiles'],
    ],
  ],
  ['Operations', [['Maintenance', 'maintenance']]],
  [
    'Access',
    [
      ['Users', 'users'],
      ['Roles and privileges', 'roles'],
      ['Invitations', 'invitations'],
    ],
  ],
  [null, [['Settings', 'settings']]],
];

// The group headings and section links, with `current` marked as the page you are on.
const navLinks = (current?: string) =>
  groups
    .flatMap(([heading, sections]) => [
      ...(heading ? [`<span libSidebarGroup aria-hidden="true">${heading}</span>`] : []),
      ...sections.map(
        ([label, icon]) =>
          `<a libNavLink href="#${icon}"${icon === current ? ' aria-current="page"' : ''}><svg libIcon="${icon}"></svg>${label}</a>`,
      ),
    ])
    .join('\n          ');

const sidebar = (current: string | undefined, name: string, role: string, style = '') => `
      <aside libSidebar aria-label="Admin"${style ? ` style="${style}"` : ''}>
        <a libSidebarBrand href="#dashboard"><span libLogoMark></span>OWN Housing Co-op</a>
        <nav libSidebarNav aria-label="Admin sections">
          ${navLinks(current)}
        </nav>
        <div libSidebarFooter>
          <span libAvatar size="sm" aria-hidden="true">${name.charAt(0)}</span>
          <div libSidebarUser>
            <span libSidebarUserName>${name}</span>
            <span libSidebarUserRole>${role}</span>
          </div>
        </div>
      </aside>`;

// The sidebar shows only inside an `.app-shell` and only from 768px; on a phone it is hidden
// and the tab bar navigates instead, so these stories are blank below that width.
const meta: Meta<SidebarComponent> = {
  title: 'Navigation/Sidebar',
  component: SidebarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SidebarBrandComponent,
        SidebarNavComponent,
        SidebarFooterComponent,
        SidebarGroupComponent,
        SidebarUserComponent,
        SidebarUserNameComponent,
        SidebarUserRoleComponent,
        NavLinkComponent,
        LogoMarkComponent,
        AvatarComponent,
        IconComponent,
      ],
    }),
  ],
  parameters: { layout: 'fullscreen' },
  render: () => ({
    template: `
      <div class="app-shell">${sidebar('maintenance', 'Mira Fern', 'System administrator')}
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<SidebarComponent>;

export const Default: Story = {};

export const NoCurrentLink: Story = {
  render: () => ({
    template: `
      <div class="app-shell">${sidebar(undefined, 'Mira Fern', 'System administrator')}
      </div>`,
  }),
};

export const LongName: Story = {
  render: () => ({
    template: `
      <div class="app-shell">${sidebar(
        'documents',
        'Rosalind Hawthorne-Pemberley',
        'Board member, Maintenance coordinator',
      )}
      </div>`,
  }),
};

export const TintedBackground: Story = {
  render: () => ({
    template: `
      <div class="app-shell">${sidebar(
        'dashboard',
        'Mira Fern',
        'System administrator',
        '--sidebar-bg: var(--color-bg-surface-sunken)',
      )}
      </div>`,
  }),
};

export const InAppShell: Story = {
  render: () => ({
    template: `
      <div class="app-shell" style="display: flex">${sidebar('dashboard', 'Mira Fern', 'System administrator')}
        <main style="flex: 1; min-width: 0; padding: var(--space-6) var(--layout-margin)">
          <div class="stack">
            <p style="font: var(--text-body-sm); color: var(--color-fg-muted)">Here's your overview</p>
            <p style="font: var(--text-h2)">Hello, Mira</p>
            <p style="font: var(--text-h4)">Recent maintenance requests</p>
            <p>Kitchen tap leak · Hallway light · Courtyard gate</p>
          </div>
        </main>
      </div>`,
  }),
};
