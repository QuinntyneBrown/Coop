import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FieldErrorComponent } from '../form-field/field-error.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { CheckboxComponent } from './checkbox.component';
import { CheckboxTextComponent } from './checkbox-text.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Inputs/Checkbox',
  component: CheckboxComponent,
  decorators: [
    moduleMetadata({ imports: [CheckboxTextComponent, FormFieldComponent, FieldErrorComponent] }),
  ],
  render: () => ({
    template: `
      <label libCheckbox>
        <input type="checkbox" name="remember" value="1" />
        <span libCheckboxText>Remember me</span>
      </label>`,
  }),
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

export const Default: Story = {};

export const Checked: Story = {
  render: () => ({
    template: `
      <label libCheckbox>
        <input type="checkbox" name="remember" value="1" checked />
        <span libCheckboxText>Remember me</span>
      </label>`,
  }),
};

export const WithDescription: Story = {
  render: () => ({
    template: `
      <label libCheckbox>
        <input type="checkbox" name="send" value="1" />
        <span libCheckboxText>
          Also send to members by email and text
          <small>Only members who asked for new notices on their profile get one.</small>
        </span>
      </label>`,
  }),
};

export const SignInRow: Story = {
  render: () => ({
    template: `
      <div class="cluster cluster--between">
        <label libCheckbox>
          <input type="checkbox" name="remember" value="1" />
          <span libCheckboxText>Remember me</span>
        </label>
        <a href="#">Forgot password?</a>
      </div>`,
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div libFormField>
        <label libCheckbox>
          <input
            type="checkbox"
            name="terms"
            value="1"
            required
            aria-invalid="true"
            aria-describedby="terms-error"
          />
          <span libCheckboxText>I agree to the terms and conditions</span>
        </label>
        <p libFieldError id="terms-error">Tick this box to agree to the terms and conditions.</p>
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="stack">
        <label libCheckbox>
          <input type="checkbox" name="remember" value="1" disabled />
          <span libCheckboxText>Remember me</span>
        </label>
        <label libCheckbox>
          <input type="checkbox" name="send" value="1" checked disabled />
          <span libCheckboxText>Also send to members by email and text</span>
        </label>
      </div>`,
  }),
};

export const Group: Story = {
  render: () => ({
    template: `
      <fieldset>
        <legend>What can members do with maintenance requests?</legend>
        <label libCheckbox>
          <input
            type="checkbox"
            id="maint-all"
            name="maint-all"
            aria-controls="maint-rights"
            [indeterminate]="true"
          />
          <span libCheckboxText>All four</span>
        </label>
        <div id="maint-rights" style="padding-left: var(--space-8)">
          <label libCheckbox>
            <input type="checkbox" name="maint" value="Read" checked />
            <span libCheckboxText>Read</span>
          </label>
          <label libCheckbox>
            <input type="checkbox" name="maint" value="Write" />
            <span libCheckboxText>Write</span>
          </label>
          <label libCheckbox>
            <input type="checkbox" name="maint" value="Create" checked />
            <span libCheckboxText>Create</span>
          </label>
          <label libCheckbox>
            <input type="checkbox" name="maint" value="Delete" />
            <span libCheckboxText>Delete</span>
          </label>
        </div>
      </fieldset>`,
  }),
};
