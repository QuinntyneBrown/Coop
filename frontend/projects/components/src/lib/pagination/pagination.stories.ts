import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { BadgeComponent } from '../badge/badge.component';
import { CardComponent } from '../card/card.component';
import { TableComponent } from '../table/table.component';
import { TableWrapComponent } from '../table/table-wrap.component';
import { PaginationComponent } from './pagination.component';
import { PaginationLinkComponent } from './pagination-link.component';
import { PaginationListComponent } from './pagination-list.component';

const meta: Meta<PaginationComponent> = {
  title: 'Navigation/Pagination',
  component: PaginationComponent,
  decorators: [
    moduleMetadata({
      imports: [
        PaginationListComponent,
        PaginationLinkComponent,
        CardComponent,
        TableComponent,
        TableWrapComponent,
        BadgeComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <div libCard flush>
        <nav libPagination aria-label="Pagination, members">
          <p aria-live="polite">Showing 1–2 of 4 members</p>
          <ul libPaginationList>
            <li><button libPaginationLink type="button" disabled>Previous<span class="visually-hidden"> page</span></button></li>
            <li><button libPaginationLink type="button" aria-current="page"><span class="visually-hidden">Page </span>1</button></li>
            <li><button libPaginationLink type="button"><span class="visually-hidden">Page </span>2</button></li>
            <li><button libPaginationLink type="button">Next<span class="visually-hidden"> page</span></button></li>
          </ul>
        </nav>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<PaginationComponent>;

export const FirstPage: Story = {};

export const LastPage: Story = {
  render: () => ({
    template: `
      <div libCard flush>
        <nav libPagination aria-label="Pagination, members, last page">
          <p aria-live="polite">Showing 3–4 of 4 members</p>
          <ul libPaginationList>
            <li><button libPaginationLink type="button">Previous<span class="visually-hidden"> page</span></button></li>
            <li><button libPaginationLink type="button"><span class="visually-hidden">Page </span>1</button></li>
            <li><button libPaginationLink type="button" aria-current="page"><span class="visually-hidden">Page </span>2</button></li>
            <li><button libPaginationLink type="button" disabled>Next<span class="visually-hidden"> page</span></button></li>
          </ul>
        </nav>
      </div>`,
  }),
};

export const InTable: Story = {
  render: () => ({
    template: `
      <div libCard flush>
        <div libTableWrap flush tabindex="0" role="region" aria-labelledby="pagination-users-caption">
          <table libTable>
            <caption class="visually-hidden" id="pagination-users-caption">Users, page 1 of 2</caption>
            <thead>
              <tr><th scope="col">Username</th><th scope="col">Role</th><th scope="col">Status</th></tr>
            </thead>
            <tbody>
              <tr><td>mira.fern</td><td>System administrator</td><td><span libBadge tone="success">Active</span></td></tr>
              <tr><td>tavi.moss</td><td>Board member</td><td><span libBadge tone="success">Active</span></td></tr>
            </tbody>
          </table>
        </div>
        <nav
          libPagination
          aria-label="Pagination, users"
          style="border-top: var(--border-width-hairline) solid var(--color-border-default)"
        >
          <p aria-live="polite">Showing 1–2 of 4 users</p>
          <ul libPaginationList>
            <li><button libPaginationLink type="button" disabled>Previous<span class="visually-hidden"> page</span></button></li>
            <li><button libPaginationLink type="button" aria-current="page"><span class="visually-hidden">Page </span>1</button></li>
            <li><button libPaginationLink type="button"><span class="visually-hidden">Page </span>2</button></li>
            <li><button libPaginationLink type="button">Next<span class="visually-hidden"> page</span></button></li>
          </ul>
        </nav>
      </div>`,
  }),
};

export const Narrow: Story = {
  render: () => ({
    template: `
      <div libCard flush style="max-width: 20rem">
        <nav libPagination aria-label="Pagination, notices">
          <p aria-live="polite">Showing 1–2 of 4 notices</p>
          <ul libPaginationList>
            <li><button libPaginationLink type="button" disabled>Previous<span class="visually-hidden"> page</span></button></li>
            <li><button libPaginationLink type="button" aria-current="page"><span class="visually-hidden">Page </span>1</button></li>
            <li><button libPaginationLink type="button"><span class="visually-hidden">Page </span>2</button></li>
            <li><button libPaginationLink type="button">Next<span class="visually-hidden"> page</span></button></li>
          </ul>
        </nav>
      </div>`,
  }),
};
