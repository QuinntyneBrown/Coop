import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CardComponent } from '../card/card.component';
import { StepIndicatorComponent } from './step-indicator.component';

const meta: Meta<StepIndicatorComponent> = {
  title: 'Navigation/Step indicator',
  component: StepIndicatorComponent,
  decorators: [moduleMetadata({ imports: [CardComponent] })],
  argTypes: {
    current: { control: { type: 'number', min: 1, step: 1 } },
    total: { control: { type: 'number', min: 1, step: 1 } },
  },
  args: { current: 2, total: 3 },
  render: (args) => ({
    props: args,
    template: `<p libStepIndicator [current]="current" [total]="total"><span>Step {{ current }} of {{ total }}</span></p>`,
  }),
};

export default meta;
type Story = StoryObj<StepIndicatorComponent>;

export const Default: Story = {};

export const FirstStep: Story = { args: { current: 1 } };

export const LastStep: Story = { args: { current: 3 } };

export const EveryStep: Story = {
  render: () => ({
    template: `
      <div class="stack">
        <p libStepIndicator [current]="1" [total]="3"><span>Step 1 of 3</span></p>
        <p libStepIndicator [current]="2" [total]="3"><span>Step 2 of 3</span></p>
        <p libStepIndicator [current]="3" [total]="3"><span>Step 3 of 3</span></p>
      </div>`,
  }),
};

export const InOnboardingCard: Story = {
  render: () => ({
    template: `
      <section libCard class="stack" style="max-width: 30rem; margin-inline: auto; text-align: center">
        <p libStepIndicator [current]="2" [total]="3"><span>Step 2 of 3</span></p>
        <h1 style="font: var(--text-h2); margin: 0">Set up your profile</h1>
        <p class="text-muted" style="margin: 0">
          Add your name and how to reach you. You can change these later.
        </p>
      </section>`,
  }),
};
