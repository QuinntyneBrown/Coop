import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { AlertActionsComponent } from './alert-actions.component';
import { AlertBodyComponent } from './alert-body.component';
import { AlertComponent } from './alert.component';
import { AlertTitleComponent } from './alert-title.component';

const meta: Meta<AlertComponent> = {
  title: 'Feedback/Alert',
  component: AlertComponent,
  decorators: [
    moduleMetadata({
      imports: [
        AlertBodyComponent,
        AlertTitleComponent,
        AlertActionsComponent,
        IconComponent,
        ButtonComponent,
      ],
    }),
  ],
  argTypes: {
    tone: { control: 'inline-radio', options: ['success', 'danger'] },
  },
  args: { tone: 'success' },
  render: (args) => ({
    props: args,
    template: `
      <div libAlert [tone]="tone" [attr.role]="tone === 'danger' ? 'alert' : 'status'">
        <svg [libIcon]="tone === 'danger' ? 'error' : 'success'"></svg>
        <div libAlertBody>
          <p libAlertTitle>
            {{ tone === 'danger' ? 'Your maintenance request wasn’t sent.' : 'Your maintenance request is sent.' }}
          </p>
        </div>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<AlertComponent>;

export const Success: Story = {};

export const Danger: Story = {
  args: { tone: 'danger' },
  render: (args) => ({
    props: args,
    template: `
      <div libAlert [tone]="tone" role="alert">
        <svg libIcon="error"></svg>
        <div libAlertBody>
          <p libAlertTitle>Your maintenance request wasn’t sent.</p>
          <div>Check your connection and try again.</div>
        </div>
      </div>`,
  }),
};

export const SavedWithDetail: Story = {
  render: () => ({
    template: `
      <div libAlert tone="success" role="status">
        <svg libIcon="success"></svg>
        <div libAlertBody>
          <p libAlertTitle>“Autumn courtyard gathering” is published</p>
          <div>It was sent to members who asked for notices.</div>
        </div>
      </div>`,
  }),
};

export const FailedToSave: Story = {
  render: () => ({
    template: `
      <div libAlert tone="danger" role="alert">
        <svg libIcon="error"></svg>
        <div libAlertBody>
          <p libAlertTitle>Your booking for the common room wasn’t saved</p>
          <div>Your other bookings are still there. Check your connection and try again.</div>
        </div>
      </div>`,
  }),
};

export const FailedToLoad: Story = {
  render: () => ({
    template: `
      <div libAlert tone="danger" role="alert">
        <svg libIcon="error"></svg>
        <div libAlertBody>
          <p libAlertTitle>We couldn't load the board list.</p>
          <div>Check your connection and try again.</div>
          <div libAlertActions>
            <button libButton type="button" size="sm"><svg libIcon="try-again"></svg>Try again</button>
          </div>
        </div>
      </div>`,
  }),
};

export const LongTitle: Story = {
  render: () => ({
    template: `
      <div libAlert tone="danger" role="alert">
        <svg libIcon="error"></svg>
        <div libAlertBody>
          <p libAlertTitle>“Autumn courtyard gathering” is published, but it was not sent to members.</p>
          <div>Press Save to try again.</div>
        </div>
      </div>`,
  }),
};

export const BothTones: Story = {
  render: () => ({
    template: `
      <div class="stack">
        <div libAlert tone="success" role="status">
          <svg libIcon="success"></svg>
          <div libAlertBody>
            <p libAlertTitle>Your profile is saved.</p>
          </div>
        </div>
        <div libAlert tone="danger" role="alert">
          <svg libIcon="error"></svg>
          <div libAlertBody>
            <p libAlertTitle>Your new password wasn’t saved</p>
            <div>Your current password still works. Check your connection and try again.</div>
          </div>
        </div>
      </div>`,
  }),
};
