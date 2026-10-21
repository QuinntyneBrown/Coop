import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';

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

describe('SelectComponent', () => {
  it("is a native select drawn as the design system's select", () => {
    const el = render(SelectComponent, 'select');

    expect(el.tagName.toLowerCase()).toBe('select');
    expect(el.classList).toContain('select');
  });

  it('keeps the native value, so forms bind to it directly', () => {
    const el = render(SelectComponent, 'select');

    el.appendChild(new Option('Unit 4', 'unit-4'));
    expect((el as HTMLSelectElement).value).toBe('unit-4');
  });
});
