import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AvatarComponent } from '../avatar/avatar.component';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { CardTitleComponent } from '../card/card-title.component';
import { CardComponent } from '../card/card.component';
import { EmptyStateActionsComponent } from '../empty-state/empty-state-actions.component';
import { EmptyStateIconComponent } from '../empty-state/empty-state-icon.component';
import { EmptyStateTextComponent } from '../empty-state/empty-state-text.component';
import { EmptyStateTitleComponent } from '../empty-state/empty-state-title.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { IconComponent } from '../icon/icon.component';
import { PaginationLinkComponent } from '../pagination/pagination-link.component';
import { PaginationListComponent } from '../pagination/pagination-list.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoadingComponent } from '../spinner/loading.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SwitchComponent } from '../switch/switch.component';
import { TableWrapComponent } from './table-wrap.component';
import { TableComponent } from './table.component';

const meta: Meta<TableComponent> = {
  title: 'Data display/Table',
  component: TableComponent,
  decorators: [
    moduleMetadata({
      imports: [
        TableWrapComponent,
        AvatarComponent,
        BadgeComponent,
        ButtonComponent,
        IconComponent,
        CardComponent,
        CardTitleComponent,
        PaginationComponent,
        PaginationListComponent,
        PaginationLinkComponent,
        SwitchComponent,
        LoadingComponent,
        SpinnerComponent,
        EmptyStateComponent,
        EmptyStateIconComponent,
        EmptyStateTitleComponent,
        EmptyStateTextComponent,
        EmptyStateActionsComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <div libTableWrap tabindex="0" role="region" aria-labelledby="tbl-inv-caption">
        <table libTable>
          <caption class="visually-hidden" id="tbl-inv-caption">Invitations</caption>
          <thead>
            <tr>
              <th scope="col">Invitation code</th>
              <th scope="col">For</th>
              <th scope="col">Expires</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>fictional-invite-0</code></td>
              <td>Member</td>
              <td>Fri 13 Nov</td>
              <td><span libBadge tone="success">Active</span></td>
            </tr>
            <tr>
              <td><code>fictional-invite-1</code></td>
              <td>Board member</td>
              <td>Sun 13 Sep</td>
              <td><span libBadge tone="danger">Expired</span></td>
            </tr>
            <tr>
              <td><code>fictional-invite-2</code></td>
              <td>Staff</td>
              <td>Fri 13 Nov</td>
              <td><span libBadge tone="neutral">Used</span></td>
            </tr>
          </tbody>
        </table>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<TableComponent>;

export const Framed: Story = {};

export const WithRowActions: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="tbl-users-title">
        <h2 libCardTitle id="tbl-users-title">All users</h2>
        <div libTableWrap flush style="margin-top: var(--space-3)">
          <table libTable>
            <caption class="visually-hidden">Users, page 1 of 2</caption>
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col"><span class="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="cluster" style="gap: var(--space-2); flex-wrap: nowrap">
                    <span libAvatar size="sm" aria-hidden="true">MF</span>mira.fern
                  </div>
                </td>
                <td>System administrator</td>
                <td><span libBadge tone="success">Active</span></td>
                <td>
                  <div class="cluster" style="gap: var(--space-1); flex-wrap: nowrap">
                    <button libButton type="button" variant="ghost" iconOnly aria-label="Edit mira.fern"><svg libIcon="edit"></svg></button>
                    <button libButton type="button" variant="ghost" iconOnly aria-label="Delete mira.fern"><svg libIcon="delete"></svg></button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cluster" style="gap: var(--space-2); flex-wrap: nowrap">
                    <span libAvatar size="sm" aria-hidden="true">TM</span>tavi.moss
                  </div>
                </td>
                <td>Board member</td>
                <td><span libBadge tone="success">Active</span></td>
                <td>
                  <div class="cluster" style="gap: var(--space-1); flex-wrap: nowrap">
                    <button libButton type="button" variant="ghost" iconOnly aria-label="Edit tavi.moss"><svg libIcon="edit"></svg></button>
                    <button libButton type="button" variant="ghost" iconOnly aria-label="Delete tavi.moss"><svg libIcon="delete"></svg></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <nav libPagination aria-label="Pages of users">
          <p aria-live="polite">Showing 1–2 of 4 users</p>
          <ul libPaginationList>
            <li><button libPaginationLink type="button" disabled>Previous<span class="visually-hidden"> page</span></button></li>
            <li><button libPaginationLink type="button" aria-current="page"><span class="visually-hidden">Page </span>1</button></li>
            <li><button libPaginationLink type="button"><span class="visually-hidden">Page </span>2</button></li>
            <li><button libPaginationLink type="button">Next<span class="visually-hidden"> page</span></button></li>
          </ul>
        </nav>
      </section>`,
  }),
};

export const WithSwitches: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="tbl-priv-title">
        <h2 libCardTitle id="tbl-priv-title">System administrator privileges</h2>
        <div libTableWrap flush style="margin-top: var(--space-3)">
          <table libTable>
            <caption class="visually-hidden">What the System administrator role may do with each kind of record</caption>
            <thead>
              <tr>
                <th scope="col">Record</th>
                <th scope="col">Read</th>
                <th scope="col">Write</th>
                <th scope="col">Create</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">User</th>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Read, User</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Write, User</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Create, User</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Delete, User</span></label></td>
              </tr>
              <tr>
                <th scope="row">Maintenance request</th>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Read, Maintenance request</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Write, Maintenance request</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Create, Maintenance request</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" /><span class="visually-hidden">Delete, Maintenance request</span></label></td>
              </tr>
              <tr>
                <th scope="row">Document</th>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Read, Document</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Write, Document</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Create, Document</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Delete, Document</span></label></td>
              </tr>
              <tr>
                <th scope="row">Profile</th>
                <td><label libSwitch><input type="checkbox" role="switch" checked /><span class="visually-hidden">Read, Profile</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" /><span class="visually-hidden">Write, Profile</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" /><span class="visually-hidden">Create, Profile</span></label></td>
                <td><label libSwitch><input type="checkbox" role="switch" /><span class="visually-hidden">Delete, Profile</span></label></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>`,
  }),
};

export const TruncatedCell: Story = {
  render: () => ({
    template: `
      <div libTableWrap tabindex="0" role="region" aria-labelledby="tbl-trunc-caption">
        <table libTable>
          <caption class="visually-hidden" id="tbl-trunc-caption">Invitations with a long note</caption>
          <thead>
            <tr>
              <th scope="col">Invitation code</th>
              <th scope="col">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>fictional-invite-0</code></td>
              <td class="truncate" style="max-width: 10rem">Member invitation for the second floor garden suite</td>
            </tr>
          </tbody>
        </table>
      </div>`,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="tbl-load-title" aria-busy="true">
        <h2 libCardTitle id="tbl-load-title">All users</h2>
        <div libLoading role="status"><span libSpinner></span>Loading users…</div>
      </section>`,
  }),
};

export const Empty: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="tbl-empty-title">
        <h2 libCardTitle id="tbl-empty-title">Invitations</h2>
        <div libEmptyState>
          <div libEmptyStateIcon aria-hidden="true"><svg libIcon="invitations" size="lg"></svg></div>
          <h2 libEmptyStateTitle>No invitations yet</h2>
          <p libEmptyStateText>Invite someone to join the co-op and their code will show here.</p>
          <div libEmptyStateActions>
            <button libButton type="button" variant="primary">Create an invitation</button>
          </div>
        </div>
      </section>`,
  }),
};

export const NoResults: Story = {
  render: () => ({
    template: `
      <section libCard flush aria-labelledby="tbl-none-title">
        <h2 libCardTitle id="tbl-none-title">All users</h2>
        <div libEmptyState>
          <h2 libEmptyStateTitle>No users match “oren.r”</h2>
          <p libEmptyStateText>Check the spelling, or search for part of the name.</p>
          <div libEmptyStateActions>
            <button libButton type="button">Clear search</button>
          </div>
        </div>
      </section>`,
  }),
};
