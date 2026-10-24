import { type Meta, type StoryObj } from '@storybook/angular';
import { BreadcrumbComponent } from './breadcrumb.component';

const meta: Meta<BreadcrumbComponent> = {
  title: 'Navigation/Breadcrumb',
  component: BreadcrumbComponent,
  render: () => ({
    template: `
      <nav aria-label="Breadcrumb">
        <ol libBreadcrumb>
          <li><a href="#website">Website</a></li>
          <li aria-current="page">Home</li>
        </ol>
      </nav>`,
  }),
};

export default meta;
type Story = StoryObj<BreadcrumbComponent>;

export const Default: Story = {};

export const ThreeItems: Story = {
  render: () => ({
    template: `
      <nav aria-label="Breadcrumb">
        <ol libBreadcrumb>
          <li><a href="#website">Website</a></li>
          <li><a href="#pages">Pages</a></li>
          <li aria-current="page">How to apply</li>
        </ol>
      </nav>`,
  }),
};
