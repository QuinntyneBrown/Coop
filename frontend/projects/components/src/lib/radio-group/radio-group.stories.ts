import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CardComponent } from '../card/card.component';
import { FieldErrorComponent } from '../form-field/field-error.component';
import { FieldHelpComponent } from '../form-field/field-help.component';
import { RadioTextComponent } from './radio-text.component';
import { RadioComponent } from './radio.component';

const meta: Meta<RadioComponent> = {
  title: 'Inputs/Radio group',
  component: RadioComponent,
  decorators: [
    moduleMetadata({
      imports: [RadioTextComponent, CardComponent, FieldHelpComponent, FieldErrorComponent],
    }),
  ],
  argTypes: {},
  render: () => ({
    // The docs page renders the primary story twice; the form keeps each copy its own group.
    template: `
      <form>
        <fieldset style="max-width: 24rem">
          <legend>Priority</legend>
          <label libRadio><input type="radio" name="rg-default-priority" value="Low" /><span libRadioText>Low</span></label>
          <label libRadio><input type="radio" name="rg-default-priority" value="Medium" checked /><span libRadioText>Medium</span></label>
          <label libRadio><input type="radio" name="rg-default-priority" value="High" /><span libRadioText>High</span></label>
          <label libRadio><input type="radio" name="rg-default-priority" value="Urgent" /><span libRadioText>Urgent</span></label>
        </fieldset>
      </form>`,
  }),
};

export default meta;
type Story = StoryObj<RadioComponent>;

export const Default: Story = {};

export const WithDescriptions: Story = {
  render: () => ({
    template: `
      <fieldset libCard class="stack" style="max-width: 32rem" aria-describedby="rg-card-status-help">
        <legend style="font: var(--text-h4); margin-bottom: var(--space-2)">Status</legend>
        <p libFieldHelp id="rg-card-status-help">You can change this later from Documents.</p>
        <label libRadio>
          <input type="radio" name="rg-card-status" value="Draft" checked />
          <span libRadioText>Draft<small>Not shown to members yet</small></span>
        </label>
        <label libRadio>
          <input type="radio" name="rg-card-status" value="Published" />
          <span libRadioText>Published<small>Shows on the home page and the members' documents page</small></span>
        </label>
      </fieldset>`,
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <fieldset style="max-width: 24rem" aria-describedby="rg-invalid-error">
        <legend>How soon should someone come?</legend>
        <label libRadio><input type="radio" name="rg-invalid-priority" value="Low" aria-invalid="true" /><span libRadioText>Low</span></label>
        <label libRadio><input type="radio" name="rg-invalid-priority" value="Medium" aria-invalid="true" /><span libRadioText>Medium</span></label>
        <label libRadio><input type="radio" name="rg-invalid-priority" value="High" aria-invalid="true" /><span libRadioText>High</span></label>
        <label libRadio><input type="radio" name="rg-invalid-priority" value="Urgent" aria-invalid="true" /><span libRadioText>Urgent</span></label>
        <p libFieldError id="rg-invalid-error">Choose how soon someone should come</p>
      </fieldset>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <fieldset style="max-width: 24rem">
        <legend>Status</legend>
        <label libRadio><input type="radio" name="rg-disabled-status" value="Draft" checked disabled /><span libRadioText>Draft</span></label>
        <label libRadio><input type="radio" name="rg-disabled-status" value="Published" disabled /><span libRadioText>Published</span></label>
      </fieldset>`,
  }),
};
