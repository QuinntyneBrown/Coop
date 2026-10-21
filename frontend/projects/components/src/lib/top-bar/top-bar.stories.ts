import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AvatarComponent } from '../avatar/avatar.component';
import { LogoMarkComponent } from '../logo-mark/logo-mark.component';
import { TopBarComponent } from './top-bar.component';
import { TopBarBrandComponent } from './top-bar-brand.component';
import { TopBarSpacerComponent } from './top-bar-spacer.component';

const meta: Meta<TopBarComponent> = {
  title: 'Navigation/Top bar',
  component: TopBarComponent,
  decorators: [
    moduleMetadata({
      imports: [TopBarBrandComponent, TopBarSpacerComponent, LogoMarkComponent, AvatarComponent],
    }),
  ],
  // The top bar and its parts have no inputs; their content is projected.
  argTypes: {},
  render: () => ({
    template: `
      <header libTopBar>
        <span libTopBarBrand><span libLogoMark></span>OWN Housing Co-op</span>
        <span libTopBarSpacer></span>
        <a href="#" aria-label="My profile, mira.fern" style="display: inline-flex; text-decoration: none">
          <span libAvatar size="sm" aria-hidden="true">M</span>
        </a>
      </header>`,
  }),
};

export default meta;
type Story = StoryObj<TopBarComponent>;

export const Default: Story = {};

export const OnMyProfile: Story = {
  render: () => ({
    template: `
      <header libTopBar>
        <span libTopBarBrand><span libLogoMark></span>OWN Housing Co-op</span>
        <span libTopBarSpacer></span>
        <a href="#" aria-label="My profile, mira.fern" aria-current="page" style="display: inline-flex; text-decoration: none">
          <span libAvatar size="sm" aria-hidden="true">M</span>
        </a>
      </header>`,
  }),
};

export const LongCoopName: Story = {
  render: () => ({
    template: `
      <header libTopBar>
        <span libTopBarBrand><span libLogoMark></span>Willow Grove Women's Housing Co-operative</span>
        <span libTopBarSpacer></span>
        <a href="#" aria-label="My profile, rose.hollis" style="display: inline-flex; text-decoration: none">
          <span libAvatar size="sm" aria-hidden="true">R</span>
        </a>
      </header>`,
  }),
};

export const OverPageContent: Story = {
  render: () => ({
    template: `
      <header libTopBar>
        <span libTopBarBrand><span libLogoMark></span>OWN Housing Co-op</span>
        <span libTopBarSpacer></span>
        <a href="#" aria-label="My profile, mira.fern" style="display: inline-flex; text-decoration: none">
          <span libAvatar size="sm" aria-hidden="true">M</span>
        </a>
      </header>
      <main class="stack" style="max-width: 40rem; margin: 0 auto; padding: var(--space-4)">
        <h1>Maintenance</h1>
        <p>Here is what members have asked us to fix this month.</p>
        <p>Leaky tap in the common room kitchen. Reported by Ada Birch on Tuesday morning.</p>
        <p>Hallway light out on the second floor. Reported by June Calder on Monday evening.</p>
        <p>Garden gate sticks when it rains. Reported by Nell Okafor last week.</p>
        <p>Laundry room dryer is slow to heat. Reported by Iris Pemberton last week.</p>
        <p>Front door buzzer is hard to hear. Reported by Lena Marsh two weeks ago.</p>
      </main>`,
  }),
};
