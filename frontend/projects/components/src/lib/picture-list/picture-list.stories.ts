import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { FieldErrorComponent } from '../form-field/field-error.component';
import { FieldHelpComponent } from '../form-field/field-help.component';
import { IconComponent } from '../icon/icon.component';
import { PictureListComponent } from './picture-list.component';
import { PictureListAddComponent } from './picture-list-add.component';
import { PictureListChoiceComponent } from './picture-list-choice.component';
import { PictureListGridComponent } from './picture-list-grid.component';
import { PictureListItemComponent } from './picture-list-item.component';
import { PictureListNoteComponent } from './picture-list-note.component';
import { PictureListThumbComponent } from './picture-list-thumb.component';

// Fictional pictures drawn inline, so the stories make no network requests.
const svg = (body: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body}</svg>`);

const photos = {
  tap: svg(
    '<rect width="64" height="64" fill="#d7e3ea"/>' +
      '<path d="M18 22h22v8H30v6h-6v-6h-6z" fill="#5f7480"/>' +
      '<circle cx="27" cy="44" r="3" fill="#3f8fc4"/>',
  ),
  sink: svg(
    '<rect width="64" height="64" fill="#e6ded3"/>' +
      '<rect x="10" y="30" width="44" height="16" rx="6" fill="#9aa7ad"/>' +
      '<path d="M30 14h4v16h-4z" fill="#5f7480"/>',
  ),
  portrait: svg(
    '<rect width="64" height="64" fill="#c9d8cf"/>' +
      '<circle cx="32" cy="25" r="12" fill="#8a6f5c"/>' +
      '<path d="M10 64c2-14 11-21 22-21s20 7 22 21z" fill="#4f6d7a"/>',
  ),
};

const current = `border-color: var(--color-accent); box-shadow: 0 0 0 var(--border-width-thick) var(--color-accent);`;
const currentTag = `<span class="cluster" style="gap: var(--space-1); color: var(--color-fg-accent); font: var(--text-label);"><svg libIcon="check" size="sm"></svg>Current</span>`;
const fileName = `font: var(--text-label); overflow-wrap: anywhere;`;
const fileIcon = `display: grid; place-items: center; color: var(--color-fg-muted);`;

const choices = (disabled: boolean) => `
        <ul libPictureListGrid aria-label="Photos in the Assets library">
          <li>
            <button libPictureListChoice type="button" aria-pressed="true" style="${current}"${disabled ? ' disabled' : ''}>
              <img [src]="photos.portrait" alt="" /><span>portrait.svg</span>${currentTag}
            </button>
          </li>
          <li>
            <button libPictureListChoice type="button" aria-pressed="false"${disabled ? ' disabled' : ''}>
              <img [src]="photos.tap" alt="" /><span>tap.svg</span>
            </button>
          </li>
          <li>
            <button libPictureListChoice type="button" aria-pressed="false"${disabled ? ' disabled' : ''}>
              <img [src]="photos.sink" alt="" /><span>sink.svg</span>
            </button>
          </li>
        </ul>`;

const upload = (id: string, extra = '') => `
        <div libPictureListAdd>
          <label libButton size="sm">
            <svg libIcon="upload"></svg>Upload a new photo
            <input class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="${id}"${extra} />
          </label>
        </div>`;

const meta: Meta<PictureListComponent> = {
  title: 'Data display/Picture list',
  component: PictureListComponent,
  decorators: [
    moduleMetadata({
      imports: [
        PictureListGridComponent,
        PictureListItemComponent,
        PictureListThumbComponent,
        PictureListNoteComponent,
        PictureListAddComponent,
        PictureListChoiceComponent,
        ButtonComponent,
        IconComponent,
        FieldHelpComponent,
        FieldErrorComponent,
      ],
    }),
  ],
  render: () => ({
    props: { photos },
    template: `
      <div libPictureList>
        <ul libPictureListGrid aria-label="Assets">
          <li libPictureListItem>
            <div libPictureListThumb><img [src]="photos.tap" alt="" /></div>
            <p style="${fileName}">tap.svg</p>
            <span libPictureListNote>3 KB · Tue 13 Oct</span>
            <div><button libButton type="button" size="sm" aria-haspopup="dialog" aria-label="Details for tap.svg">Details</button></div>
          </li>
          <li libPictureListItem>
            <div libPictureListThumb><img [src]="photos.sink" alt="" /></div>
            <p style="${fileName}">sink.svg</p>
            <span libPictureListNote>3 KB · Tue 13 Oct</span>
            <div><button libButton type="button" size="sm" aria-haspopup="dialog" aria-label="Details for sink.svg">Details</button></div>
          </li>
          <li libPictureListItem>
            <div libPictureListThumb><img [src]="photos.portrait" alt="" /></div>
            <p style="${fileName}">portrait.svg</p>
            <span libPictureListNote>2 KB · Mon 12 Oct</span>
            <div><button libButton type="button" size="sm" aria-haspopup="dialog" aria-label="Details for portrait.svg">Details</button></div>
          </li>
          <li libPictureListItem>
            <div libPictureListThumb style="${fileIcon}"><svg libIcon="documents" size="lg"></svg></div>
            <p style="${fileName}">Garden plan.pdf</p>
            <span libPictureListNote>2 KB · Tue 13 Oct</span>
            <div><button libButton type="button" size="sm" aria-haspopup="dialog" aria-label="Details for Garden plan.pdf">Details</button></div>
          </li>
          <li libPictureListItem>
            <div libPictureListThumb style="${fileIcon}"><svg libIcon="documents" size="lg"></svg></div>
            <p style="${fileName}">Meeting notes.pdf</p>
            <span libPictureListNote>2 KB · Tue 13 Oct</span>
            <div><button libButton type="button" size="sm" aria-haspopup="dialog" aria-label="Details for Meeting notes.pdf">Details</button></div>
          </li>
        </ul>
      </div>`,
  }),
};

export default meta;
type Story = StoryObj<PictureListComponent>;

export const Library: Story = {};

export const ChooseOne: Story = {
  render: () => ({
    props: { photos },
    template: `
      <div libPictureList style="max-width: 32rem">${choices(false)}${upload('pl-choose-help')}
        <p libFieldHelp id="pl-choose-help" role="status">JPEG, PNG or WebP, up to 10 MB.</p>
      </div>`,
  }),
};

export const AttachedPhotos: Story = {
  render: () => ({
    props: { photos },
    template: `
      <ul libPictureListGrid aria-label="Photos" style="max-width: 24rem">
        <li libPictureListItem>
          <a libPictureListThumb style="display: block" [href]="photos.tap">
            <img [src]="photos.tap" alt="Photo 1 of Kitchen tap leak" />
          </a>
        </li>
        <li libPictureListItem>
          <a libPictureListThumb style="display: block" [href]="photos.sink">
            <img [src]="photos.sink" alt="Photo 2 of Kitchen tap leak" />
          </a>
        </li>
      </ul>`,
  }),
};

export const LoadingPhoto: Story = {
  render: () => ({
    props: { photos },
    template: `
      <ul libPictureListGrid aria-label="Photos" style="max-width: 24rem">
        <li libPictureListItem>
          <a libPictureListThumb style="display: block" [href]="photos.tap">
            <img [src]="photos.tap" alt="Photo 1 of Kitchen tap leak" />
          </a>
        </li>
        <li libPictureListItem>
          <div libPictureListThumb aria-busy="true"></div>
          <span libPictureListNote>Loading photo…</span>
        </li>
      </ul>`,
  }),
};

export const Uploading: Story = {
  render: () => ({
    props: { photos },
    template: `
      <div libPictureList style="max-width: 32rem">${choices(true)}
        <div libPictureListAdd>
          <label libButton size="sm" aria-busy="true" aria-disabled="true">
            <svg libIcon="upload"></svg>Upload a new photo
            <input class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="pl-uploading-help" disabled />
          </label>
        </div>
        <p libFieldHelp id="pl-uploading-help" role="status">Uploading…</p>
      </div>`,
  }),
};

export const UploadFailed: Story = {
  render: () => ({
    props: { photos },
    template: `
      <div libPictureList style="max-width: 32rem">${choices(false)}${upload('pl-failed-help pl-failed-error', ' aria-invalid="true"')}
        <p libFieldHelp id="pl-failed-help" role="status">JPEG, PNG or WebP, up to 10 MB.</p>
        <p libFieldError id="pl-failed-error" role="alert">We couldn't upload the photo. Try again.</p>
      </div>`,
  }),
};

export const TooLarge: Story = {
  render: () => ({
    props: { photos },
    template: `
      <div libPictureList style="max-width: 32rem">${choices(false)}${upload('pl-large-help pl-large-error', ' aria-invalid="true"')}
        <p libFieldHelp id="pl-large-help" role="status">JPEG, PNG or WebP, up to 10 MB.</p>
        <p libFieldError id="pl-large-error" role="alert">That photo is larger than 10 MB. Choose a smaller one.</p>
      </div>`,
  }),
};

export const Empty: Story = {
  render: () => ({
    template: `
      <div libPictureList style="max-width: 32rem">
        <p class="text-muted">No photos in the library yet. Upload one below.</p>${upload('pl-empty-help')}
        <p libFieldHelp id="pl-empty-help" role="status">JPEG, PNG or WebP, up to 10 MB.</p>
      </div>`,
  }),
};
