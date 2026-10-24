import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { PreviewPaneFrameComponent } from './preview-pane-frame.component';
import { PreviewPaneHeaderComponent } from './preview-pane-header.component';
import { PreviewPaneNoteComponent } from './preview-pane-note.component';
import { PreviewPaneTitleComponent } from './preview-pane-title.component';
import { PreviewPaneComponent } from './preview-pane.component';

const meta: Meta<PreviewPaneComponent> = {
  title: 'Layout/Preview pane',
  component: PreviewPaneComponent,
  decorators: [
    moduleMetadata({
      imports: [
        PreviewPaneHeaderComponent,
        PreviewPaneTitleComponent,
        PreviewPaneNoteComponent,
        PreviewPaneFrameComponent,
        ButtonComponent,
        IconComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <section libPreviewPane aria-labelledby="preview-title">
        <div libPreviewPaneHeader>
          <h2 libPreviewPaneTitle id="preview-title"><svg libIcon="show"></svg>Preview</h2>
          <a libButton size="sm" href="about:blank" target="_blank" rel="noopener"><svg libIcon="open-in-new"></svg>Open in a new tab<span class="visually-hidden"> (opens in a new tab)</span></a>
        </div>
        <p libPreviewPaneNote>Shows your draft, scrolled to the section you are editing. Visitors see the published website.</p>
        <iframe libPreviewPaneFrame src="about:blank" title="Preview of the public website with your draft"></iframe>
      </section>`,
  }),
};

export default meta;
type Story = StoryObj<PreviewPaneComponent>;

export const Default: Story = {};
