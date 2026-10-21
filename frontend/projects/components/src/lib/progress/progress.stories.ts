import { type Meta, type StoryObj } from '@storybook/angular';
import { ProgressComponent } from './progress.component';

// The library has no .progress-row, so the stories lay out the bar and its visible value inline.
const row = 'display: flex; align-items: center; gap: var(--space-3)';
const label = 'white-space: nowrap; font-variant-numeric: tabular-nums';

const meta: Meta<ProgressComponent> = {
  title: 'Feedback/Progress',
  component: ProgressComponent,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: { value: 45 },
  render: (args) => ({
    props: { ...args, row, label },
    template: `
      <div [style]="row">
        <div libProgress [value]="value" aria-label="Uploading Courtyard plan.pdf"></div>
        <span class="text-muted" [style]="label">{{ value }}%</span>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<ProgressComponent>;

export const Default: Story = {};

export const Starting: Story = { args: { value: 0 } };

export const NearlyDone: Story = { args: { value: 96 } };

export const Full: Story = { args: { value: 100 } };

export const WithCaption: Story = {
  render: (args) => ({
    props: { ...args, row, label },
    template: `
      <div class="stack" style="gap: var(--space-2)">
        <p class="text-caption" id="progress-caption">Uploading Courtyard plan.pdf</p>
        <div [style]="row">
          <div libProgress [value]="value" aria-labelledby="progress-caption"></div>
          <span class="text-muted" [style]="label">{{ value }}%</span>
        </div>
      </div>`,
  }),
};

export const UploadList: Story = {
  render: () => ({
    props: { row, label },
    template: `
      <div class="stack">
        <div class="stack" style="gap: var(--space-2)">
          <p class="text-caption" id="progress-list-a">Uploading Meeting notes.pdf</p>
          <div [style]="row">
            <div libProgress [value]="62" aria-labelledby="progress-list-a"></div>
            <span class="text-muted" [style]="label">62%</span>
          </div>
        </div>
        <div class="stack" style="gap: var(--space-2)">
          <p class="text-caption" id="progress-list-b">Uploading Spring newsletter.pdf</p>
          <div [style]="row">
            <div libProgress [value]="18" aria-labelledby="progress-list-b"></div>
            <span class="text-muted" [style]="label">18%</span>
          </div>
        </div>
      </div>`,
  }),
};
