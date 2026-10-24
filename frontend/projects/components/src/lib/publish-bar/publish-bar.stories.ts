import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { PublishBarActionsComponent } from './publish-bar-actions.component';
import { PublishBarTextComponent } from './publish-bar-text.component';
import { PublishBarComponent } from './publish-bar.component';

const meta: Meta<PublishBarComponent> = {
  title: 'Feedback/Publish bar',
  component: PublishBarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        PublishBarTextComponent,
        PublishBarActionsComponent,
        ButtonComponent,
        IconComponent,
      ],
    }),
  ],
  argTypes: { changes: { control: 'boolean' } },
  args: { changes: false },
  render: (args) => ({
    props: args,
    template: `
      <div libPublishBar [changes]="changes" role="status">
        <p libPublishBarText>
          <svg [libIcon]="changes ? 'warning' : 'success'"></svg>
          <span>{{ changes ? 'You have unpublished changes. Visitors still see the published website.' : 'Everything is published. Visitors see what you see.' }}</span>
        </p>
        <div libPublishBarActions>
          <a libButton href="#" target="_blank" rel="noopener"><svg libIcon="open-in-new"></svg>Preview site<span class="visually-hidden"> (opens in a new tab)</span></a>
          <button libButton variant="primary" type="button" [disabled]="!changes"><svg libIcon="publish"></svg>Publish</button>
          <button libButton variant="ghost" type="button" [disabled]="!changes"><svg libIcon="discard"></svg>Discard changes</button>
        </div>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<PublishBarComponent>;

export const Published: Story = {};

export const UnpublishedChanges: Story = { args: { changes: true } };

export const Publishing: Story = {
  args: { changes: true },
  render: (args) => ({
    props: args,
    template: `
      <div libPublishBar changes role="status">
        <p libPublishBarText><svg libIcon="warning"></svg><span>You have unpublished changes. Visitors still see the published website.</span></p>
        <div libPublishBarActions>
          <a libButton href="#" target="_blank" rel="noopener"><svg libIcon="open-in-new"></svg>Preview site<span class="visually-hidden"> (opens in a new tab)</span></a>
          <button libButton variant="primary" type="button" disabled aria-busy="true"><svg libIcon="publish"></svg>Publishing…</button>
          <button libButton variant="ghost" type="button"><svg libIcon="discard"></svg>Discard changes</button>
        </div>
      </div>`,
  }),
};
