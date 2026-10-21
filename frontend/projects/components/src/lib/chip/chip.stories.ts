import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { BadgeComponent } from '../badge/badge.component';
import { CardComponent } from '../card/card.component';
import { ListComponent } from '../list/list.component';
import { ListBodyComponent } from '../list/list-body.component';
import { ListItemComponent } from '../list/list-item.component';
import { ListMetaComponent } from '../list/list-meta.component';
import { ListTitleComponent } from '../list/list-title.component';
import { ChipComponent } from './chip.component';

const meta: Meta<ChipComponent> = {
  title: 'Data display/Chip',
  component: ChipComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BadgeComponent,
        CardComponent,
        ListComponent,
        ListBodyComponent,
        ListItemComponent,
        ListMetaComponent,
        ListTitleComponent,
      ],
    }),
  ],
  argTypes: {},
  render: (args) => ({
    props: args,
    template: `<button libChip type="button" aria-pressed="false">New</button>`,
  }),
};

export default meta;
type Story = StoryObj<ChipComponent>;

export const Default: Story = {};

export const Pressed: Story = {
  render: () => ({
    template: `<button libChip type="button" aria-pressed="true">Started</button>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<button libChip type="button" aria-pressed="false" disabled>Reports</button>`,
  }),
};

export const MaintenanceByStatus: Story = {
  render: () => ({
    props: { status: 'All', statuses: ['All', 'New', 'Received', 'Started', 'Completed'] },
    template: `
      <div class="stack">
        <div class="cluster" role="group" aria-label="Show requests">
          @for (option of statuses; track option) {
            <button
              libChip
              type="button"
              [attr.aria-pressed]="status === option"
              (click)="status = option"
            >
              {{ option }}
            </button>
          }
        </div>
        <h2>{{ status === 'All' ? 'All requests' : status + ' requests' }}</h2>
      </div>`,
  }),
};

export const DocumentsByType: Story = {
  render: () => ({
    template: `
      <div class="stack">
        <div class="cluster" role="group" aria-label="Show documents">
          <button libChip type="button" aria-pressed="false">All documents</button>
          <button libChip type="button" aria-pressed="true">Notices</button>
          <button libChip type="button" aria-pressed="false">Bylaws</button>
          <button libChip type="button" aria-pressed="false">Reports</button>
        </div>
        <div libCard flush style="width: 100%; max-width: 32rem">
          <ul libList>
            <li libListItem>
              <div libListBody>
                <div libListTitle>Autumn courtyard gathering</div>
                <div libListMeta>Notice · Oct 13, 2026</div>
              </div>
              <span libBadge tone="success">Published</span>
            </li>
          </ul>
        </div>
      </div>`,
  }),
};

export const InAGroup: Story = {
  render: () => ({
    template: `
      <div class="cluster" role="group" aria-label="Show requests">
        <button libChip type="button" aria-pressed="true">All</button>
        <button libChip type="button" aria-pressed="false">New</button>
        <button libChip type="button" aria-pressed="false">Received</button>
        <button libChip type="button" aria-pressed="false" disabled>Completed</button>
      </div>`,
  }),
};
