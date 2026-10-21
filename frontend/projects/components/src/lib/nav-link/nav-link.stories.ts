import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { IconComponent } from '../icon/icon.component';
import { SidebarNavComponent } from '../sidebar/sidebar-nav.component';
import { NavLinkComponent } from './nav-link.component';

const meta: Meta<NavLinkComponent> = {
  title: 'Navigation/Nav link',
  component: NavLinkComponent,
  decorators: [moduleMetadata({ imports: [IconComponent, SidebarNavComponent] })],
  render: () => ({
    template: `<a libNavLink href="#">Documents</a>`,
  }),
};

export default meta;
type Story = StoryObj<NavLinkComponent>;

export const Default: Story = {};

export const CurrentPage: Story = {
  render: () => ({
    template: `<a libNavLink href="#" aria-current="page">Documents</a>`,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    template: `<a libNavLink href="#"><svg libIcon="maintenance"></svg>Maintenance</a>`,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div class="cluster">
        <a libNavLink href="#"><svg libIcon="documents"></svg>Documents</a>
        <a libNavLink href="#" aria-current="page"><svg libIcon="documents"></svg>Documents</a>
      </div>`,
  }),
};

export const InSidebarNav: Story = {
  render: () => ({
    template: `
      <nav libSidebarNav aria-label="Admin sections" style="max-width: 16rem">
        <a libNavLink href="#" aria-current="page"><svg libIcon="dashboard"></svg>Dashboard</a>
        <a libNavLink href="#"><svg libIcon="maintenance"></svg>Maintenance</a>
        <a libNavLink href="#"><svg libIcon="documents"></svg>Documents</a>
        <a libNavLink href="#"><svg libIcon="pages"></svg>Pages</a>
        <a libNavLink href="#"><svg libIcon="board"></svg>Board</a>
        <a libNavLink href="#"><svg libIcon="messages"></svg>Messages</a>
        <a libNavLink href="#"><svg libIcon="settings"></svg>Settings</a>
      </nav>`,
  }),
};
