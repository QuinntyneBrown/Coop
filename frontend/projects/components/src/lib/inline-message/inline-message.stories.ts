import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CardComponent } from '../card/card.component';
import { CardTitleComponent } from '../card/card-title.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { InlineStatusComponent } from './inline-status.component';

// InlineStatusComponent has no inputs, so there are no controls to bind.
const meta: Meta<InlineStatusComponent> = {
  title: 'Feedback/Inline message',
  component: InlineStatusComponent,
  decorators: [moduleMetadata({ imports: [SpinnerComponent, CardComponent, CardTitleComponent] })],
  render: () => ({
    template: `<p libInlineStatus role="status"><span libSpinner size="sm"></span>Saving…</p>`,
  }),
};

export default meta;
type Story = StoryObj<InlineStatusComponent>;

export const Saving: Story = {};

export const Saved: Story = {
  render: () => ({
    template: `<p libInlineStatus role="status"><span aria-hidden="true">✓</span>Saved just now</p>`,
  }),
};

export const Uploading: Story = {
  render: () => ({
    template: `<p libInlineStatus role="status"><span libSpinner size="sm"></span>Uploading…</p>`,
  }),
};

export const InCardTitleRow: Story = {
  render: () => ({
    template: `
      <section libCard style="max-width: 32rem">
        <div class="cluster cluster--between">
          <h3 libCardTitle style="margin: 0">Autumn courtyard gathering</h3>
          <p libInlineStatus role="status"><span libSpinner size="sm"></span>Saving…</p>
        </div>
      </section>`,
  }),
};

export const SavedInCardTitleRow: Story = {
  render: () => ({
    template: `
      <section libCard style="max-width: 32rem">
        <div class="cluster cluster--between">
          <h3 libCardTitle style="margin: 0">Autumn courtyard gathering</h3>
          <p libInlineStatus role="status"><span aria-hidden="true">✓</span>Saved just now</p>
        </div>
      </section>`,
  }),
};
