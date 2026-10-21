import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { IconComponent } from '../icon/icon.component';
import { TabBarComponent } from './tab-bar.component';

// The bar is fixed to the bottom of the screen. The frame's transform makes it the bar's
// containing block, so each story shows its bar in place instead of over the docs page.
const frame = (bar: string) => `
  <div style="position: relative; transform: translateZ(0); min-height: 6rem; max-width: 30rem">
    ${bar}
  </div>`;

const meta: Meta<TabBarComponent> = {
  title: 'Navigation/Tab bar',
  component: TabBarComponent,
  decorators: [moduleMetadata({ imports: [IconComponent] })],
  render: () => ({
    template: frame(`
      <nav libTabBar class="tabbar--static" aria-label="Admin sections, phone">
        <a href="#dashboard" aria-current="page"><svg libIcon="home"></svg>Home</a>
        <a href="#maintenance"><svg libIcon="maintenance"></svg>Requests</a>
        <a href="#documents"><svg libIcon="documents"></svg>Documents</a>
        <a href="#messaging"><svg libIcon="messages"></svg>Messages</a>
        <a href="#profile"><svg libIcon="profile"></svg>Profile</a>
      </nav>`),
  }),
};

export default meta;
type Story = StoryObj<TabBarComponent>;

export const Default: Story = {};

export const RequestsCurrent: Story = {
  render: () => ({
    template: frame(`
      <nav libTabBar class="tabbar--static" aria-label="Admin sections, phone">
        <a href="#dashboard"><svg libIcon="home"></svg>Home</a>
        <a href="#maintenance" aria-current="page"><svg libIcon="maintenance"></svg>Requests</a>
        <a href="#documents"><svg libIcon="documents"></svg>Documents</a>
        <a href="#messaging"><svg libIcon="messages"></svg>Messages</a>
        <a href="#profile"><svg libIcon="profile"></svg>Profile</a>
      </nav>`),
  }),
};

export const MessagesCurrent: Story = {
  render: () => ({
    template: frame(`
      <nav libTabBar class="tabbar--static" aria-label="Admin sections, phone">
        <a href="#dashboard"><svg libIcon="home"></svg>Home</a>
        <a href="#maintenance"><svg libIcon="maintenance"></svg>Requests</a>
        <a href="#documents"><svg libIcon="documents"></svg>Documents</a>
        <a href="#messaging" aria-current="page"><svg libIcon="messages"></svg>Messages</a>
        <a href="#profile"><svg libIcon="profile"></svg>Profile</a>
      </nav>`),
  }),
};

export const NoCurrentTab: Story = {
  render: () => ({
    template: frame(`
      <nav libTabBar class="tabbar--static" aria-label="Admin sections, phone">
        <a href="#dashboard"><svg libIcon="home"></svg>Home</a>
        <a href="#maintenance"><svg libIcon="maintenance"></svg>Requests</a>
        <a href="#documents"><svg libIcon="documents"></svg>Documents</a>
        <a href="#messaging"><svg libIcon="messages"></svg>Messages</a>
        <a href="#profile"><svg libIcon="profile"></svg>Profile</a>
      </nav>`),
  }),
};

// Without .tabbar--static the bar shows only below 768px, as in the admin.
export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          'The bar as the admin draws it: shown below 768px and hidden from there up, where the sidebar takes over. On a wide docs page this box is empty; open the story to see it at 320px.',
      },
    },
  },
  render: () => ({
    template: frame(`
      <nav libTabBar aria-label="Admin sections, phone">
        <a href="#dashboard" aria-current="page"><svg libIcon="home"></svg>Home</a>
        <a href="#maintenance"><svg libIcon="maintenance"></svg>Requests</a>
        <a href="#documents"><svg libIcon="documents"></svg>Documents</a>
        <a href="#messaging"><svg libIcon="messages"></svg>Messages</a>
        <a href="#profile"><svg libIcon="profile"></svg>Profile</a>
      </nav>`),
  }),
};
