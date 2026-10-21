import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AlertComponent } from '../alert/alert.component';
import { AlertBodyComponent } from '../alert/alert-body.component';
import { AlertTitleComponent } from '../alert/alert-title.component';
import { ButtonComponent } from '../button/button.component';
import { DescriptionListComponent } from '../description-list/description-list.component';
import { FieldErrorComponent } from '../form-field/field-error.component';
import { FieldHelpComponent } from '../form-field/field-help.component';
import { FieldLabelComponent } from '../form-field/field-label.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { IconComponent } from '../icon/icon.component';
import { SelectComponent } from '../select/select.component';
import { TextFieldComponent } from '../text-field/text-field.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { DialogBodyComponent } from './dialog-body.component';
import { DialogFooterComponent } from './dialog-footer.component';
import { DialogHeaderComponent } from './dialog-header.component';
import { DialogIconComponent } from './dialog-icon.component';
import { DialogPanelComponent } from './dialog-panel.component';
import { DialogTitleComponent } from './dialog-title.component';
import { DialogComponent } from './dialog.component';

// A template ref on <dialog libDialog> names the DialogComponent, not the element, so each story
// keeps a ref on a plain wrapper <div #s> and finds its dialogs through it.
const meta: Meta<DialogComponent> = {
  title: 'Containers and overlays/Dialog',
  component: DialogComponent,
  decorators: [
    moduleMetadata({
      imports: [
        DialogPanelComponent,
        DialogHeaderComponent,
        DialogTitleComponent,
        DialogIconComponent,
        DialogBodyComponent,
        DialogFooterComponent,
        ButtonComponent,
        IconComponent,
        FormFieldComponent,
        FieldLabelComponent,
        FieldHelpComponent,
        FieldErrorComponent,
        TextFieldComponent,
        TextareaComponent,
        SelectComponent,
        AlertComponent,
        AlertBodyComponent,
        AlertTitleComponent,
        DescriptionListComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <div #s>
        <button libButton type="button" variant="danger" (click)="s.querySelector('#dlg-anat').showModal()">
          Remove page
        </button>
        <dialog libDialog id="dlg-anat" role="alertdialog" aria-labelledby="dlg-anat-title" aria-describedby="dlg-anat-desc">
          <div libDialogPanel>
            <div libDialogHeader>
              <div libDialogIcon><svg libIcon="delete"></svg></div>
              <h2 libDialogTitle id="dlg-anat-title">Remove “Our garden”?</h2>
              <button libButton type="button" variant="ghost" iconOnly aria-label="Close" (click)="s.querySelector('#dlg-anat').close()">
                <svg libIcon="close"></svg>
              </button>
            </div>
            <div libDialogBody>
              <p id="dlg-anat-desc">It leaves the website menu straight away. You can add it again later.</p>
            </div>
            <div libDialogFooter>
              <button libButton type="button" autofocus (click)="s.querySelector('#dlg-anat').close()">Cancel</button>
              <button libButton type="button" variant="danger" (click)="s.querySelector('#dlg-anat').close()">
                Remove page
              </button>
            </div>
          </div>
        </dialog>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<DialogComponent>;

const openFirstDialog: Story['play'] = async ({ canvasElement }) => {
  canvasElement.querySelector('dialog')?.showModal();
};

export const Default: Story = { play: openFirstDialog };

export const DestructiveConfirmation: Story = {
  render: () => ({
    template: `
      <div #s>
        <button libButton type="button" variant="danger" (click)="s.querySelector('#dlg-ud').showModal()">
          Delete user
        </button>
        <dialog libDialog id="dlg-ud" role="alertdialog" aria-labelledby="dlg-ud-title" aria-describedby="dlg-ud-desc">
          <div libDialogPanel>
            <div libDialogHeader>
              <div libDialogIcon><svg libIcon="delete"></svg></div>
              <h2 libDialogTitle id="dlg-ud-title">Delete the user mira.fern?</h2>
              <button libButton type="button" variant="ghost" iconOnly aria-label="Close" (click)="s.querySelector('#dlg-ud').close()">
                <svg libIcon="close"></svg>
              </button>
            </div>
            <div libDialogBody>
              <p id="dlg-ud-desc"><strong>mira.fern</strong> will no longer be able to sign in. This can’t be undone.</p>
            </div>
            <div libDialogFooter>
              <button libButton type="button" autofocus (click)="s.querySelector('#dlg-ud').close()">Cancel</button>
              <button libButton type="button" variant="danger" (click)="s.querySelector('#dlg-ud').close()">
                Delete user
              </button>
            </div>
          </div>
        </dialog>
      </div>`,
  }),
  play: openFirstDialog,
};

export const FormAddUser: Story = {
  render: () => ({
    template: `
      <div #s>
        <button libButton type="button" variant="primary" (click)="s.querySelector('#dlg-uc').showModal()">
          <svg libIcon="person-add"></svg>Add a user
        </button>
        <dialog libDialog id="dlg-uc" aria-labelledby="dlg-uc-title">
          <form libDialogPanel method="dialog" novalidate>
            <div libDialogHeader>
              <h2 libDialogTitle id="dlg-uc-title">Add a user</h2>
              <button libButton type="button" variant="ghost" iconOnly aria-label="Close" (click)="s.querySelector('#dlg-uc').close()">
                <svg libIcon="close"></svg>
              </button>
            </div>
            <div libDialogBody class="stack">
              <div libFormField>
                <label libFieldLabel for="dlg-uc-username">Username</label>
                <p libFieldHelp id="dlg-uc-username-help">Lower case, with a dot between names, such as oren.reed.</p>
                <input
                  libTextField
                  id="dlg-uc-username"
                  type="text"
                  autocomplete="off"
                  spellcheck="false"
                  required
                  autofocus
                  aria-describedby="dlg-uc-username-help"
                />
              </div>
              <div libFormField>
                <label libFieldLabel for="dlg-uc-role">Role</label>
                <select libSelect id="dlg-uc-role">
                  <option>Member</option>
                  <option>Board member</option>
                  <option>System administrator</option>
                </select>
              </div>
              <div libFormField>
                <label libFieldLabel for="dlg-uc-password">Password</label>
                <p libFieldHelp id="dlg-uc-password-help">They can change it after they sign in.</p>
                <input
                  libTextField
                  id="dlg-uc-password"
                  type="password"
                  autocomplete="new-password"
                  required
                  aria-describedby="dlg-uc-password-help"
                />
              </div>
            </div>
            <div libDialogFooter>
              <button libButton type="button" (click)="s.querySelector('#dlg-uc').close()">Cancel</button>
              <button libButton type="submit" variant="primary">Add user</button>
            </div>
          </form>
        </dialog>
      </div>`,
  }),
  play: openFirstDialog,
};

export const FormEditWebsiteBlock: Story = {
  render: () => ({
    template: `
      <div #s>
        <button libButton type="button" (click)="s.querySelector('#dlg-ce').showModal()">
          <svg libIcon="edit"></svg>Edit Hero
        </button>
        <dialog libDialog id="dlg-ce" aria-labelledby="dlg-ce-title" aria-describedby="dlg-ce-desc">
          <form libDialogPanel method="dialog" novalidate>
            <div libDialogHeader>
              <div style="flex: 1">
                <h2 libDialogTitle id="dlg-ce-title">Edit Hero</h2>
                <p class="text-muted" id="dlg-ce-desc" style="margin-top: var(--space-1)">
                  Changes show on the website as soon as you save.
                </p>
              </div>
              <button libButton type="button" variant="ghost" iconOnly aria-label="Close" (click)="s.querySelector('#dlg-ce').close()">
                <svg libIcon="close"></svg>
              </button>
            </div>
            <div libDialogBody class="stack">
              <div libFormField>
                <label libFieldLabel for="dlg-ce-eyebrow">
                  Small heading above the title <span class="optional">(optional)</span>
                </label>
                <input
                  libTextField
                  id="dlg-ce-eyebrow"
                  type="text"
                  autocomplete="off"
                  autofocus
                  value="A co-operative for older women"
                />
              </div>
              <div libFormField>
                <label libFieldLabel for="dlg-ce-title-field">Title</label>
                <input libTextField id="dlg-ce-title-field" type="text" autocomplete="off" required value="A home of our own" />
              </div>
              <div libFormField>
                <label libFieldLabel for="dlg-ce-lead">Introduction <span class="optional">(optional)</span></label>
                <textarea libTextarea id="dlg-ce-lead" rows="3">Bright apartments, a rooftop garden, and neighbours who look out for one another.</textarea>
              </div>
              <fieldset class="stack">
                <legend libFieldLabel>Main button</legend>
                <div libFormField>
                  <label libFieldLabel for="dlg-ce-btn-label">Label</label>
                  <input libTextField id="dlg-ce-btn-label" type="text" autocomplete="off" required value="Book a visit" />
                </div>
                <div libFormField>
                  <label libFieldLabel for="dlg-ce-btn-href">Address</label>
                  <p libFieldHelp id="dlg-ce-btn-href-help">
                    A page on this site such as /#visit, a web address, an e-mail address or a phone number.
                  </p>
                  <input
                    libTextField
                    id="dlg-ce-btn-href"
                    type="text"
                    inputmode="url"
                    spellcheck="false"
                    autocomplete="off"
                    required
                    value="/#visit"
                    aria-describedby="dlg-ce-btn-href-help"
                  />
                </div>
              </fieldset>
            </div>
            <div libDialogFooter>
              <button libButton type="button" (click)="s.querySelector('#dlg-ce').close()">Cancel</button>
              <button libButton type="submit" variant="primary">Save changes</button>
            </div>
          </form>
        </dialog>
      </div>`,
  }),
  play: openFirstDialog,
};

export const DocumentViewer: Story = {
  render: () => ({
    template: `
      <div #s>
        <button libButton type="button" (click)="s.querySelector('#dlg-dv').showModal()">
          Read the notice
        </button>
        <dialog libDialog id="dlg-dv" aria-labelledby="dlg-dv-title">
          <div libDialogPanel>
            <div libDialogHeader>
              <h2 libDialogTitle id="dlg-dv-title" tabindex="-1" autofocus>Autumn courtyard gathering</h2>
              <button libButton type="button" variant="ghost" iconOnly aria-label="Close" (click)="s.querySelector('#dlg-dv').close()">
                <svg libIcon="close"></svg>
              </button>
            </div>
            <div libDialogBody class="stack">
              <p class="text-caption">Notice · Tue 13 Oct</p>
              <p>Join your neighbours in the courtyard on Saturday at 2 pm. Bring a mug and a story to share.</p>
            </div>
            <div libDialogFooter>
              <button libButton type="button" (click)="s.querySelector('#dlg-dv').close()">Close</button>
              <button libButton type="button" variant="primary"><svg libIcon="download"></svg>Download</button>
            </div>
          </div>
        </dialog>
      </div>`,
  }),
  play: openFirstDialog,
};

export const AssetDetails: Story = {
  render: () => ({
    template: `
      <div #s>
        <button libButton type="button" (click)="s.querySelector('#dlg-ad').showModal()">
          Open “Courtyard plan.pdf”
        </button>
        <dialog libDialog id="dlg-ad" aria-labelledby="dlg-ad-title">
          <div libDialogPanel>
            <div libDialogHeader>
              <h2 libDialogTitle id="dlg-ad-title" tabindex="-1" autofocus>Courtyard plan.pdf</h2>
              <button libButton type="button" variant="ghost" iconOnly aria-label="Close" (click)="s.querySelector('#dlg-ad').close()">
                <svg libIcon="close"></svg>
              </button>
            </div>
            <div libDialogBody>
              <dl libDescriptionList horizontal>
                <dt>File name</dt>
                <dd>Courtyard plan.pdf</dd>
                <dt>Size</dt>
                <dd>2 KB</dd>
                <dt>Uploaded</dt>
                <dd>Tue 13 Oct, 8:00 am</dd>
              </dl>
            </div>
            <div libDialogFooter>
              <button
                libButton
                type="button"
                variant="danger"
                style="margin-right: auto"
                (click)="s.querySelector('#dlg-ad-delete').showModal()"
              >
                Delete<span class="visually-hidden"> Courtyard plan.pdf</span>
              </button>
              <button libButton type="button" (click)="s.querySelector('#dlg-ad').close()">Close</button>
              <button libButton type="button" variant="primary"><svg libIcon="download"></svg>Download</button>
            </div>
          </div>
        </dialog>
        <dialog
          libDialog
          id="dlg-ad-delete"
          role="alertdialog"
          aria-labelledby="dlg-ad-delete-title"
          aria-describedby="dlg-ad-delete-desc"
        >
          <div libDialogPanel>
            <div libDialogHeader>
              <div libDialogIcon><svg libIcon="delete"></svg></div>
              <h2 libDialogTitle id="dlg-ad-delete-title">Delete “Courtyard plan.pdf”?</h2>
              <button libButton type="button" variant="ghost" iconOnly aria-label="Close" (click)="s.querySelector('#dlg-ad-delete').close()">
                <svg libIcon="close"></svg>
              </button>
            </div>
            <div libDialogBody>
              <p id="dlg-ad-delete-desc">Pages that show this file will no longer have it. This can’t be undone.</p>
            </div>
            <div libDialogFooter>
              <button libButton type="button" autofocus (click)="s.querySelector('#dlg-ad-delete').close()">
                Cancel
              </button>
              <button libButton type="button" variant="danger" (click)="s.querySelector('#dlg-ad-delete').close()">
                Delete asset
              </button>
            </div>
          </div>
        </dialog>
      </div>`,
  }),
  play: openFirstDialog,
};

// Delete in the asset details opens the destructive confirmation over the details.
export const Stacked: Story = {
  render: AssetDetails.render,
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLDialogElement>('#dlg-ad')?.showModal();
    canvasElement.querySelector<HTMLDialogElement>('#dlg-ad-delete')?.showModal();
  },
};

export const Busy: Story = {
  render: () => ({
    template: `
      <div #s>
        <button libButton type="button" variant="danger" (click)="s.querySelector('#dlg-busy').showModal()">
          Remove director
        </button>
        <dialog libDialog id="dlg-busy" aria-labelledby="dlg-busy-title" (cancel)="$event.preventDefault()">
          <div libDialogPanel>
            <div libDialogHeader>
              <h2 libDialogTitle id="dlg-busy-title">Remove a director</h2>
              <button libButton type="button" variant="ghost" iconOnly aria-label="Close" disabled>
                <svg libIcon="close"></svg>
              </button>
            </div>
            <div libDialogBody>
              <p>Remove “Dolores Quintero” from the board list? They leave the home page straight away.</p>
            </div>
            <div libDialogFooter>
              <button libButton type="button" disabled>Cancel</button>
              <button libButton type="button" variant="danger" disabled aria-busy="true">Removing…</button>
            </div>
          </div>
        </dialog>
      </div>`,
  }),
  play: openFirstDialog,
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div #s>
        <button libButton type="button" variant="primary" (click)="s.querySelector('#dlg-inv').showModal()">
          <svg libIcon="add"></svg>New page
        </button>
        <dialog libDialog id="dlg-inv" aria-labelledby="dlg-inv-title">
          <form libDialogPanel novalidate (submit)="$event.preventDefault()">
            <div libDialogHeader>
              <h2 libDialogTitle id="dlg-inv-title">New page</h2>
              <button libButton type="button" variant="ghost" iconOnly aria-label="Close" (click)="s.querySelector('#dlg-inv').close()">
                <svg libIcon="close"></svg>
              </button>
            </div>
            <div libDialogBody class="stack">
              <div libAlert tone="danger" class="form-summary" role="alert" tabindex="-1" autofocus>
                <svg libIcon="error"></svg>
                <div libAlertBody>
                  <p libAlertTitle>Two things need attention before the page can be saved</p>
                  <ol>
                    <li><a href="#dlg-inv-page">Give the page a title</a></li>
                    <li><a href="#dlg-inv-text">Write something for the page</a></li>
                  </ol>
                </div>
              </div>
              <div libFormField>
                <label libFieldLabel for="dlg-inv-page">Page title</label>
                <input
                  libTextField
                  id="dlg-inv-page"
                  type="text"
                  autocomplete="off"
                  required
                  aria-invalid="true"
                  aria-describedby="dlg-inv-page-error"
                />
                <p libFieldError id="dlg-inv-page-error">Give the page a title</p>
              </div>
              <div libFormField>
                <label libFieldLabel for="dlg-inv-text">Page text</label>
                <textarea
                  libTextarea
                  id="dlg-inv-text"
                  rows="3"
                  required
                  aria-invalid="true"
                  aria-describedby="dlg-inv-text-error"
                ></textarea>
                <p libFieldError id="dlg-inv-text-error">Write something for the page</p>
              </div>
            </div>
            <div libDialogFooter>
              <button libButton type="button" (click)="s.querySelector('#dlg-inv').close()">Cancel</button>
              <button libButton type="submit" variant="primary">Save page</button>
            </div>
          </form>
        </dialog>
      </div>`,
  }),
  play: openFirstDialog,
};

export const Failed: Story = {
  render: () => ({
    template: `
      <div #s>
        <button libButton type="button" (click)="s.querySelector('#dlg-fail').showModal()">
          <svg libIcon="edit"></svg>Edit Hero
        </button>
        <dialog libDialog id="dlg-fail" aria-labelledby="dlg-fail-title">
          <form libDialogPanel novalidate (submit)="$event.preventDefault()">
            <div libDialogHeader>
              <h2 libDialogTitle id="dlg-fail-title">Edit Hero</h2>
              <button libButton type="button" variant="ghost" iconOnly aria-label="Close" (click)="s.querySelector('#dlg-fail').close()">
                <svg libIcon="close"></svg>
              </button>
            </div>
            <div libDialogBody class="stack">
              <div libAlert tone="danger" role="alert">
                <svg libIcon="error"></svg>
                <div libAlertBody>
                  <p libAlertTitle>Your changes weren’t saved</p>
                  <p>The website didn’t answer. What you typed is still here; try again.</p>
                </div>
              </div>
              <div libFormField>
                <label libFieldLabel for="dlg-fail-title-field">Title</label>
                <input libTextField id="dlg-fail-title-field" type="text" autocomplete="off" value="A home of our own" />
              </div>
            </div>
            <div libDialogFooter>
              <button libButton type="button" (click)="s.querySelector('#dlg-fail').close()">Cancel</button>
              <button libButton type="submit" variant="primary">Save changes</button>
            </div>
          </form>
        </dialog>
      </div>`,
  }),
  play: openFirstDialog,
};
