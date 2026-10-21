import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { CardTitleComponent } from '../card/card-title.component';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogBodyComponent } from '../dialog/dialog-body.component';
import { DialogFooterComponent } from '../dialog/dialog-footer.component';
import { DialogHeaderComponent } from '../dialog/dialog-header.component';
import { DialogPanelComponent } from '../dialog/dialog-panel.component';
import { DialogTitleComponent } from '../dialog/dialog-title.component';
import { LoadingComponent } from '../spinner/loading.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { DescriptionListComponent } from './description-list.component';

const meta: Meta<DescriptionListComponent> = {
  title: 'Data display/Description list',
  component: DescriptionListComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ButtonComponent,
        CardComponent,
        CardTitleComponent,
        DialogComponent,
        DialogPanelComponent,
        DialogHeaderComponent,
        DialogTitleComponent,
        DialogBodyComponent,
        DialogFooterComponent,
        LoadingComponent,
        SpinnerComponent,
      ],
    }),
  ],
  argTypes: {
    horizontal: { control: 'boolean' },
  },
  args: { horizontal: false },
  render: (args) => ({
    props: args,
    template: `
      <dl libDescriptionList [horizontal]="horizontal">
        <dt>File name</dt><dd>Garden plan.pdf</dd>
        <dt>Size</dt><dd>2 KB</dd>
        <dt>Uploaded</dt><dd>Tue 13 Oct, 8:00 am</dd>
      </dl>`,
  }),
};

export default meta;
type Story = StoryObj<DescriptionListComponent>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  render: () => ({
    template: `
      <section libCard aria-labelledby="dl-request-title">
        <h2 libCardTitle id="dl-request-title">Kitchen tap leak</h2>
        <dl libDescriptionList horizontal>
          <dt>Sent by</dt><dd>Mira Fern</dd>
          <dt>Sent</dt><dd>Tue 13 Oct, 8:00 am</dd>
          <dt>Priority</dt><dd>High</dd>
          <dt>Address</dt><dd>Unit 101</dd>
          <dt>Phone</dt><dd><a href="tel:555-0101">555-0101</a></dd>
          <dt>Entry when no one is home</dt><dd>No</dd>
        </dl>
      </section>`,
  }),
};

export const Profile: Story = {
  render: () => ({
    template: `
      <section libCard aria-labelledby="dl-profile-title">
        <h2 libCardTitle id="dl-profile-title">Mira Fern</h2>
        <dl libDescriptionList horizontal>
          <dt>Username</dt><dd>mira.fern</dd>
          <dt>E-mail</dt><dd><a href="mailto:mira@example.invalid">mira@example.invalid</a></dd>
          <dt>Phone</dt><dd>555-0101</dd>
          <dt>Address</dt><dd>101 Fictional Court</dd>
        </dl>
      </section>`,
  }),
};

export const InDialog: Story = {
  render: () => ({
    template: `
      <button libButton type="button" (click)="d.showModal()">View asset details</button>
      <dialog libDialog #d aria-labelledby="dl-asset-title">
        <div libDialogPanel>
          <div libDialogHeader><h2 libDialogTitle id="dl-asset-title">Asset details</h2></div>
          <div libDialogBody>
            <dl libDescriptionList>
              <dt>File name</dt><dd>Garden plan.pdf</dd>
              <dt>Size</dt><dd>2 KB</dd>
              <dt>Uploaded</dt><dd>Tue 13 Oct, 8:00 am</dd>
            </dl>
          </div>
          <div libDialogFooter>
            <button libButton type="button" variant="danger">Delete</button>
            <button libButton type="button" (click)="d.close()">Close</button>
            <button libButton type="button" variant="primary">Download</button>
          </div>
        </div>
      </dialog>`,
  }),
  play: async ({ canvasElement }) => canvasElement.querySelector('dialog')?.showModal(),
};

export const ValueMissing: Story = {
  render: () => ({
    template: `
      <dl libDescriptionList horizontal>
        <dt>Phone</dt><dd>555-0101</dd>
        <dt>Address</dt><dd class="text-muted">Not given</dd>
      </dl>`,
  }),
};

export const LongValue: Story = {
  render: () => ({
    template: `
      <div style="max-width: 16rem">
        <dl libDescriptionList>
          <dt>E-mail</dt><dd>mira.fern.housing.committee@example.invalid</dd>
        </dl>
      </div>`,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `<div libLoading role="status"><span libSpinner></span>Loading profile…</div>`,
  }),
};
