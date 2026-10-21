import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AvatarComponent } from '../avatar/avatar.component';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { CardTitleComponent } from '../card/card-title.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { EmptyStateActionsComponent } from '../empty-state/empty-state-actions.component';
import { EmptyStateIconComponent } from '../empty-state/empty-state-icon.component';
import { EmptyStateTextComponent } from '../empty-state/empty-state-text.component';
import { EmptyStateTitleComponent } from '../empty-state/empty-state-title.component';
import { IconComponent } from '../icon/icon.component';
import { LoadingComponent } from '../spinner/loading.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ListComponent } from './list.component';
import { ListBodyComponent } from './list-body.component';
import { ListItemComponent } from './list-item.component';
import { ListMetaComponent } from './list-meta.component';
import { ListTitleComponent } from './list-title.component';

const meta: Meta<ListComponent> = {
  title: 'Data display/List',
  component: ListComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ListItemComponent,
        ListBodyComponent,
        ListTitleComponent,
        ListMetaComponent,
        AvatarComponent,
        BadgeComponent,
        ButtonComponent,
        CardComponent,
        CardTitleComponent,
        EmptyStateComponent,
        EmptyStateActionsComponent,
        EmptyStateIconComponent,
        EmptyStateTextComponent,
        EmptyStateTitleComponent,
        IconComponent,
        LoadingComponent,
        SpinnerComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="list-requests" style="max-width: 32rem">
        <h2 libCardTitle id="list-requests">Recent maintenance requests</h2>
        <ul libList>
          <li libListItem>
            <div libListBody>
              <div libListTitle><a href="#">Kitchen tap leak</a></div>
              <div libListMeta>Tue 13 Oct</div>
            </div>
            <span libBadge tone="warning">New</span>
          </li>
          <li libListItem>
            <div libListBody>
              <div libListTitle><a href="#">Hallway light</a></div>
              <div libListMeta>Fri 9 Oct</div>
            </div>
            <span libBadge tone="neutral">Received</span>
          </li>
          <li libListItem>
            <div libListBody>
              <div libListTitle><a href="#">Courtyard gate</a></div>
              <div libListMeta>Fri 2 Oct</div>
            </div>
            <span libBadge tone="info">Started</span>
          </li>
          <li libListItem>
            <div libListBody>
              <div libListTitle><a href="#">Window latch</a></div>
              <div libListMeta>Tue 22 Sep</div>
            </div>
            <span libBadge tone="success">Completed</span>
          </li>
        </ul>
      </section>`,
  }),
};

export default meta;
type Story = StoryObj<ListComponent>;

export const WithStatusBadges: Story = {};

export const SimpleRows: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="list-notices" style="max-width: 32rem">
        <h2 libCardTitle id="list-notices">Recent notices</h2>
        <ul libList>
          <li libListItem>
            <div libListBody>
              <div libListTitle>Autumn courtyard gathering</div>
              <div libListMeta>Sent Tue 13 Oct</div>
            </div>
          </li>
          <li libListItem>
            <div libListBody>
              <div libListTitle>Water shut-off on Thursday morning</div>
              <div libListMeta>Sent Mon 5 Oct</div>
            </div>
          </li>
        </ul>
      </section>`,
  }),
};

export const WithAvatarAndUnreadCount: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="list-conversations" style="max-width: 32rem">
        <h2 libCardTitle id="list-conversations">Conversations</h2>
        <ul libList>
          <li libListItem>
            <span libAvatar aria-hidden="true">TM</span>
            <div libListBody>
              <div libListTitle><a href="#">Courtyard gathering</a></div>
              <div libListMeta>Mira Fern: Yes, I will bring the meeting notes. · 8:00 am</div>
            </div>
            <span libBadge count>2<span class="visually-hidden"> unread</span></span>
          </li>
          <li libListItem>
            <span libAvatar aria-hidden="true">NV</span>
            <div libListBody>
              <div libListTitle><a href="#">Bylaws review</a></div>
              <div libListMeta>Neri Vale: Thank you, I have read them. · Mon 12 Oct</div>
            </div>
          </li>
        </ul>
      </section>`,
  }),
};

export const CurrentRow: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="list-profiles" style="max-width: 32rem">
        <h2 libCardTitle id="list-profiles">My profiles</h2>
        <ul libList>
          <li libListItem style="background: var(--color-accent-subtle)">
            <div libListBody>
              <div libListTitle><a href="#" aria-current="true">Mira Fern</a></div>
              <div libListMeta>Member</div>
            </div>
            <span libBadge tone="success">Active</span>
          </li>
          <li libListItem>
            <div libListBody>
              <div libListTitle><a href="#">Mira Fern</a></div>
              <div libListMeta>Board member</div>
            </div>
          </li>
        </ul>
      </section>`,
  }),
};

export const LongTitle: Story = {
  render: () => ({
    template: `
      <div style="max-width: 18rem">
        <ul libList>
          <li libListItem>
            <div libListBody>
              <div libListTitle><a href="#">Kitchen tap leak in the ground-floor common room</a></div>
              <div libListMeta>Tue 13 Oct</div>
            </div>
            <span libBadge tone="warning">New</span>
          </li>
        </ul>
      </div>`,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="list-loading" style="max-width: 32rem">
        <h2 libCardTitle id="list-loading">Conversations</h2>
        <div libLoading role="status"><span libSpinner></span>Loading conversations…</div>
      </section>`,
  }),
};

export const Empty: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="list-empty" style="max-width: 32rem">
        <h2 libCardTitle id="list-empty">Conversations</h2>
        <div libEmptyState>
          <span libEmptyStateIcon aria-hidden="true"><svg libIcon="messages" size="lg"></svg></span>
          <h2 libEmptyStateTitle>No conversations yet</h2>
          <p libEmptyStateText>When you or a member starts a conversation, it shows up here.</p>
          <div libEmptyStateActions>
            <a libButton variant="primary" href="#">New conversation</a>
          </div>
        </div>
      </section>`,
  }),
};

export const NoResults: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="list-no-results" style="max-width: 32rem">
        <h2 libCardTitle id="list-no-results">Conversations</h2>
        <div libEmptyState>
          <h2 libEmptyStateTitle>No conversations match "gate"</h2>
          <p libEmptyStateText>Check the spelling, or clear the search to see all conversations.</p>
          <div libEmptyStateActions>
            <button libButton type="button">Clear search</button>
          </div>
        </div>
      </section>`,
  }),
};
