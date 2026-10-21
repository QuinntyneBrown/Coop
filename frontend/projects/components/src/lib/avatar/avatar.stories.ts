import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';
import { AvatarImageComponent } from './avatar-image.component';

// A fictional portrait drawn inline, so the stories make no network requests.
const portrait =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>` +
      `<rect width='64' height='64' fill='#c9b8e8'/>` +
      `<circle cx='32' cy='26' r='12' fill='#7a5a4a'/>` +
      `<path d='M10 64c2-14 11-21 22-21s20 7 22 21z' fill='#4f6d7a'/>` +
      `</svg>`,
  );

const meta: Meta<AvatarComponent> = {
  title: 'Data display/Avatar',
  component: AvatarComponent,
  decorators: [moduleMetadata({ imports: [AvatarImageComponent] })],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
  },
  args: { size: 'md' },
  render: (args) => ({
    props: args,
    template: `<span libAvatar [size]="size" role="img" aria-label="Mira Fern">MF</span>`,
  }),
};

export default meta;
type Story = StoryObj<AvatarComponent>;

export const Initials: Story = {};

export const WithPhoto: Story = {
  args: { size: 'lg' },
  render: (args) => ({
    props: { ...args, portrait },
    template: `
      <span libAvatar [size]="size" role="img" aria-label="Rosalind Achebe">
        RA<img libAvatarImage [src]="portrait" alt="" />
      </span>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="cluster">
        <span libAvatar size="sm" role="img" aria-label="Mira Fern">MF</span>
        <span libAvatar role="img" aria-label="Mira Fern">MF</span>
        <span libAvatar size="lg" role="img" aria-label="Mira Fern">MF</span>
        <span libAvatar size="xl" role="img" aria-label="Mira Fern">MF</span>
      </div>`,
  }),
};

export const PhotoSizes: Story = {
  render: () => ({
    props: { portrait },
    template: `
      <div class="cluster">
        <span libAvatar size="sm" role="img" aria-label="Rosalind Achebe">
          RA<img libAvatarImage [src]="portrait" alt="" />
        </span>
        <span libAvatar role="img" aria-label="Rosalind Achebe">
          RA<img libAvatarImage [src]="portrait" alt="" />
        </span>
        <span libAvatar size="lg" role="img" aria-label="Rosalind Achebe">
          RA<img libAvatarImage [src]="portrait" alt="" />
        </span>
        <span libAvatar size="xl" role="img" aria-label="Rosalind Achebe">
          RA<img libAvatarImage [src]="portrait" alt="" />
        </span>
      </div>`,
  }),
};

export const UsernameOnly: Story = {
  render: () => ({
    template: `
      <span class="cluster" style="gap: var(--space-2)">
        <span libAvatar size="sm" aria-hidden="true">M</span>mira.fern
      </span>`,
  }),
};

export const BesideNames: Story = {
  render: () => ({
    props: { portrait },
    template: `
      <ul class="stack" style="list-style: none; margin: 0; padding: 0">
        <li class="cluster" style="gap: var(--space-2)">
          <span libAvatar size="sm" aria-hidden="true">MF</span>Mira Fern
        </li>
        <li class="cluster" style="gap: var(--space-2)">
          <span libAvatar size="sm" aria-hidden="true">TM</span>Tavi Moss
        </li>
        <li class="cluster" style="gap: var(--space-2)">
          <span libAvatar size="lg" aria-hidden="true">JO</span>June Okonkwo-Baptiste
        </li>
        <li class="cluster" style="gap: var(--space-2)">
          <span libAvatar size="lg" aria-hidden="true">
            RA<img libAvatarImage [src]="portrait" alt="" />
          </span>
          Rosalind Achebe
        </li>
      </ul>`,
  }),
};
