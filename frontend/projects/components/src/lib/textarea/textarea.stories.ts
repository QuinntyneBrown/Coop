import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FieldErrorComponent } from '../form-field/field-error.component';
import { FieldHelpComponent } from '../form-field/field-help.component';
import { FieldLabelComponent } from '../form-field/field-label.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { TextareaComponent } from './textarea.component';

const meta: Meta<TextareaComponent> = {
  title: 'Inputs/Textarea',
  component: TextareaComponent,
  decorators: [
    moduleMetadata({
      imports: [FormFieldComponent, FieldLabelComponent, FieldHelpComponent, FieldErrorComponent],
    }),
  ],
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="request-description">Description</label>
        <textarea libTextarea id="request-description" rows="3" required>Water drips from the kitchen tap all night, even when it is turned off tight.</textarea>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<TextareaComponent>;

export const Default: Story = {};

export const WithHelp: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="photo-description">Photo description</label>
        <p libFieldHelp id="photo-description-help">Describe the photo for people who cannot see it.</p>
        <textarea libTextarea id="photo-description" rows="3" aria-describedby="photo-description-help">Our brick building with balconies and a rooftop garden. Two women chat on a bench out front.</textarea>
      </div>`,
  }),
};

export const Optional: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="hero-introduction">Introduction <span class="optional">(optional)</span></label>
        <textarea libTextarea id="hero-introduction" rows="3">Bright apartments, a rooftop garden, and neighbours who look out for one another. Run by the women who live here.</textarea>
      </div>`,
  }),
};

export const PageText: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="page-body">Page text</label>
        <p libFieldHelp id="page-body-help">
          Plain words work. For headings and lists use simple HTML: <code>&lt;h2&gt;</code>,
          <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;li&gt;</code>,
          <code>&lt;strong&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;img&gt;</code>.
        </p>
        <textarea libTextarea id="page-body" rows="8" required aria-describedby="page-body-help">&lt;p&gt;Older women built this place. We still run it.&lt;/p&gt;</textarea>
      </div>`,
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="hero-photo-alt">Photo description</label>
        <p libFieldHelp id="hero-photo-alt-help">Describe the photo for people who cannot see it.</p>
        <textarea
          libTextarea
          id="hero-photo-alt"
          rows="3"
          required
          aria-invalid="true"
          aria-describedby="hero-photo-alt-error hero-photo-alt-help"
        ></textarea>
        <p libFieldError id="hero-photo-alt-error">Describe this photo for people who cannot see it.</p>
      </div>`,
  }),
};

export const ReadOnly: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="saving-introduction">Introduction <span class="optional">(optional)</span></label>
        <textarea libTextarea id="saving-introduction" rows="3" readonly>Bright apartments, a rooftop garden, and neighbours who look out for one another.</textarea>
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="gate-description">Description</label>
        <textarea libTextarea id="gate-description" rows="3" disabled>The courtyard gate does not latch.</textarea>
      </div>`,
  }),
};
