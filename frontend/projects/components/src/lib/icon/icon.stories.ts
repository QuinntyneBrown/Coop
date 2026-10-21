import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { InlineStatusComponent } from '../inline-message/inline-status.component';
import { IconComponent } from './icon.component';
import { type IconName } from './icon-name';

const iconNames: IconName[] = [
  'add',
  'assets',
  'back',
  'board',
  'camera',
  'chart',
  'check',
  'close',
  'copy',
  'dashboard',
  'delete',
  'documents',
  'download',
  'edit',
  'error',
  'home',
  'inbox',
  'invitations',
  'lock',
  'maintenance',
  'megaphone',
  'messages',
  'more',
  'move-down',
  'move-up',
  'open-in-new',
  'pages',
  'person-add',
  'photo',
  'profile',
  'profiles',
  'roles',
  'scales',
  'search',
  'send',
  'settings',
  'sign-out',
  'success',
  'try-again',
  'upload',
  'users',
  'website',
];

const meta: Meta<IconComponent> = {
  title: 'Foundations/Icon',
  component: IconComponent,
  decorators: [moduleMetadata({ imports: [ButtonComponent, InlineStatusComponent] })],
  argTypes: {
    libIcon: { control: 'select', options: iconNames },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { libIcon: 'maintenance', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<p class="cluster"><svg [libIcon]="libIcon" [size]="size"></svg>Maintenance requests</p>`,
  }),
};

export default meta;
type Story = StoryObj<IconComponent>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="stack">
        <p libInlineStatus><svg libIcon="download" size="sm"></svg>Meeting notes.pdf · 2 KB</p>
        <p class="cluster"><svg libIcon="documents"></svg>Notices and by-laws</p>
        <p class="cluster"><svg libIcon="home" size="lg"></svg>Home</p>
      </div>`,
  }),
};

export const IconSheet: Story = {
  render: () => ({
    props: { iconNames },
    template: `
      <ul class="cluster" style="list-style: none; margin: 0; padding: 0">
        @for (name of iconNames; track name) {
          <li class="cluster" style="min-width: 9rem"><svg [libIcon]="name"></svg>{{ name }}</li>
        }
      </ul>`,
  }),
};

export const InButtons: Story = {
  render: () => ({
    template: `
      <div class="cluster">
        <button libButton type="button" variant="primary"><svg libIcon="add"></svg>New request</button>
        <button libButton type="button" size="sm" aria-label="Edit About us"><svg libIcon="edit"></svg>Edit</button>
        <button libButton type="button" variant="danger" size="sm" aria-label="Remove About us"><svg libIcon="delete"></svg>Remove</button>
      </div>`,
  }),
};

export const IconOnlyButtons: Story = {
  render: () => ({
    template: `
      <div class="cluster">
        <button libButton type="button" variant="ghost" iconOnly aria-label="Edit tavi.moss"><svg libIcon="edit"></svg></button>
        <button libButton type="button" variant="ghost" iconOnly aria-label="Delete tavi.moss"><svg libIcon="delete"></svg></button>
      </div>`,
  }),
};

export const WithStatus: Story = {
  render: () => ({
    template: `<p libInlineStatus role="status"><svg libIcon="success"></svg>Maintenance request sent</p>`,
  }),
};
