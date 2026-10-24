import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { LinkedSummaryListComponent } from './linked-summary-list.component';
import { LinkedSummaryTextComponent } from './linked-summary-text.component';
import { LinkedSummaryTitleComponent } from './linked-summary-title.component';
import { LinkedSummaryComponent } from './linked-summary.component';

const meta: Meta<LinkedSummaryComponent> = {
  title: 'Data display/Linked summary',
  component: LinkedSummaryComponent,
  decorators: [
    moduleMetadata({
      imports: [
        LinkedSummaryTextComponent,
        LinkedSummaryTitleComponent,
        LinkedSummaryListComponent,
        ButtonComponent,
        IconComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <div libLinkedSummary style="max-width: 36rem">
        <div libLinkedSummaryText>
          <span libLinkedSummaryTitle>What visitors will see: 3 published notices, newest first</span>
          <ul libLinkedSummaryList>
            <li>Courtyard gathering · 18 October 2026</li>
            <li>Annual general meeting · 6 October 2026</li>
            <li>Fire drill on Thursday · 29 September 2026</li>
          </ul>
        </div>
        <a libButton href="#documents">Manage notices<svg libIcon="open-in-new"></svg></a>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<LinkedSummaryComponent>;

export const Notices: Story = {};

export const Directors: Story = {
  render: () => ({
    template: `
      <div libLinkedSummary style="max-width: 36rem">
        <div libLinkedSummaryText>
          <span libLinkedSummaryTitle>What visitors will see: 4 directors, in this order</span>
          <ul libLinkedSummaryList>
            <li>Rosalind Achebe, President</li>
            <li>Margit Halvorsen, Treasurer</li>
            <li>Dolores Quintero, Secretary</li>
            <li>June Okonkwo-Baptiste, Member at large</li>
          </ul>
        </div>
        <a libButton href="#board">Manage directors<svg libIcon="open-in-new"></svg></a>
      </div>`,
  }),
};

export const Empty: Story = {
  render: () => ({
    template: `
      <div libLinkedSummary style="max-width: 36rem">
        <div libLinkedSummaryText>
          <span libLinkedSummaryTitle>What visitors will see: no published notices</span>
          <p class="linked-summary__empty">Your message above shows instead. Publish a notice under Documents and it appears here.</p>
        </div>
        <a libButton href="#documents">Manage notices<svg libIcon="open-in-new"></svg></a>
      </div>`,
  }),
};
