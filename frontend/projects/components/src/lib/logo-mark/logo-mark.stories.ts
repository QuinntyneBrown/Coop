import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CardComponent } from '../card/card.component';
import { SidebarBrandComponent } from '../sidebar/sidebar-brand.component';
import { TopBarBrandComponent } from '../top-bar/top-bar-brand.component';
import { LogoMarkComponent } from './logo-mark.component';

const meta: Meta<LogoMarkComponent> = {
  title: 'Data display/Logo mark',
  component: LogoMarkComponent,
  decorators: [
    moduleMetadata({ imports: [SidebarBrandComponent, TopBarBrandComponent, CardComponent] }),
  ],
  // The logo mark has no inputs. It is decoration; the co-op's name beside it is the text.
  argTypes: {},
  render: () => ({
    template: `<span libLogoMark></span>`,
  }),
};

export default meta;
type Story = StoryObj<LogoMarkComponent>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="cluster">
        <a libSidebarBrand href="#"><span libLogoMark></span>OWN Housing Co-op</a>
        <span libLogoMark></span>
      </div>`,
  }),
};

export const SidebarBrand: Story = {
  render: () => ({
    template: `<a libSidebarBrand href="#"><span libLogoMark></span>OWN Housing Co-op</a>`,
  }),
};

export const TopBarBrand: Story = {
  render: () => ({
    template: `<span libTopBarBrand><span libLogoMark></span>OWN Housing Co-op</span>`,
  }),
};

export const SignInTile: Story = {
  render: () => ({
    template: `
      <div libCard class="auth-card">
        <div class="logo" aria-hidden="true">
          <span libLogoMark></span>
        </div>
        <p class="text-caption" style="text-align: center">OWN Housing Co-op</p>
        <p style="font: var(--text-h3); text-align: center; margin-top: var(--space-2)">
          Welcome back
        </p>
        <p class="text-muted" style="text-align: center; margin-inline: auto">
          Sign in to your account to continue.
        </p>
      </div>`,
  }),
};
