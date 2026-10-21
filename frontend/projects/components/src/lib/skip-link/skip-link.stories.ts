import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { IconComponent } from '../icon/icon.component';
import { LogoMarkComponent } from '../logo-mark/logo-mark.component';
import { NavLinkComponent } from '../nav-link/nav-link.component';
import { SidebarBrandComponent } from '../sidebar/sidebar-brand.component';
import { SidebarNavComponent } from '../sidebar/sidebar-nav.component';
import { SkipLinkComponent } from './skip-link.component';

const meta: Meta<SkipLinkComponent> = {
  title: 'Navigation/Skip link',
  component: SkipLinkComponent,
  decorators: [
    moduleMetadata({
      imports: [
        IconComponent,
        LogoMarkComponent,
        NavLinkComponent,
        SidebarBrandComponent,
        SidebarNavComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <div class="stack" style="position: relative; overflow: hidden; min-height: var(--space-16)">
        <a libSkipLink href="#skip-link-default-main">Skip to content</a>
        <main id="skip-link-default-main">
          <p>Press Tab to show the link. It stays out of sight until it has focus.</p>
        </main>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<SkipLinkComponent>;

export const Default: Story = {};

export const Focused: Story = {
  render: () => ({
    template: `
      <div class="stack" style="position: relative; overflow: hidden; min-height: var(--space-16)">
        <a libSkipLink href="#skip-link-focused-main">Skip to content</a>
        <main id="skip-link-focused-main"><p>Book the common room for Thursday afternoon.</p></main>
      </div>`,
  }),
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLAnchorElement>('a.skip-link')?.focus();
  },
};

export const BeforeTheSidebar: Story = {
  render: () => ({
    template: `
      <div class="stack" style="position: relative; overflow: hidden">
        <a libSkipLink href="#skip-link-sidebar-main">Skip to content</a>
        <a libSidebarBrand href="#dashboard"><span libLogoMark></span>OWN Housing Co-op</a>
        <nav libSidebarNav aria-label="Admin sections" style="max-width: 16rem">
          <a libNavLink href="#dashboard"><svg libIcon="dashboard"></svg>Dashboard</a>
          <a libNavLink href="#maintenance"><svg libIcon="maintenance"></svg>Maintenance</a>
          <a libNavLink href="#documents"><svg libIcon="documents"></svg>Documents</a>
        </nav>
        <main id="skip-link-sidebar-main">
          <p>Maintenance request sent. We will be in touch soon.</p>
        </main>
      </div>`,
  }),
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLAnchorElement>('a.skip-link')?.focus();
  },
};
