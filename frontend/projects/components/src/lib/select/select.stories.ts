import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FieldErrorComponent } from '../form-field/field-error.component';
import { FieldHelpComponent } from '../form-field/field-help.component';
import { FieldLabelComponent } from '../form-field/field-label.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { SelectComponent } from './select.component';

const meta: Meta<SelectComponent> = {
  title: 'Inputs/Select',
  component: SelectComponent,
  decorators: [
    moduleMetadata({
      imports: [FormFieldComponent, FieldLabelComponent, FieldHelpComponent, FieldErrorComponent],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <div libFormField style="max-width: 22rem">
        <label libFieldLabel for="select-role">Role</label>
        <select libSelect id="select-role" name="role">
          <option value="Member" selected>Member</option>
          <option value="BoardMember">Board member</option>
          <option value="SystemAdministrator">System administrator</option>
        </select>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<SelectComponent>;

export const Default: Story = {};

export const WithHelp: Story = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 22rem">
        <div libFormField>
          <label libFieldLabel for="select-type">Type</label>
          <select libSelect id="select-type" name="type">
            <option value="Notice" selected>Notice</option>
            <option value="ByLaw">By-law</option>
            <option value="Report">Report</option>
          </select>
        </div>
        <div libFormField>
          <label libFieldLabel for="select-status">Status</label>
          <select libSelect id="select-status" name="status" aria-describedby="select-status-help">
            <option value="Draft" selected>Draft</option>
            <option value="Published">Published</option>
          </select>
          <p libFieldHelp id="select-status-help">
            Published documents show on the home page and the members' documents page.
          </p>
        </div>
      </div>`,
  }),
};

export const WithChooseOption: Story = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 22rem">
        <div libFormField>
          <label libFieldLabel for="select-priority">Priority</label>
          <select libSelect id="select-priority" name="priority" required>
            <option value="" selected>Choose a priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div libFormField>
          <label libFieldLabel for="select-category">Category</label>
          <select libSelect id="select-category" name="category" required>
            <option value="" selected>Choose a category</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="HVAC">Heating and cooling</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>`,
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 22rem">
        <label libFieldLabel for="select-priority-invalid">Priority</label>
        <select
          libSelect
          id="select-priority-invalid"
          name="priority"
          required
          aria-invalid="true"
          aria-describedby="select-priority-invalid-error"
        >
          <option value="" selected>Choose a priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
        <p libFieldError id="select-priority-invalid-error">
          Choose a priority so the office knows how soon to come.
        </p>
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 22rem">
        <label libFieldLabel for="select-role-disabled">Role</label>
        <select libSelect id="select-role-disabled" name="role" disabled>
          <option value="Member">Member</option>
          <option value="BoardMember" selected>Board member</option>
          <option value="SystemAdministrator">System administrator</option>
        </select>
      </div>`,
  }),
};
