import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ListBodyComponent } from '../list/list-body.component';
import { ListItemComponent } from '../list/list-item.component';
import { ListMetaComponent } from '../list/list-meta.component';
import { ListTitleComponent } from '../list/list-title.component';
import { ListComponent } from '../list/list.component';
import { TableWrapComponent } from '../table/table-wrap.component';
import { TableComponent } from '../table/table.component';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Data display/Badge',
  component: BadgeComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ListComponent,
        ListItemComponent,
        ListBodyComponent,
        ListTitleComponent,
        ListMetaComponent,
        TableWrapComponent,
        TableComponent,
      ],
    }),
  ],
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    count: { control: 'boolean' },
  },
  args: { count: false },
  render: (args) => ({
    props: args,
    template: `<span libBadge [tone]="tone" [count]="count">Received</span>`,
  }),
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Default: Story = {};

export const Neutral: Story = {
  args: { tone: 'neutral' },
  render: (args) => ({
    props: args,
    template: `<span libBadge [tone]="tone">Disabled</span>`,
  }),
};

export const Info: Story = {
  args: { tone: 'info' },
  render: (args) => ({
    props: args,
    template: `<span libBadge [tone]="tone">Started</span>`,
  }),
};

export const Success: Story = {
  args: { tone: 'success' },
  render: (args) => ({
    props: args,
    template: `<span libBadge [tone]="tone">Completed</span>`,
  }),
};

export const Warning: Story = {
  args: { tone: 'warning' },
  render: (args) => ({
    props: args,
    template: `<span libBadge [tone]="tone">New</span>`,
  }),
};

export const Danger: Story = {
  args: { tone: 'danger' },
  render: (args) => ({
    props: args,
    template: `<span libBadge [tone]="tone">Expired</span>`,
  }),
};

export const Count: Story = {
  render: () => ({
    template: `
      <ul libList style="max-width: 32rem">
        <li libListItem>
          <div libListBody>
            <div libListTitle>Courtyard gathering</div>
            <div libListMeta>Conversation</div>
          </div>
          <span libBadge count aria-label="2 unread messages">2</span>
        </li>
      </ul>`,
  }),
};

export const MaintenanceRequests: Story = {
  render: () => ({
    template: `
      <ul libList style="max-width: 32rem">
        <li libListItem>
          <div libListBody>
            <div libListTitle>Kitchen tap leak</div>
            <div libListMeta>Oct 13, 2026</div>
          </div>
          <span libBadge tone="warning">New</span>
        </li>
        <li libListItem>
          <div libListBody>
            <div libListTitle>Hallway light</div>
            <div libListMeta>Oct 9, 2026</div>
          </div>
          <span libBadge tone="neutral">Received</span>
        </li>
        <li libListItem>
          <div libListBody>
            <div libListTitle>Courtyard gate</div>
            <div libListMeta>Oct 2, 2026</div>
          </div>
          <span libBadge tone="info">Started</span>
        </li>
        <li libListItem>
          <div libListBody>
            <div libListTitle>Window latch</div>
            <div libListMeta>Sep 22, 2026</div>
          </div>
          <span libBadge tone="success">Completed</span>
        </li>
      </ul>`,
  }),
};

export const AccountStatuses: Story = {
  render: () => ({
    template: `
      <div class="stack">
        <div class="cluster" role="group" aria-label="User account statuses">
          <span libBadge tone="success">Active</span>
          <span libBadge tone="neutral">Disabled</span>
        </div>
        <div class="cluster" role="group" aria-label="Invitation statuses">
          <span libBadge tone="success">Active</span>
          <span libBadge tone="neutral">Used</span>
          <span libBadge tone="danger">Expired</span>
        </div>
        <div class="cluster" role="group" aria-label="Document statuses">
          <span libBadge tone="success">Published</span>
          <span libBadge tone="warning">Draft</span>
        </div>
      </div>`,
  }),
};

export const InTable: Story = {
  render: () => ({
    template: `
      <div libTableWrap tabindex="0" role="region" aria-labelledby="badge-invitations-caption">
        <table libTable>
          <caption class="visually-hidden" id="badge-invitations-caption">Invitations</caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Type</th>
              <th scope="col">Expires</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>fictional-invite-0</td>
              <td>Member</td>
              <td>Nov 13, 2026</td>
              <td><span libBadge tone="success">Active</span></td>
            </tr>
            <tr>
              <td>fictional-invite-1</td>
              <td>Board member</td>
              <td>Sep 13, 2026</td>
              <td><span libBadge tone="danger">Expired</span></td>
            </tr>
            <tr>
              <td>fictional-invite-2</td>
              <td>Staff</td>
              <td>Nov 13, 2026</td>
              <td><span libBadge tone="neutral">Used</span></td>
            </tr>
          </tbody>
        </table>
      </div>`,
  }),
};
