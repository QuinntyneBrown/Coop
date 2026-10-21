import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { ListItemComponent } from './list-item.component';
import { ListBodyComponent } from './list-body.component';
import { ListTitleComponent } from './list-title.component';
import { ListMetaComponent } from './list-meta.component';

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

describe('ListComponent', () => {
  it("is a ul drawn as the design system's list", () => {
    const el = render(ListComponent, 'ul');

    expect(el.tagName.toLowerCase()).toBe('ul');
    expect(el.classList).toContain('list');
  });
});

describe('ListItemComponent', () => {
  it("is a li drawn as the design system's list row", () => {
    const el = render(ListItemComponent, 'li');

    expect(el.tagName.toLowerCase()).toBe('li');
    expect(el.classList).toContain('list__item');
  });
});

describe('ListBodyComponent', () => {
  it("is a div drawn as the design system's list row body", () => {
    const el = render(ListBodyComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('list__body');
  });
});

describe('ListTitleComponent', () => {
  it("is a div drawn as the design system's list row title", () => {
    const el = render(ListTitleComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('list__title');
  });
});

describe('ListMetaComponent', () => {
  it("is a div drawn as the design system's list row meta", () => {
    const el = render(ListMetaComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('list__meta');
  });
});
