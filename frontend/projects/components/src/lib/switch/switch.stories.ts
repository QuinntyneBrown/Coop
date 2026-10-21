import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AlertBodyComponent } from '../alert/alert-body.component';
import { AlertTitleComponent } from '../alert/alert-title.component';
import { AlertComponent } from '../alert/alert.component';
import { IconComponent } from '../icon/icon.component';
import { TableWrapComponent } from '../table/table-wrap.component';
import { TableComponent } from '../table/table.component';
import { SwitchComponent } from './switch.component';

const meta: Meta<SwitchComponent> = {
  title: 'Inputs/Switch',
  component: SwitchComponent,
  decorators: [
    moduleMetadata({
      imports: [
        TableComponent,
        TableWrapComponent,
        AlertComponent,
        AlertBodyComponent,
        AlertTitleComponent,
        IconComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <label libSwitch>
        <input type="checkbox" role="switch" name="maint-read" />
        <span class="switch__text">Read maintenance requests</span>
      </label>`,
  }),
};

export default meta;
type Story = StoryObj<SwitchComponent>;

export const Off: Story = {};

export const On: Story = {
  render: () => ({
    template: `
      <label libSwitch>
        <input type="checkbox" role="switch" name="maint-read-on" checked />
        <span class="switch__text">Read maintenance requests</span>
      </label>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="stack">
        <label libSwitch>
          <input type="checkbox" role="switch" name="maint-write-disabled" disabled />
          <span class="switch__text">Write maintenance requests</span>
        </label>
        <label libSwitch>
          <input type="checkbox" role="switch" name="doc-read-disabled" checked disabled />
          <span class="switch__text">Read documents</span>
        </label>
      </div>`,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div class="stack">
        <label libSwitch>
          <input type="checkbox" role="switch" name="state-delete" />
          <span class="switch__text">Delete maintenance requests</span>
        </label>
        <label libSwitch>
          <input type="checkbox" role="switch" name="state-read" checked />
          <span class="switch__text">Read maintenance requests</span>
        </label>
        <label libSwitch>
          <input type="checkbox" role="switch" name="state-write" disabled />
          <span class="switch__text">Write maintenance requests</span>
        </label>
        <label libSwitch>
          <input type="checkbox" role="switch" name="state-docs" checked disabled />
          <span class="switch__text">Read documents</span>
        </label>
      </div>`,
  }),
};

export const LongLabel: Story = {
  render: () => ({
    template: `
      <div style="max-width: 20rem">
        <label libSwitch>
          <input type="checkbox" role="switch" name="maint-create-long" checked />
          <span class="switch__text">Create maintenance requests for any home in the co-op, not only her own</span>
        </label>
      </div>`,
  }),
};

export const PrivilegeGrid: Story = {
  render: () => ({
    template: `
      <div libTableWrap>
        <table libTable>
          <caption class="visually-hidden">Member privileges</caption>
          <thead>
            <tr>
              <th scope="col">Area</th>
              <th scope="col" id="sw-col-read">Read</th>
              <th scope="col" id="sw-col-write">Write</th>
              <th scope="col" id="sw-col-create">Create</th>
              <th scope="col" id="sw-col-delete">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" id="sw-row-user">User</th>
              <td><label libSwitch><input type="checkbox" role="switch" checked aria-labelledby="sw-col-read sw-row-user" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" aria-labelledby="sw-col-write sw-row-user" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" checked aria-labelledby="sw-col-create sw-row-user" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" aria-labelledby="sw-col-delete sw-row-user" /></label></td>
            </tr>
            <tr>
              <th scope="row" id="sw-row-maint">Maintenance request</th>
              <td><label libSwitch><input type="checkbox" role="switch" checked aria-labelledby="sw-col-read sw-row-maint" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" aria-labelledby="sw-col-write sw-row-maint" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" checked aria-labelledby="sw-col-create sw-row-maint" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" aria-labelledby="sw-col-delete sw-row-maint" /></label></td>
            </tr>
            <tr>
              <th scope="row" id="sw-row-doc">Document</th>
              <td><label libSwitch><input type="checkbox" role="switch" checked aria-labelledby="sw-col-read sw-row-doc" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" aria-labelledby="sw-col-write sw-row-doc" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" checked aria-labelledby="sw-col-create sw-row-doc" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" aria-labelledby="sw-col-delete sw-row-doc" /></label></td>
            </tr>
            <tr>
              <th scope="row" id="sw-row-profile">Profile</th>
              <td><label libSwitch><input type="checkbox" role="switch" checked aria-labelledby="sw-col-read sw-row-profile" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" aria-labelledby="sw-col-write sw-row-profile" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" checked aria-labelledby="sw-col-create sw-row-profile" /></label></td>
              <td><label libSwitch><input type="checkbox" role="switch" aria-labelledby="sw-col-delete sw-row-profile" /></label></td>
            </tr>
          </tbody>
        </table>
      </div>`,
  }),
};

export const NotSaved: Story = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 32rem">
        <div libAlert tone="danger" role="alert">
          <svg libIcon="error"></svg>
          <div libAlertBody>
            <p libAlertTitle>That change wasn't saved</p>
            <p>Members still can't delete maintenance requests. Try again.</p>
          </div>
        </div>
        <label libSwitch>
          <input type="checkbox" role="switch" name="maint-delete-not-saved" />
          <span class="switch__text">Delete maintenance requests</span>
        </label>
      </div>`,
  }),
};
