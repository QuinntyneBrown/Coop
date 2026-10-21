import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertBodyComponent } from './alert-body.component';
import { AlertTitleComponent } from './alert-title.component';
import { AlertActionsComponent } from './alert-actions.component';

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

describe('AlertComponent', () => {
  it('shows the success tone', () => {
    const el = render(AlertComponent, 'div', { tone: 'success' });

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('alert');
    expect(el.classList).toContain('alert--success');
    expect(el.classList).not.toContain('alert--danger');
  });

  it('shows the danger tone', () => {
    const el = render(AlertComponent, 'div', { tone: 'danger' });

    expect(el.classList).toContain('alert');
    expect(el.classList).toContain('alert--danger');
    expect(el.classList).not.toContain('alert--success');
  });

  it('leaves the live region to the app', () => {
    const el = render(AlertComponent, 'div', { tone: 'danger' });

    expect(el.hasAttribute('role')).toBe(false);
  });
});

describe('AlertBodyComponent', () => {
  it("is a div drawn as the design system's alert body", () => {
    const el = render(AlertBodyComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('alert__body');
  });
});

describe('AlertTitleComponent', () => {
  it("is a p drawn as the design system's alert title", () => {
    const el = render(AlertTitleComponent, 'p');

    expect(el.tagName.toLowerCase()).toBe('p');
    expect(el.classList).toContain('alert__title');
  });
});

describe('AlertActionsComponent', () => {
  it("is a div drawn as the design system's alert actions", () => {
    const el = render(AlertActionsComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('alert__actions');
  });
});
