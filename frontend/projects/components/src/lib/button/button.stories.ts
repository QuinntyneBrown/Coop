import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Actions/Button',
  component: ButtonComponent,
  decorators: [moduleMetadata({ imports: [IconComponent] })],
  argTypes: {
    variant: { control: 'inline-radio', options: ['secondary', 'primary', 'danger', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    block: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
  args: { variant: 'secondary', size: 'md', block: false, iconOnly: false },
  render: (args) => ({
    props: args,
    template: `<button libButton type="button" [variant]="variant" [size]="size" [block]="block" [iconOnly]="iconOnly">Save page</button>`,
  }),
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Secondary: Story = {};

export const Primary: Story = { args: { variant: 'primary' } };

export const Ghost: Story = { args: { variant: 'ghost' } };

export const Danger: Story = {
  args: { variant: 'danger' },
  render: (args) => ({
    props: args,
    template: `<button libButton type="button" [variant]="variant" [size]="size">Remove page</button>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="cluster">
        <button libButton type="button" size="sm">Change avatar</button>
        <button libButton type="button" variant="primary">Save changes</button>
        <button libButton type="button" variant="primary" size="lg">Sign in</button>
      </div>`,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    template: `
      <div class="cluster">
        <button libButton type="button" variant="primary"><svg libIcon="add"></svg>Add director</button>
        <button libButton type="button"><svg libIcon="photo"></svg>Choose photo</button>
      </div>`,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    template: `<button libButton type="button" iconOnly aria-label="Edit Our garden"><svg libIcon="edit"></svg></button>`,
  }),
};

export const Block: Story = {
  render: () => ({
    template: `
      <div style="max-width: 20rem">
        <button libButton type="button" variant="primary" size="lg" block>Sign in</button>
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="cluster">
        <button libButton type="button" variant="primary" disabled>Save page</button>
        <button libButton type="button" disabled>Cancel</button>
      </div>`,
  }),
};

export const Busy: Story = {
  render: () => ({
    template: `<button libButton type="button" variant="primary" disabled aria-busy="true">Save director</button>`,
  }),
};

export const AsLink: Story = {
  render: () => ({
    template: `<a libButton href="#">Cancel</a>`,
  }),
};
