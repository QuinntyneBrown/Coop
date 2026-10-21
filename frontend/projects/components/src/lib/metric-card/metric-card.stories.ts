import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CardComponent } from '../card/card.component';
import { CardTitleComponent } from '../card/card-title.component';
import { IconComponent } from '../icon/icon.component';
import { MetricCardComponent } from './metric-card.component';
import { MetricCardIconComponent } from './metric-card-icon.component';
import { StatComponent } from './stat.component';
import { StatLabelComponent } from './stat-label.component';
import { StatValueComponent } from './stat-value.component';

const meta: Meta<MetricCardComponent> = {
  title: 'Data display/Metric card',
  component: MetricCardComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MetricCardIconComponent,
        StatComponent,
        StatLabelComponent,
        StatValueComponent,
        IconComponent,
        CardComponent,
        CardTitleComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <div libMetricCard style="max-width: 18rem">
        <span libMetricCardIcon tone="info"><svg libIcon="messages"></svg></span>
        <span libStat>
          <span libStatLabel>Unread messages</span>
          <span libStatValue>2</span>
        </span>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<MetricCardComponent>;

export const Default: Story = {};

export const DashboardMetrics: Story = {
  render: () => ({
    template: `
      <div class="grid grid--auto">
        <div libMetricCard>
          <span libMetricCardIcon tone="warning"><svg libIcon="maintenance"></svg></span>
          <span libStat>
            <span libStatLabel>Open requests</span>
            <span libStatValue>3</span>
          </span>
        </div>
        <div libMetricCard>
          <span libMetricCardIcon tone="info"><svg libIcon="messages"></svg></span>
          <span libStat>
            <span libStatLabel>Unread messages</span>
            <span libStatValue>2</span>
          </span>
        </div>
        <div libMetricCard>
          <span libMetricCardIcon><svg libIcon="documents"></svg></span>
          <span libStat>
            <span libStatLabel>Documents</span>
            <span libStatValue>3</span>
          </span>
        </div>
        <div libMetricCard>
          <span libMetricCardIcon tone="success"><svg libIcon="users"></svg></span>
          <span libStat>
            <span libStatLabel>Active members</span>
            <span libStatValue>4</span>
          </span>
        </div>
      </div>`,
  }),
};

export const Zero: Story = {
  render: () => ({
    template: `
      <div libMetricCard style="max-width: 18rem">
        <span libMetricCardIcon tone="warning"><svg libIcon="maintenance"></svg></span>
        <span libStat>
          <span libStatLabel>Open requests</span>
          <span libStatValue>0</span>
        </span>
      </div>`,
  }),
};

export const NotAvailable: Story = {
  render: () => ({
    template: `
      <div libMetricCard style="max-width: 18rem">
        <span libMetricCardIcon tone="success"><svg libIcon="users"></svg></span>
        <span libStat>
          <span libStatLabel>Active members</span>
          <span libStatValue><span aria-hidden="true">–</span><span class="visually-hidden">Not available</span></span>
        </span>
      </div>`,
  }),
};

export const LongLabel: Story = {
  render: () => ({
    template: `
      <div libMetricCard style="max-width: 18rem">
        <span libMetricCardIcon><svg libIcon="documents"></svg></span>
        <span libStat>
          <span libStatLabel>Common room bookings this month</span>
          <span libStatValue>12</span>
        </span>
      </div>`,
  }),
};

export const BareStat: Story = {
  render: () => ({
    template: `
      <section libCard aria-labelledby="stat-bare-title" style="max-width: 22rem">
        <h2 libCardTitle id="stat-bare-title">Maple Court Co-op</h2>
        <div class="cluster" style="gap: var(--space-6)">
          <span libStat>
            <span libStatLabel>Documents</span>
            <span libStatValue>3</span>
          </span>
          <span libStat>
            <span libStatLabel>Active members</span>
            <span libStatValue>4</span>
          </span>
        </div>
      </section>`,
  }),
};
