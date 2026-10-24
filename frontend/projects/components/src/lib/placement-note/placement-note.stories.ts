import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { IconComponent } from '../icon/icon.component';
import { PlacementNoteComponent } from './placement-note.component';

const meta: Meta<PlacementNoteComponent> = {
  title: 'Feedback/Placement note',
  component: PlacementNoteComponent,
  decorators: [moduleMetadata({ imports: [IconComponent] })],
  render: () => ({
    template: `<p libPlacementNote><svg libIcon="place" size="sm"></svg><span>Appears first on the home page, under the menu.</span></p>`,
  }),
};

export default meta;
type Story = StoryObj<PlacementNoteComponent>;

export const Default: Story = {};

export const Footer: Story = {
  render: () => ({
    template: `<p libPlacementNote><svg libIcon="place" size="sm"></svg><span>Appears at the bottom of every page.</span></p>`,
  }),
};
