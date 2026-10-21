import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { EmptyStateActionsComponent } from '../empty-state/empty-state-actions.component';
import { EmptyStateIconComponent } from '../empty-state/empty-state-icon.component';
import { EmptyStateTextComponent } from '../empty-state/empty-state-text.component';
import { EmptyStateTitleComponent } from '../empty-state/empty-state-title.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { FieldLabelComponent } from '../form-field/field-label.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { IconComponent } from '../icon/icon.component';
import { TextFieldComponent } from '../text-field/text-field.component';
import { SearchFieldComponent } from './search-field.component';

const meta: Meta<SearchFieldComponent> = {
  title: 'Inputs/Search field',
  component: SearchFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [
        IconComponent,
        TextFieldComponent,
        FormFieldComponent,
        FieldLabelComponent,
        ButtonComponent,
        CardComponent,
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
      <div libSearchField style="max-width: 24rem">
        <label class="visually-hidden" for="sf-users">Search users</label>
        <svg libIcon="search"></svg>
        <input libTextField id="sf-users" type="search" placeholder="Search users" autocomplete="off" spellcheck="false" />
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<SearchFieldComponent>;

export const HiddenLabel: Story = {};

export const VisibleLabel: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="sf-documents">Search documents</label>
        <div libSearchField>
          <svg libIcon="search"></svg>
          <input libTextField id="sf-documents" type="search" placeholder="Search by title" autocomplete="off" spellcheck="false" />
        </div>
      </div>`,
  }),
};

export const WithText: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="sf-with-text">Search users</label>
        <div libSearchField>
          <svg libIcon="search"></svg>
          <input libTextField id="sf-with-text" type="search" placeholder="Search by username" autocomplete="off" spellcheck="false" value="mira" />
        </div>
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="sf-disabled">Search users</label>
        <div libSearchField>
          <svg libIcon="search"></svg>
          <input libTextField id="sf-disabled" type="search" placeholder="Search by username" autocomplete="off" disabled />
        </div>
      </div>`,
  }),
};

export const InPageHeader: Story = {
  render: () => ({
    template: `
      <div class="page-header" style="align-items: center">
        <h2>Users</h2>
        <div class="cluster" style="flex: 1 1 18rem; justify-content: flex-end">
          <div libSearchField style="flex: 1 1 14rem">
            <label class="visually-hidden" for="sf-header-users">Search users</label>
            <svg libIcon="search"></svg>
            <input libTextField id="sf-header-users" type="search" placeholder="Search users" autocomplete="off" spellcheck="false" />
          </div>
          <button libButton type="button" variant="primary"><svg libIcon="add"></svg>Add user</button>
        </div>
      </div>`,
  }),
};

export const NoResults: Story = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 32rem">
        <div libFormField>
          <label libFieldLabel for="sf-no-results">Search users</label>
          <div libSearchField>
            <svg libIcon="search"></svg>
            <input libTextField id="sf-no-results" type="search" placeholder="Search by username" autocomplete="off" spellcheck="false" value="neri.x" />
          </div>
        </div>
        <p class="visually-hidden" role="status">No users match “neri.x”</p>
        <div libCard>
          <div libEmptyState>
            <div libEmptyStateIcon><svg libIcon="search" size="lg"></svg></div>
            <h2 libEmptyStateTitle>No users match “neri.x”</h2>
            <p libEmptyStateText>Check the spelling, or search for part of the username.</p>
            <div libEmptyStateActions>
              <button libButton type="button">Clear search</button>
            </div>
          </div>
        </div>
      </div>`,
  }),
};
