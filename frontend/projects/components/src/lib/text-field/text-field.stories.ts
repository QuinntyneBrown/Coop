import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FieldErrorComponent } from '../form-field/field-error.component';
import { FieldHelpComponent } from '../form-field/field-help.component';
import { FieldLabelComponent } from '../form-field/field-label.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { TextFieldComponent } from './text-field.component';

const meta: Meta<TextFieldComponent> = {
  title: 'Inputs/Text field',
  component: TextFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [FormFieldComponent, FieldLabelComponent, FieldHelpComponent, FieldErrorComponent],
    }),
  ],
  render: () => ({
    template: `
      <div libFormField style="max-width: 22rem">
        <label libFieldLabel for="tf-default">Username</label>
        <input libTextField id="tf-default" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" value="mira.fern" />
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<TextFieldComponent>;

export const Default: Story = {};

export const Types: Story = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 32rem">
        <div libFormField>
          <label libFieldLabel for="tf-type-user">Username</label>
          <input libTextField id="tf-type-user" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" value="tavi.moss" style="max-width: 20rem" />
        </div>
        <div libFormField>
          <label libFieldLabel for="tf-type-password">New password</label>
          <input libTextField id="tf-type-password" type="password" autocomplete="new-password" value="NewFictional123!" />
        </div>
        <div libFormField>
          <label libFieldLabel for="tf-type-expires">Expires</label>
          <input libTextField id="tf-type-expires" type="date" value="2026-11-30" style="max-width: 14rem" />
        </div>
        <div libFormField>
          <label libFieldLabel for="tf-type-photo">Photo address <span class="optional">(optional)</span></label>
          <input libTextField id="tf-type-photo" type="url" spellcheck="false" value="https://example.org/assets/portrait.svg" />
        </div>
      </div>`,
  }),
};

export const WithHelp: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="tf-help-title">Title</label>
        <input libTextField id="tf-help-title" type="text" autocomplete="off" aria-describedby="tf-help-title-help" value="Kitchen tap leak" />
        <p libFieldHelp id="tf-help-title-help">A few words, such as "Hallway light" or "Window latch".</p>
      </div>`,
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="tf-invalid-title">Title</label>
        <input libTextField id="tf-invalid-title" type="text" autocomplete="off" required value="" aria-invalid="true" aria-describedby="tf-invalid-title-error" />
        <p libFieldError id="tf-invalid-title-error">Enter a title for the request.</p>
      </div>`,
  }),
};

export const ReadOnly: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="tf-readonly-name">Name</label>
        <input libTextField id="tf-readonly-name" type="text" autocomplete="off" value="Oren Reed" readonly />
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="tf-disabled-title">Title</label>
        <input libTextField id="tf-disabled-title" type="text" autocomplete="off" value="Kitchen tap leak" disabled />
      </div>`,
  }),
};
