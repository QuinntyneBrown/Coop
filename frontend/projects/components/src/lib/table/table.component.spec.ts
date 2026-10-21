import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TableWrapComponent } from './table-wrap.component';
import { TableComponent } from './table.component';

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

describe('TableWrapComponent', () => {
  it('is a bordered scroll box by default', () => {
    const el = render(TableWrapComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('table-wrap');
    expect(el.classList).not.toContain('table-wrap--flush');
  });

  it('drops its border when flush', () => {
    const el = render(TableWrapComponent, 'div', { flush: true });

    expect(el.classList).toContain('table-wrap--flush');
  });
});

describe('TableComponent', () => {
  it("is a table drawn as the design system's table", () => {
    const el = render(TableComponent, 'table');

    expect(el.tagName.toLowerCase()).toBe('table');
    expect(el.classList).toContain('table');
  });
});
