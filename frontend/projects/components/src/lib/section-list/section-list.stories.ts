import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { IconComponent } from '../icon/icon.component';
import { PlacementNoteComponent } from '../placement-note/placement-note.component';
import { PageEditorPaneComponent } from '../page-editor/page-editor-pane.component';
import { PageEditorTabsComponent } from '../page-editor/page-editor-tabs.component';
import { PageEditorComponent } from '../page-editor/page-editor.component';
import { TabComponent } from '../tabs/tab.component';
import { TabsComponent } from '../tabs/tabs.component';
import { SectionListAddLabelComponent } from './section-list-add-label.component';
import { SectionListAddComponent } from './section-list-add.component';
import { SectionListButtonComponent } from './section-list-button.component';
import { SectionListItemComponent } from './section-list-item.component';
import { SectionListToolsComponent } from './section-list-tools.component';
import { SectionListComponent } from './section-list.component';

// The home page's sections in the order visitors see them.
const SECTIONS = [
  'Welcome banner',
  'Numbers at a glance',
  'Who we are',
  'A look around',
  'Our building and community',
  "What's on",
  'Board of directors',
  'A word from a member',
  'Visit or apply',
];

const list = (selected: number, hidden: number[] = []) => `
      <ol libSectionList aria-label="Sections in the order visitors see them">
        ${SECTIONS.map(
          (name, i) => `<li libSectionListItem ${hidden.includes(i) ? 'hiddenSection' : ''}>
          <button libSectionListButton type="button"${i === selected ? ' aria-current="true"' : ''}>${name}</button>
          ${hidden.includes(i) ? '<span libBadge tone="neutral">Hidden</span>' : ''}
        </li>`,
        ).join('\n        ')}
      </ol>
      <div libSectionListTools role="group" aria-label="Selected section">
        <button libButton size="sm" type="button"><svg libIcon="${hidden.includes(selected) ? 'show' : 'hide'}"></svg>${hidden.includes(selected) ? 'Show' : 'Hide'} section<span class="visually-hidden">: ${SECTIONS[selected]}</span></button>
        <button libButton size="sm" type="button"${selected === 0 ? ' disabled' : ''}><svg libIcon="move-up"></svg>Move up<span class="visually-hidden">: ${SECTIONS[selected]}</span></button>
        <button libButton size="sm" type="button"${selected === SECTIONS.length - 1 ? ' disabled' : ''}><svg libIcon="move-down"></svg>Move down<span class="visually-hidden">: ${SECTIONS[selected]}</span></button>
      </div>`;

const meta: Meta<SectionListComponent> = {
  title: 'Data display/Section list',
  component: SectionListComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SectionListItemComponent,
        SectionListButtonComponent,
        SectionListToolsComponent,
        SectionListAddComponent,
        SectionListAddLabelComponent,
        PlacementNoteComponent,
        PageEditorComponent,
        PageEditorTabsComponent,
        PageEditorPaneComponent,
        TabsComponent,
        TabComponent,
        BadgeComponent,
        ButtonComponent,
        CardComponent,
        IconComponent,
      ],
    }),
  ],
  render: () => ({ template: `<div libCard style="max-width: 20rem">${list(0)}</div>` }),
};

export default meta;
type Story = StoryObj<SectionListComponent>;

export const Default: Story = {};

export const HiddenSection: Story = {
  render: () => ({ template: `<div libCard style="max-width: 20rem">${list(3, [3])}</div>` }),
};

export const WebsitePage: Story = {
  render: () => ({
    template: `
      <div libCard style="max-width: 20rem">
        <ol libSectionList aria-label="Sections of the page">
          <li libSectionListItem fixed><button libSectionListButton type="button" aria-current="true">Page banner</button></li>
          <li libSectionListItem><button libSectionListButton type="button">Heading: Who can apply</button></li>
          <li libSectionListItem><button libSectionListButton type="button">Bullet list</button></li>
        </ol>
        <div libSectionListTools role="group" aria-label="Selected section">
          <button libButton size="sm" type="button" disabled><svg libIcon="move-up"></svg>Move up<span class="visually-hidden">: Page banner</span></button>
          <button libButton size="sm" type="button" disabled><svg libIcon="move-down"></svg>Move down<span class="visually-hidden">: Page banner</span></button>
          <button libButton size="sm" variant="danger" type="button" disabled>Remove<span class="visually-hidden">: Page banner</span></button>
        </div>
        <div libSectionListAdd role="group" aria-label="Add to the page">
          <span libSectionListAddLabel>Add to the page</span>
          <button libButton size="sm" type="button"><svg libIcon="heading"></svg>Heading</button>
          <button libButton size="sm" type="button"><svg libIcon="paragraph"></svg>Paragraph</button>
          <button libButton size="sm" type="button"><svg libIcon="bullets"></svg>Bullet list</button>
          <button libButton size="sm" type="button"><svg libIcon="photo"></svg>Photo</button>
          <button libButton size="sm" type="button"><svg libIcon="link"></svg>Link button</button>
        </div>
      </div>`,
  }),
};

// The three panes of the page editor, side by side from 64rem and as tabs below.
export const InThePageEditor: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => ({
    template: `
      <div libPageEditor style="padding: var(--space-4)">
        <div libPageEditorTabs>
          <div libTabs aria-label="Editor panes">
            <button libTab type="button" aria-selected="false">Sections</button>
            <button libTab type="button" aria-selected="true">Edit</button>
            <button libTab type="button" aria-selected="false">Preview</button>
          </div>
        </div>
        <section libPageEditorPane pane="sections" libCard hidden>
          <h2 class="card__title">Sections</h2>
          ${list(0)}
        </section>
        <section libPageEditorPane pane="form" libCard>
          <h2>Welcome banner</h2>
          <p libPlacementNote><svg libIcon="place" size="sm"></svg><span>Appears first on the home page, under the menu.</span></p>
          <p class="text-muted">The section's fields follow here.</p>
        </section>
        <div libPageEditorPane pane="preview" hidden>
          <div libCard><p class="text-muted">The preview pane shows the public site rendering the draft.</p></div>
        </div>
      </div>`,
  }),
};
