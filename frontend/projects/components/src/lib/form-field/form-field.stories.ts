import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { SelectComponent } from '../select/select.component';
import { TextFieldComponent } from '../text-field/text-field.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { FieldErrorComponent } from './field-error.component';
import { FieldHelpComponent } from './field-help.component';
import { FieldLabelComponent } from './field-label.component';
import { FormFieldComponent } from './form-field.component';

const meta: Meta<FormFieldComponent> = {
  title: 'Inputs/Form field',
  component: FormFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FieldLabelComponent,
        FieldHelpComponent,
        FieldErrorComponent,
        TextFieldComponent,
        TextareaComponent,
        SelectComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="ff-name">Name</label>
        <input libTextField id="ff-name" type="text" autocomplete="off" required value="Neri Vale" />
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<FormFieldComponent>;

export const LabelOnly: Story = {};

export const Optional: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="ff-eyebrow">
          Small heading above the title <span class="optional">(optional)</span>
        </label>
        <input libTextField id="ff-eyebrow" type="text" autocomplete="off" value="A co-operative for older women" />
      </div>`,
  }),
};

export const WithHelp: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="ff-role">Role on the board</label>
        <p libFieldHelp id="ff-role-help">For example President, Treasurer, Secretary or Member at large.</p>
        <input
          libTextField
          id="ff-role"
          type="text"
          autocomplete="off"
          required
          value="Treasurer"
          aria-describedby="ff-role-help"
        />
      </div>`,
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="ff-role-err">Role on the board</label>
        <p libFieldHelp id="ff-role-err-help">For example President, Treasurer, Secretary or Member at large.</p>
        <input
          libTextField
          id="ff-role-err"
          type="text"
          autocomplete="off"
          required
          value=""
          aria-invalid="true"
          aria-describedby="ff-role-err-error ff-role-err-help"
        />
        <p libFieldError id="ff-role-err-error">Give the director's role on the board.</p>
      </div>`,
  }),
};

export const ReadOnly: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="ff-readonly">Role on the board</label>
        <input libTextField id="ff-readonly" type="text" value="Treasurer" readonly />
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="ff-disabled">Role on the board</label>
        <input libTextField id="ff-disabled" type="text" value="Treasurer" disabled />
      </div>`,
  }),
};

export const WithTextarea: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="ff-details">What needs fixing</label>
        <p libFieldHelp id="ff-details-help">Say where it is and when you first noticed it.</p>
        <textarea libTextarea id="ff-details" rows="3" aria-describedby="ff-details-help">The kitchen tap in the common room drips all night.</textarea>
      </div>`,
  }),
};

export const WithSelect: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="ff-room">Room to book</label>
        <select libSelect id="ff-room">
          <option>Common room</option>
          <option>Garden room</option>
          <option>Guest suite</option>
        </select>
      </div>`,
  }),
};

export const ConfirmPassword: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 24rem">
        <label libFieldLabel for="ff-confirm">Confirm new password</label>
        <p libFieldHelp id="ff-confirm-help">Type the new password again, exactly as above.</p>
        <input
          libTextField
          id="ff-confirm"
          type="password"
          autocomplete="new-password"
          value="OtherFictional123!"
          aria-invalid="true"
          aria-describedby="ff-confirm-error ff-confirm-help"
        />
        <p libFieldError id="ff-confirm-error">The two new passwords are different. Type the new password again.</p>
      </div>`,
  }),
};
