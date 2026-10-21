import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { PaginationListComponent } from './pagination-list.component';
import { PaginationLinkComponent } from './pagination-link.component';

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

describe('PaginationComponent', () => {
  it("is a nav drawn as the design system's pagination", () => {
    const el = render(PaginationComponent, 'nav');

    expect(el.tagName.toLowerCase()).toBe('nav');
    expect(el.classList).toContain('pagination');
  });
});

describe('PaginationListComponent', () => {
  it("is a ul drawn as the design system's pagination list", () => {
    const el = render(PaginationListComponent, 'ul');

    expect(el.tagName.toLowerCase()).toBe('ul');
    expect(el.classList).toContain('pagination__list');
  });
});

describe('PaginationLinkComponent', () => {
  it("is a button drawn as the design system's page button", () => {
    const el = render(PaginationLinkComponent, 'button');

    expect(el.tagName.toLowerCase()).toBe('button');
    expect(el.classList).toContain('pagination__link');
  });
});
