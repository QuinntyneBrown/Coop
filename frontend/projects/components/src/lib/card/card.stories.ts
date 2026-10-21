import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AvatarComponent } from '../avatar/avatar.component';
import { AvatarImageComponent } from '../avatar/avatar-image.component';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { ListBodyComponent } from '../list/list-body.component';
import { ListComponent } from '../list/list.component';
import { ListItemComponent } from '../list/list-item.component';
import { ListMetaComponent } from '../list/list-meta.component';
import { ListTitleComponent } from '../list/list-title.component';
import { CardComponent } from './card.component';
import { CardTitleComponent } from './card-title.component';

// A fictional portrait drawn inline, so the story makes no network request.
const portrait =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#d9c7b8"/><circle cx="24" cy="19" r="9" fill="#8a6a55"/><path d="M8 48c2-11 9-16 16-16s14 5 16 16z" fill="#5f7f74"/></svg>',
  );

const meta: Meta<CardComponent> = {
  title: 'Containers and overlays/Card',
  component: CardComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CardTitleComponent,
        BadgeComponent,
        ButtonComponent,
        IconComponent,
        AvatarComponent,
        AvatarImageComponent,
        ListComponent,
        ListItemComponent,
        ListBodyComponent,
        ListTitleComponent,
        ListMetaComponent,
      ],
    }),
  ],
  argTypes: {
    flush: { control: 'boolean' },
  },
  args: { flush: false },
  render: (args) => ({
    props: args,
    template: `
      <article libCard class="stack" [flush]="flush" aria-labelledby="card-default-title" style="max-width: 24rem">
        <div class="cluster cluster--between">
          <h2 libCardTitle id="card-default-title" style="margin-bottom: 0"><a href="#">Kitchen tap leak</a></h2>
          <span libBadge tone="warning">New</span>
        </div>
        <p>The kitchen tap drips after it is closed.</p>
        <p class="text-caption">Reported Tue 13 Oct, 8:00 am</p>
      </article>`,
  }),
};

export default meta;
type Story = StoryObj<CardComponent>;

export const Default: Story = {};

export const RequestCards: Story = {
  render: () => ({
    template: `
      <ul class="grid grid--auto" style="list-style: none; padding: 0; margin: 0" aria-label="Maintenance requests">
        <li>
          <article libCard class="stack" aria-labelledby="card-req-1">
            <div class="cluster cluster--between">
              <h2 libCardTitle id="card-req-1" style="margin-bottom: 0"><a href="#">Kitchen tap leak</a></h2>
              <span libBadge tone="warning">New</span>
            </div>
            <p>The kitchen tap drips after it is closed.</p>
            <p class="text-caption">Reported Tue 13 Oct, 8:00 am</p>
          </article>
        </li>
        <li>
          <article libCard class="stack" aria-labelledby="card-req-2">
            <div class="cluster cluster--between">
              <h2 libCardTitle id="card-req-2" style="margin-bottom: 0"><a href="#">Courtyard gate</a></h2>
              <span libBadge tone="info">Started</span>
            </div>
            <p>The courtyard gate needs its hinges adjusted.</p>
            <p class="text-caption">Reported Fri 2 Oct, 1:15 pm</p>
          </article>
        </li>
      </ul>`,
  }),
};

export const DocumentCard: Story = {
  render: () => ({
    template: `
      <article libCard aria-labelledby="card-doc-1">
        <div class="cluster">
          <span libAvatar aria-hidden="true"><svg libIcon="megaphone"></svg></span>
          <div style="flex: 1; min-width: 10rem">
            <h2 libCardTitle id="card-doc-1" style="margin-bottom: 0"><a href="#">Autumn courtyard gathering</a></h2>
            <p class="text-caption">Notice · Tue 13 Oct</p>
          </div>
          <span libBadge tone="success">Published</span>
          <button libButton type="button" variant="ghost" iconOnly aria-label="Delete Autumn courtyard gathering">
            <svg libIcon="delete"></svg>
          </button>
        </div>
      </article>`,
  }),
};

export const AssetCard: Story = {
  render: () => ({
    template: `
      <article libCard aria-labelledby="card-asset-1">
        <div class="cluster">
          <span libAvatar aria-hidden="true"><svg libIcon="documents"></svg></span>
          <div style="flex: 1; min-width: 10rem">
            <h2 libCardTitle id="card-asset-1" style="margin-bottom: 0"><a href="#">Courtyard plan.pdf</a></h2>
            <p class="text-caption">2 KB · uploaded Tue 13 Oct</p>
          </div>
        </div>
      </article>`,
  }),
};

export const PageCard: Story = {
  render: () => ({
    template: `
      <article libCard class="stack" aria-labelledby="card-page-1">
        <h2 libCardTitle id="card-page-1">About us</h2>
        <div class="cluster text-muted">
          <span>Web address: /pages/about-us</span>
          <a href="#">Open on the website<span class="visually-hidden">: About us</span></a>
        </div>
        <div class="cluster">
          <button libButton type="button">Edit<span class="visually-hidden"> About us</span></button>
          <button libButton type="button" variant="danger">Remove<span class="visually-hidden"> About us</span></button>
        </div>
      </article>`,
  }),
};

export const DirectorCard: Story = {
  render: () => ({
    props: { portrait },
    template: `
      <article libCard class="stack" aria-labelledby="card-dir-1">
        <div class="cluster">
          <span libAvatar size="lg">
            <img libAvatarImage [src]="portrait" alt="Portrait of Rosalind Achebe" width="48" height="48" />RA
          </span>
          <div>
            <h2 libCardTitle id="card-dir-1" style="margin-bottom: 0">Rosalind Achebe</h2>
            <p class="text-muted">President</p>
          </div>
        </div>
        <div class="cluster">
          <button libButton type="button" disabled>
            <svg libIcon="move-up"></svg>Move up<span class="visually-hidden">: Rosalind Achebe</span>
          </button>
          <button libButton type="button">
            <svg libIcon="move-down"></svg>Move down<span class="visually-hidden">: Rosalind Achebe</span>
          </button>
          <button libButton type="button">Edit<span class="visually-hidden"> Rosalind Achebe</span></button>
          <button libButton type="button" variant="danger">Remove<span class="visually-hidden"> Rosalind Achebe</span></button>
        </div>
      </article>`,
  }),
};

export const BlockCard: Story = {
  render: () => ({
    template: `
      <article libCard aria-labelledby="card-block-1">
        <div class="cluster cluster--between">
          <div style="min-width: 0">
            <h2 libCardTitle id="card-block-1" style="margin-bottom: 0">Header</h2>
            <p class="text-muted">The co-op's name and the main menu</p>
          </div>
          <button libButton type="button">Edit<span class="visually-hidden"> Header</span></button>
        </div>
      </article>`,
  }),
};

export const Active: Story = {
  render: () => ({
    template: `
      <article libCard aria-labelledby="card-active-1" aria-current="true" style="max-width: 24rem">
        <div class="cluster cluster--between">
          <h2 libCardTitle id="card-active-1" style="margin-bottom: 0">Mira Fern</h2>
          <span libBadge tone="success">Active</span>
        </div>
        <p class="text-muted">Member</p>
      </article>`,
  }),
};

export const Flush: Story = {
  args: { flush: true },
  render: (args) => ({
    props: args,
    template: `
      <section libCard [flush]="flush" aria-labelledby="card-flush-title">
        <h2 libCardTitle id="card-flush-title">My profiles</h2>
        <ul libList>
          <li libListItem aria-current="true">
            <div libListBody>
              <div libListTitle>Mira Fern</div>
              <div libListMeta>Member</div>
            </div>
            <span libBadge tone="success">Active</span>
          </li>
          <li libListItem>
            <div libListBody>
              <div libListTitle>Mira Fern</div>
              <div libListMeta>Board member</div>
            </div>
          </li>
        </ul>
      </section>`,
  }),
};
