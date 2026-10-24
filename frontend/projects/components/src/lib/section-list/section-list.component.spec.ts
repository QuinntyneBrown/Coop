import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LinkedSummaryComponent } from '../linked-summary/linked-summary.component';
import { PageEditorPaneComponent } from '../page-editor/page-editor-pane.component';
import { PageEditorComponent } from '../page-editor/page-editor.component';
import { PlacementNoteComponent } from '../placement-note/placement-note.component';
import { SectionListButtonComponent } from './section-list-button.component';
import { SectionListItemComponent } from './section-list-item.component';
import { SectionListToolsComponent } from './section-list-tools.component';
import { SectionListComponent } from './section-list.component';

function render<T>(type: Type<T>, tag: string, inputs: Record<string, unknown> = {}): HTMLElement {
  const hostElement = document.createElement(tag);
  document.body.append(hostElement);
  const ref = createComponent(type, {
    environmentInjector: TestBed.inject(EnvironmentInjector),
    hostElement,
  });
  for (const [name, value] of Object.entries(inputs)) ref.setInput(name, value);
  ref.changeDetectorRef.detectChanges();
  return hostElement;
}

describe('SectionListComponent', () => {
  it('is a numbered list of sections with items, buttons and tools', () => {
    expect(render(SectionListComponent, 'ol').classList).toContain('section-list');
    expect(render(SectionListButtonComponent, 'button').classList).toContain(
      'section-list__button',
    );
    expect(render(SectionListToolsComponent, 'div').classList).toContain('section-list__tools');
  });

  it('marks a hidden or fixed item', () => {
    const item = render(SectionListItemComponent, 'li');
    expect(item.classList).toContain('section-list__item');
    expect(item.classList).not.toContain('section-list__item--hidden');
    expect(render(SectionListItemComponent, 'li', { hiddenSection: true }).classList).toContain(
      'section-list__item--hidden',
    );
    expect(render(SectionListItemComponent, 'li', { fixed: true }).classList).toContain(
      'section-list__item--fixed',
    );
  });
});

describe('PlacementNoteComponent', () => {
  it('is the placement note', () => {
    expect(render(PlacementNoteComponent, 'p').classList).toContain('placement-note');
  });
});

describe('LinkedSummaryComponent', () => {
  it('is the linked summary', () => {
    expect(render(LinkedSummaryComponent, 'div').classList).toContain('linked-summary');
  });
});

describe('PageEditorComponent', () => {
  it('is the editor grid with a pane per kind', () => {
    expect(render(PageEditorComponent, 'div').classList).toContain('page-editor');
    const pane = render(PageEditorPaneComponent, 'section', { pane: 'preview' });
    expect(pane.classList).toContain('page-editor__pane');
    expect(pane.classList).toContain('page-editor__pane--preview');
  });
});
