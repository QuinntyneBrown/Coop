import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { CardTitleComponent } from '../card/card-title.component';
import { DescriptionListComponent } from '../description-list/description-list.component';
import { DividerComponent } from './divider.component';

const meta: Meta<DividerComponent> = {
  title: 'Containers and overlays/Divider',
  component: DividerComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonComponent, CardComponent, CardTitleComponent, DescriptionListComponent],
    }),
  ],
  argTypes: {},
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 32rem">
        <p>The common room is open every weekday from 9 am to 9 pm.</p>
        <hr libDivider />
        <p>Please book it at the front desk a day ahead.</p>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<DividerComponent>;

export const Rule: Story = {};

export const InACard: Story = {
  render: () => ({
    template: `
      <article libCard class="stack" style="max-width: 36rem">
        <h2 libCardTitle>Kitchen tap leak</h2>
        <dl libDescriptionList horizontal>
          <dt>Submitted by</dt>
          <dd>Mira Fern</dd>
          <dt>Priority</dt>
          <dd>High</dd>
        </dl>
        <p>The kitchen tap drips after it is closed.</p>
        <hr libDivider />
        <h3>Photos</h3>
        <p class="text-muted">No photos attached</p>
        <div class="cluster">
          <button libButton type="button" variant="primary">Receive request</button>
          <button libButton type="button">Edit description</button>
        </div>
      </article>`,
  }),
};
