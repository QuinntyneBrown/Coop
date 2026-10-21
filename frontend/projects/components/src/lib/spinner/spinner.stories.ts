import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CardComponent } from '../card/card.component';
import { FieldHelpComponent } from '../form-field/field-help.component';
import { FieldLabelComponent } from '../form-field/field-label.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { InlineStatusComponent } from '../inline-message/inline-status.component';
import { TextFieldComponent } from '../text-field/text-field.component';
import { LoadingComponent } from './loading.component';
import { SpinnerComponent } from './spinner.component';

const meta: Meta<SpinnerComponent> = {
  title: 'Feedback/Spinner',
  component: SpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        LoadingComponent,
        CardComponent,
        InlineStatusComponent,
        FormFieldComponent,
        FieldLabelComponent,
        FieldHelpComponent,
        TextFieldComponent,
      ],
    }),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { size: 'md' },
  render: (args) => ({
    props: args,
    template: `<div libLoading role="status"><span libSpinner [size]="size"></span>Loading pages…</div>`,
  }),
};

export default meta;
type Story = StoryObj<SpinnerComponent>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="stack">
        <div class="cluster"><span libSpinner size="sm"></span><span class="text-caption">Small</span></div>
        <div class="cluster"><span libSpinner></span><span class="text-caption">Medium</span></div>
      </div>`,
  }),
};

export const LoadingRow: Story = {
  render: () => ({
    template: `
      <div libCard flush>
        <div libLoading role="status"><span libSpinner></span>Loading documents…</div>
      </div>`,
  }),
};

export const InlineStatus: Story = {
  render: () => ({
    template: `
      <div libFormField style="max-width: 32rem">
        <label libFieldLabel for="spinner-photo">Upload a new photo</label>
        <input libTextField id="spinner-photo" type="file" disabled aria-describedby="spinner-photo-help" />
        <p libFieldHelp id="spinner-photo-help">JPEG, PNG or WebP, up to 10 MB.</p>
        <p libInlineStatus role="status"><span libSpinner size="sm"></span>Uploading…</p>
      </div>`,
  }),
};

export const Slow: Story = {
  render: () => ({
    template: `
      <div libLoading role="status">
        <span libSpinner></span>
        <span>Loading the board list… This is taking longer than usual.</span>
      </div>`,
  }),
};
