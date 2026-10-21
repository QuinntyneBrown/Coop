import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { BadgeComponent } from '../badge/badge.component';
import { CardTitleComponent } from '../card/card-title.component';
import { CardComponent } from '../card/card.component';
import { EmptyStateIconComponent } from '../empty-state/empty-state-icon.component';
import { EmptyStateTextComponent } from '../empty-state/empty-state-text.component';
import { EmptyStateTitleComponent } from '../empty-state/empty-state-title.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { IconComponent } from '../icon/icon.component';
import { LoadingComponent } from '../spinner/loading.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { TabPanelComponent } from './tab-panel.component';
import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';

const meta: Meta<TabsComponent> = {
  title: 'Navigation/Tabs',
  component: TabsComponent,
  decorators: [
    moduleMetadata({
      imports: [
        TabComponent,
        TabPanelComponent,
        CardComponent,
        CardTitleComponent,
        BadgeComponent,
        EmptyStateComponent,
        EmptyStateIconComponent,
        EmptyStateTitleComponent,
        EmptyStateTextComponent,
        IconComponent,
        LoadingComponent,
        SpinnerComponent,
      ],
    }),
  ],
  argTypes: {
    pill: { control: 'boolean' },
  },
  args: { pill: false },
  render: (args) => ({
    props: args,
    template: `
      <div libTabs [pill]="pill" aria-label="Settings">
        <button libTab type="button" id="pg-tab-theme" aria-selected="true" aria-controls="pg-panel">Theme</button>
        <button libTab type="button" id="pg-tab-content" aria-selected="false" aria-controls="pg-panel">Content</button>
        <button libTab type="button" id="pg-tab-account" aria-selected="false" aria-controls="pg-panel">Account</button>
      </div>
      <div libTabPanel id="pg-panel" aria-labelledby="pg-tab-theme" tabindex="0">
        <p>Choose the colours for the app. The preview shows your changes before you save.</p>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<TabsComponent>;

export const Underline: Story = {};

export const Pill: Story = {
  args: { pill: true },
  render: (args) => ({
    props: args,
    template: `
      <div libTabs [pill]="pill" aria-label="Filter requests by status">
        <button libTab type="button" id="pl-tab-all" aria-selected="true" aria-controls="pl-panel">All</button>
        <button libTab type="button" id="pl-tab-new" aria-selected="false" aria-controls="pl-panel">New</button>
        <button libTab type="button" id="pl-tab-completed" aria-selected="false" aria-controls="pl-panel">Completed</button>
      </div>
      <div libTabPanel id="pl-panel" aria-labelledby="pl-tab-all" tabindex="0">
        <p>Every maintenance request, newest first.</p>
      </div>`,
  }),
};

export const Settings: Story = {
  render: () => ({
    props: { selected: 'theme' },
    template: `
      <div libTabs aria-label="Settings">
        <button libTab type="button" id="set-tab-theme" aria-controls="set-panel-theme" [attr.aria-selected]="selected === 'theme'" (click)="selected = 'theme'">Theme</button>
        <button libTab type="button" id="set-tab-content" aria-controls="set-panel-content" [attr.aria-selected]="selected === 'content'" (click)="selected = 'content'">Content</button>
        <button libTab type="button" id="set-tab-account" aria-controls="set-panel-account" [attr.aria-selected]="selected === 'account'" (click)="selected = 'account'">Account</button>
      </div>
      <div libTabPanel id="set-panel-theme" aria-labelledby="set-tab-theme" tabindex="0" [hidden]="selected !== 'theme'">
        <div libCard>
          <h2 libCardTitle>Theme customisation</h2>
          <p class="text-muted">Choose the colours for the app. The preview shows your changes before you save.</p>
        </div>
      </div>
      <div libTabPanel id="set-panel-content" aria-labelledby="set-tab-content" tabindex="0" [hidden]="selected !== 'content'">
        <div libCard>
          <h2 libCardTitle>Content</h2>
          <p class="text-muted">Change the words on the welcome page, such as the invitation to the autumn courtyard gathering.</p>
        </div>
      </div>
      <div libTabPanel id="set-panel-account" aria-labelledby="set-tab-account" tabindex="0" [hidden]="selected !== 'account'">
        <div libCard>
          <h2 libCardTitle>Account</h2>
          <p class="text-muted">Update your name, email and password.</p>
        </div>
      </div>`,
  }),
};

export const InACard: Story = {
  render: () => ({
    template: `
      <div libCard>
        <div libTabs aria-label="Kitchen tap leak">
          <button libTab type="button" id="req-tab-details" aria-selected="false" aria-controls="req-panel">Details</button>
          <button libTab type="button" id="req-tab-comments" aria-selected="true" aria-controls="req-panel">Comments</button>
        </div>
        <div libTabPanel id="req-panel" aria-labelledby="req-tab-comments" tabindex="0">
          <p><b>Mira Fern</b> <span class="text-muted">· Oct 13, 2026, 10:20 AM</span></p>
          <p>It drips most at night. I have put a bowl under it for now.</p>
        </div>
      </div>`,
  }),
};

export const RequestFilters: Story = {
  render: () => ({
    template: `
      <div libTabs pill aria-label="Filter requests by status">
        <button libTab type="button" id="mt-tab-all" aria-selected="false" aria-controls="mt-panel">All</button>
        <button libTab type="button" id="mt-tab-new" aria-selected="true" aria-controls="mt-panel">New</button>
        <button libTab type="button" id="mt-tab-received" aria-selected="false" aria-controls="mt-panel">Received</button>
        <button libTab type="button" id="mt-tab-started" aria-selected="false" aria-controls="mt-panel">Started</button>
        <button libTab type="button" id="mt-tab-completed" aria-selected="false" aria-controls="mt-panel">Completed</button>
      </div>
      <div libTabPanel id="mt-panel" aria-labelledby="mt-tab-new" tabindex="0" style="padding-top: var(--space-4)">
        <div libCard>
          <div class="cluster cluster--between">
            <span><b>Kitchen tap leak</b><br /><span class="text-muted">Oct 13, 2026</span></span>
            <span libBadge tone="warning">New</span>
          </div>
        </div>
      </div>`,
  }),
};

export const DocumentFilters: Story = {
  render: () => ({
    template: `
      <div libTabs pill aria-label="Filter documents by kind">
        <button libTab type="button" id="doc-tab-all" aria-selected="true" aria-controls="doc-panel">All documents</button>
        <button libTab type="button" id="doc-tab-notices" aria-selected="false" aria-controls="doc-panel">Notices</button>
        <button libTab type="button" id="doc-tab-bylaws" aria-selected="false" aria-controls="doc-panel">Bylaws</button>
        <button libTab type="button" id="doc-tab-reports" aria-selected="false" aria-controls="doc-panel">Reports</button>
      </div>
      <div libTabPanel class="visually-hidden" id="doc-panel" aria-labelledby="doc-tab-all">
        Meeting notes.pdf, Courtyard plan.pdf, Autumn courtyard gathering
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="stack">
        <div libTabs aria-label="Settings">
          <button libTab type="button" aria-selected="true">Theme</button>
          <button libTab type="button" aria-selected="false" disabled>Account</button>
        </div>
        <div libTabs pill aria-label="Filter requests by status">
          <button libTab type="button" aria-selected="true">All</button>
          <button libTab type="button" aria-selected="false" disabled>Started</button>
        </div>
      </div>`,
  }),
};

export const EmptyPanel: Story = {
  render: () => ({
    template: `
      <div libTabs pill aria-label="Filter requests by status">
        <button libTab type="button" id="em-tab-all" aria-selected="false" aria-controls="em-panel">All</button>
        <button libTab type="button" id="em-tab-new" aria-selected="false" aria-controls="em-panel">New</button>
        <button libTab type="button" id="em-tab-completed" aria-selected="true" aria-controls="em-panel">Completed</button>
      </div>
      <div libTabPanel id="em-panel" aria-labelledby="em-tab-completed" tabindex="0">
        <div libEmptyState>
          <div libEmptyStateIcon aria-hidden="true"><svg libIcon="maintenance" size="lg"></svg></div>
          <h2 libEmptyStateTitle>No completed requests</h2>
          <p libEmptyStateText>When a repair is finished, it will show here.</p>
        </div>
      </div>`,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `
      <div libTabs pill aria-label="Filter requests by status">
        <button libTab type="button" id="ld-tab-all" aria-selected="false" aria-controls="ld-panel">All</button>
        <button libTab type="button" id="ld-tab-new" aria-selected="false" aria-controls="ld-panel">New</button>
        <button libTab type="button" id="ld-tab-started" aria-selected="true" aria-controls="ld-panel">Started</button>
      </div>
      <div libTabPanel id="ld-panel" aria-labelledby="ld-tab-started" tabindex="0" aria-busy="true">
        <div libLoading role="status"><span libSpinner></span>Loading requests…</div>
      </div>`,
  }),
};
