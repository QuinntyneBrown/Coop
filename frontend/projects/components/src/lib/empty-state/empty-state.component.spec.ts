import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';
import { EmptyStateIconComponent } from './empty-state-icon.component';
import { EmptyStateTitleComponent } from './empty-state-title.component';
import { EmptyStateTextComponent } from './empty-state-text.component';
import { EmptyStateActionsComponent } from './empty-state-actions.component';

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

describe('EmptyStateComponent', () => {
  it("is a div drawn as the design system's empty state", () => {
    const el = render(EmptyStateComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('empty');
  });
});

describe('EmptyStateIconComponent', () => {
  it("is a div drawn as the design system's empty state icon", () => {
    const el = render(EmptyStateIconComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('empty__icon');
  });
});

describe('EmptyStateTitleComponent', () => {
  it("is a h2 drawn as the design system's empty state title", () => {
    const el = render(EmptyStateTitleComponent, 'h2');

    expect(el.tagName.toLowerCase()).toBe('h2');
    expect(el.classList).toContain('empty__title');
  });
});

describe('EmptyStateTextComponent', () => {
  it("is a p drawn as the design system's empty state text", () => {
    const el = render(EmptyStateTextComponent, 'p');

    expect(el.tagName.toLowerCase()).toBe('p');
    expect(el.classList).toContain('empty__text');
  });
});

describe('EmptyStateActionsComponent', () => {
  it("is a div drawn as the design system's empty state actions", () => {
    const el = render(EmptyStateActionsComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('empty__actions');
  });
});
