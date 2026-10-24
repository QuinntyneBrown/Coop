import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CardComponent } from '../card/card.component';
import { IconComponent } from '../icon/icon.component';
import { SiteTreeComponent } from './site-tree.component';
import { SiteTreeGroupComponent } from './site-tree-group.component';
import { SiteTreeLinkComponent } from './site-tree-link.component';
import { SiteTreeListComponent } from './site-tree-list.component';
import { WebsiteShellComponent } from './website-shell.component';

// The tree in the shape of the public site, with the pages the office added.
const tree = (current: string) => `
      <nav libSiteTree aria-label="Website">
        <ul libSiteTreeList>
          <li><a libSiteTreeLink href="#home"${current === 'home' ? ' aria-current="page"' : ''}><svg libIcon="home"></svg>Home</a></li>
          <li>
            <span libSiteTreeGroup><svg libIcon="pages"></svg>Pages</span>
            <ul libSiteTreeList nested>
              <li><a libSiteTreeLink href="#about-us">About us</a></li>
              <li><a libSiteTreeLink href="#how-to-apply">How to apply</a></li>
              <li><a libSiteTreeLink add href="#new"><svg libIcon="add"></svg>Add a page</a></li>
            </ul>
          </li>
          <li><a libSiteTreeLink href="#menu"><svg libIcon="documents"></svg>Menu and footer</a></li>
          <li><a libSiteTreeLink href="#board"${current === 'board' ? ' aria-current="page"' : ''}><svg libIcon="board"></svg>Board of directors</a></li>
          <li><a libSiteTreeLink href="#photos"><svg libIcon="photo"></svg>Photos</a></li>
          <li><a libSiteTreeLink href="#look"><svg libIcon="look"></svg>Look</a></li>
        </ul>
      </nav>`;

const meta: Meta<SiteTreeComponent> = {
  title: 'Navigation/Site tree',
  component: SiteTreeComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SiteTreeListComponent,
        SiteTreeLinkComponent,
        SiteTreeGroupComponent,
        WebsiteShellComponent,
        CardComponent,
        IconComponent,
      ],
    }),
  ],
  argTypes: { cards: { control: 'boolean' } },
  render: () => ({ template: `<div style="max-width: 20rem">${tree('home')}</div>` }),
};

export default meta;
type Story = StoryObj<SiteTreeComponent>;

export const Column: Story = {};

export const Cards: Story = {
  render: () => ({
    template: `<div libCard style="max-width: 40rem">${tree('home').replace('<nav libSiteTree', '<nav libSiteTree cards')}</div>`,
  }),
};

export const BesideAScreen: Story = {
  render: () => ({
    template: `
      <div libWebsiteShell>
        ${tree('board')}
        <div libCard><h2 class="card__title">Board of directors</h2><p class="text-muted">The screen sits beside the tree from 64rem and under it below.</p></div>
      </div>`,
  }),
};
