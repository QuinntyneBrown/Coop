import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PictureListComponent } from './picture-list.component';
import { PictureListGridComponent } from './picture-list-grid.component';
import { PictureListItemComponent } from './picture-list-item.component';
import { PictureListThumbComponent } from './picture-list-thumb.component';
import { PictureListNoteComponent } from './picture-list-note.component';
import { PictureListAddComponent } from './picture-list-add.component';
import { PictureListChoiceComponent } from './picture-list-choice.component';

function render<T>(type: Type<T>, tag: string, inputs: Record<string, unknown> = {}): HTMLElement {
  const hostElement =
    tag === 'svg'
      ? document.createElementNS('http://www.w3.org/2000/svg', tag)
      : document.createElement(tag);
  document.body.append(hostElement);
  const ref = createComponent(type, {
    environmentInjector: TestBed.inject(EnvironmentInjector),
    hostElement,
  });
  for (const [name, value] of Object.entries(inputs)) ref.setInput(name, value);
  ref.changeDetectorRef.detectChanges();
  return hostElement as HTMLElement;
}

describe('PictureListComponent', () => {
  it("is a div drawn as the design system's picture list", () => {
    const el = render(PictureListComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('picture-list');
  });
});

describe('PictureListGridComponent', () => {
  it("is a ul drawn as the design system's picture grid", () => {
    const el = render(PictureListGridComponent, 'ul');

    expect(el.tagName.toLowerCase()).toBe('ul');
    expect(el.classList).toContain('picture-list__grid');
  });
});

describe('PictureListItemComponent', () => {
  it("is a li drawn as the design system's picture", () => {
    const el = render(PictureListItemComponent, 'li');

    expect(el.tagName.toLowerCase()).toBe('li');
    expect(el.classList).toContain('picture-list__item');
  });
});

describe('PictureListThumbComponent', () => {
  it("is a div drawn as the design system's thumbnail", () => {
    const el = render(PictureListThumbComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('picture-list__thumb');
  });
});

describe('PictureListNoteComponent', () => {
  it("is a span drawn as the design system's picture note", () => {
    const el = render(PictureListNoteComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('picture-list__note');
  });
});

describe('PictureListAddComponent', () => {
  it("is a div drawn as the design system's upload row", () => {
    const el = render(PictureListAddComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('picture-list__add');
  });
});

describe('PictureListChoiceComponent', () => {
  it("is a button drawn as the design system's picture choice", () => {
    const el = render(PictureListChoiceComponent, 'button');

    expect(el.tagName.toLowerCase()).toBe('button');
    expect(el.classList).toContain('picture-list__choice');
  });
});
