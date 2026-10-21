import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { CardTitleComponent } from '../card/card-title.component';
import { IconComponent } from '../icon/icon.component';
import { EmptyStateComponent } from './empty-state.component';
import { EmptyStateActionsComponent } from './empty-state-actions.component';
import { EmptyStateIconComponent } from './empty-state-icon.component';
import { EmptyStateTextComponent } from './empty-state-text.component';
import { EmptyStateTitleComponent } from './empty-state-title.component';

const meta: Meta<EmptyStateComponent> = {
  title: 'Feedback/Empty state',
  component: EmptyStateComponent,
  decorators: [
    moduleMetadata({
      imports: [
        EmptyStateIconComponent,
        EmptyStateTitleComponent,
        EmptyStateTextComponent,
        EmptyStateActionsComponent,
        ButtonComponent,
        CardComponent,
        CardTitleComponent,
        IconComponent,
      ],
    }),
  ],
  argTypes: {},
  render: (args) => ({
    props: args,
    template: `
      <div libCard>
        <div libEmptyState>
          <div libEmptyStateIcon aria-hidden="true"><svg libIcon="documents" size="lg"></svg></div>
          <h2 libEmptyStateTitle>No documents yet</h2>
          <p libEmptyStateText>Add the bylaws, meeting notes and notices that members should be able to read.</p>
          <div libEmptyStateActions>
            <button libButton type="button" variant="primary"><svg libIcon="add"></svg>New document</button>
          </div>
        </div>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<EmptyStateComponent>;

export const FirstUse: Story = {};

export const NoResults: Story = {
  render: () => ({
    template: `
      <div libCard>
        <div libEmptyState>
          <div libEmptyStateIcon aria-hidden="true"><svg libIcon="search" size="lg"></svg></div>
          <h2 libEmptyStateTitle>No users match “tavi.m”</h2>
          <p libEmptyStateText>Check the spelling, or clear the search to see everyone.</p>
          <div libEmptyStateActions>
            <button libButton type="button">Clear search</button>
          </div>
        </div>
      </div>`,
  }),
};

export const NothingSelected: Story = {
  render: () => ({
    template: `
      <div libCard>
        <div libEmptyState style="padding: var(--space-6) var(--space-4)">
          <div libEmptyStateIcon aria-hidden="true"><svg libIcon="messages" size="lg"></svg></div>
          <h2 libEmptyStateTitle>Choose a conversation</h2>
          <p libEmptyStateText>Pick one from the list to read it, or start a new one.</p>
          <div libEmptyStateActions>
            <button libButton type="button"><svg libIcon="add"></svg>New conversation</button>
          </div>
        </div>
      </div>`,
  }),
};

export const WithoutAction: Story = {
  render: () => ({
    template: `
      <div libCard>
        <div libEmptyState>
          <div libEmptyStateIcon aria-hidden="true"><svg libIcon="inbox" size="lg"></svg></div>
          <h2 libEmptyStateTitle>No maintenance requests</h2>
          <p libEmptyStateText>When a member reports a problem, such as a kitchen tap leak, it appears here.</p>
        </div>
      </div>`,
  }),
};

export const CompactInCard: Story = {
  render: () => ({
    template: `
      <div libCard>
        <h2 libCardTitle>Recent requests</h2>
        <div libEmptyState style="padding: var(--space-6) var(--space-4)">
          <p libEmptyStateText style="margin: 0">No recent requests.</p>
        </div>
      </div>`,
  }),
};

export const ActionFocus: Story = {
  render: () => ({
    template: `
      <div libCard>
        <div libEmptyState>
          <div libEmptyStateIcon aria-hidden="true"><svg libIcon="search" size="lg"></svg></div>
          <h2 libEmptyStateTitle>No files match “minutes”</h2>
          <div libEmptyStateActions>
            <button libButton type="button">Clear search</button>
          </div>
        </div>
      </div>`,
  }),
  play: async ({ canvasElement }) => canvasElement.querySelector('button')?.focus(),
};
