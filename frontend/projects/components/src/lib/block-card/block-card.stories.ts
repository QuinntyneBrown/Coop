import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { IconComponent } from '../icon/icon.component';
import { BlockCardKindComponent } from './block-card-kind.component';
import { BlockCardPreviewComponent } from './block-card-preview.component';
import { BlockCardComponent } from './block-card.component';

const meta: Meta<BlockCardComponent> = {
  title: 'Layout/Block card',
  component: BlockCardComponent,
  decorators: [
    moduleMetadata({ imports: [BlockCardKindComponent, BlockCardPreviewComponent, IconComponent] }),
  ],
  render: () => ({
    template: `
      <article libBlockCard>
        <span libBlockCardKind><svg libIcon="paragraph" size="sm"></svg>Paragraph</span>
        <p libBlockCardPreview>Send the form to the office, then come for a visit and a cup of tea.</p>
      </article>`,
  }),
};

export default meta;
type Story = StoryObj<BlockCardComponent>;

export const Paragraph: Story = {};

export const Heading: Story = {
  render: () => ({
    template: `
      <article libBlockCard>
        <span libBlockCardKind><svg libIcon="heading" size="sm"></svg>Heading</span>
        <p libBlockCardPreview>Who can apply</p>
      </article>`,
  }),
};
