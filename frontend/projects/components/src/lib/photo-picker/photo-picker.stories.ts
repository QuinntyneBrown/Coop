import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AvatarComponent } from '../avatar/avatar.component';
import { AvatarImageComponent } from '../avatar/avatar-image.component';
import { ButtonComponent } from '../button/button.component';
import { FieldErrorComponent } from '../form-field/field-error.component';
import { FieldHelpComponent } from '../form-field/field-help.component';
import { IconComponent } from '../icon/icon.component';
import { PhotoPickerComponent } from './photo-picker.component';
import { PhotoPickerActionsComponent } from './photo-picker-actions.component';
import { PhotoPickerBodyComponent } from './photo-picker-body.component';

// A fictional portrait drawn inline, so the stories make no network requests.
const portrait =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" fill="#c9d8cf"/>' +
      '<circle cx="32" cy="25" r="12" fill="#8a6f5c"/>' +
      '<path d="M10 64c2-14 11-21 22-21s20 7 22 21z" fill="#4f6d7a"/>' +
      '</svg>',
  );

const meta: Meta<PhotoPickerComponent> = {
  title: 'Inputs/Photo picker',
  component: PhotoPickerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        PhotoPickerBodyComponent,
        PhotoPickerActionsComponent,
        AvatarComponent,
        AvatarImageComponent,
        ButtonComponent,
        IconComponent,
        FieldHelpComponent,
        FieldErrorComponent,
      ],
    }),
  ],
  render: () => ({
    template: `
      <div libPhotoPicker>
        <span libAvatar size="xl" role="img" aria-label="No photo yet. Showing the initials MF">MF</span>
        <div libPhotoPickerBody>
          <div libPhotoPickerActions>
            <label libButton variant="primary">
              <svg libIcon="camera"></svg>Choose a photo
              <input class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="pp-default-help" />
            </label>
          </div>
          <p libFieldHelp id="pp-default-help" role="status">JPEG, PNG or WebP, up to 10 MB.</p>
        </div>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<PhotoPickerComponent>;

export const NoPhoto: Story = {};

export const WithPhoto: Story = {
  render: () => ({
    props: { portrait },
    template: `
      <div libPhotoPicker>
        <span libAvatar size="xl" role="img" aria-label="Photo of Mira Fern">MF<img libAvatarImage [src]="portrait" alt="" /></span>
        <div libPhotoPickerBody>
          <div libPhotoPickerActions>
            <label libButton variant="primary">
              <svg libIcon="camera"></svg>Choose another
              <input class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="pp-photo-help" />
            </label>
            <button libButton type="button" variant="ghost"><svg libIcon="delete"></svg>Remove photo</button>
          </div>
          <p libFieldHelp id="pp-photo-help" role="status">JPEG, PNG or WebP, up to 10 MB.</p>
        </div>
      </div>`,
  }),
};

export const FocusOnChoose: Story = {
  render: () => ({
    template: `
      <div libPhotoPicker>
        <span libAvatar size="xl" role="img" aria-label="No photo yet. Showing the initials MF">MF</span>
        <div libPhotoPickerBody>
          <div libPhotoPickerActions>
            <label libButton variant="primary">
              <svg libIcon="camera"></svg>Choose a photo
              <input class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="pp-focus-help" />
            </label>
          </div>
          <p libFieldHelp id="pp-focus-help" role="status">JPEG, PNG or WebP, up to 10 MB.</p>
        </div>
      </div>`,
  }),
  play: async ({ canvasElement }) => canvasElement.querySelector('input')?.focus(),
};

export const FromAssetsLibrary: Story = {
  render: () => ({
    props: { portrait },
    template: `
      <div class="stack">
        <div libPhotoPicker>
          <span libAvatar size="xl" role="img" aria-label="No photo yet. Showing the initials JO">JO</span>
          <div libPhotoPickerBody>
            <div libPhotoPickerActions>
              <button libButton type="button" variant="primary" aria-haspopup="dialog" aria-describedby="pp-library-help">
                <svg libIcon="photo"></svg>Choose a photo
              </button>
            </div>
            <p libFieldHelp id="pp-library-help" role="status">
              Choose a portrait from the Assets library, or upload one. Without a photo, the website shows the director's
              initials.
            </p>
          </div>
        </div>
        <div libPhotoPicker>
          <span libAvatar size="xl" role="img" aria-label="Photo of Rosalind Achebe">RA<img libAvatarImage [src]="portrait" alt="" /></span>
          <div libPhotoPickerBody>
            <div libPhotoPickerActions>
              <button libButton type="button" variant="primary" aria-haspopup="dialog" aria-describedby="pp-library-photo-help">
                <svg libIcon="photo"></svg>Choose another
              </button>
              <button libButton type="button" variant="ghost"><svg libIcon="delete"></svg>Remove photo</button>
            </div>
            <p libFieldHelp id="pp-library-photo-help" role="status">
              Choose a portrait from the Assets library, or upload one. Without a photo, the website shows the director's
              initials.
            </p>
          </div>
        </div>
      </div>`,
  }),
};

export const Uploading: Story = {
  render: () => ({
    props: { portrait },
    template: `
      <div libPhotoPicker>
        <span libAvatar size="xl" role="img" aria-label="Photo of Mira Fern" aria-busy="true">MF<img libAvatarImage [src]="portrait" alt="" /></span>
        <div libPhotoPickerBody>
          <div libPhotoPickerActions>
            <label libButton variant="primary" aria-busy="true">
              <svg libIcon="camera"></svg>Choose another
              <input class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="pp-uploading-help" disabled />
            </label>
            <button libButton type="button" variant="ghost" disabled><svg libIcon="delete"></svg>Remove photo</button>
          </div>
          <p libFieldHelp id="pp-uploading-help" role="status">Uploading…</p>
        </div>
      </div>`,
  }),
};

export const TooLarge: Story = {
  render: () => ({
    template: `
      <div libPhotoPicker>
        <span libAvatar size="xl" role="img" aria-label="No photo yet. Showing the initials MF">MF</span>
        <div libPhotoPickerBody>
          <div libPhotoPickerActions>
            <label libButton variant="primary">
              <svg libIcon="camera"></svg>Choose a photo
              <input class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="pp-large-help pp-large-error" aria-invalid="true" />
            </label>
          </div>
          <p libFieldHelp id="pp-large-help" role="status">JPEG, PNG or WebP, up to 10 MB.</p>
          <p libFieldError id="pp-large-error">That photo is larger than 10 MB. Choose a smaller one.</p>
        </div>
      </div>`,
  }),
};

export const WrongKindOfFile: Story = {
  render: () => ({
    template: `
      <div libPhotoPicker>
        <span libAvatar size="xl" role="img" aria-label="No photo yet. Showing the initials MF">MF</span>
        <div libPhotoPickerBody>
          <div libPhotoPickerActions>
            <label libButton variant="primary">
              <svg libIcon="camera"></svg>Choose a photo
              <input class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="pp-kind-help pp-kind-error" aria-invalid="true" />
            </label>
          </div>
          <p libFieldHelp id="pp-kind-help" role="status">JPEG, PNG or WebP, up to 10 MB.</p>
          <p libFieldError id="pp-kind-error">That file is not a photo we can use. Choose a JPEG, PNG or WebP photo.</p>
        </div>
      </div>`,
  }),
};

export const UploadFailed: Story = {
  render: () => ({
    template: `
      <div libPhotoPicker>
        <span libAvatar size="xl" role="img" aria-label="No photo yet. Showing the initials MF">MF</span>
        <div libPhotoPickerBody>
          <div libPhotoPickerActions>
            <label libButton variant="primary">
              <svg libIcon="camera"></svg>Choose a photo
              <input class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="pp-failed-help pp-failed-error" aria-invalid="true" />
            </label>
          </div>
          <p libFieldHelp id="pp-failed-help" role="status">JPEG, PNG or WebP, up to 10 MB.</p>
          <p libFieldError id="pp-failed-error">We couldn't upload the photo. Try again.</p>
        </div>
      </div>`,
  }),
};

export const DisabledWhileSaving: Story = {
  render: () => ({
    props: { portrait },
    template: `
      <div libPhotoPicker>
        <span libAvatar size="xl" role="img" aria-label="Photo of Rosalind Achebe">RA<img libAvatarImage [src]="portrait" alt="" /></span>
        <div libPhotoPickerBody>
          <div libPhotoPickerActions>
            <button libButton type="button" variant="primary" aria-haspopup="dialog" aria-describedby="pp-saving-help" disabled>
              <svg libIcon="photo"></svg>Choose another
            </button>
            <button libButton type="button" variant="ghost" disabled><svg libIcon="delete"></svg>Remove photo</button>
          </div>
          <p libFieldHelp id="pp-saving-help" role="status">
            Choose a portrait from the Assets library, or upload one. Without a photo, the website shows the director's
            initials.
          </p>
        </div>
      </div>`,
  }),
};
