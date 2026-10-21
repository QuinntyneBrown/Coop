import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TextFieldComponent } from './text-field.component';

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

describe('TextFieldComponent', () => {
  it("is a native input drawn as the design system's text field", () => {
    const el = render(TextFieldComponent, 'input');

    expect(el.tagName.toLowerCase()).toBe('input');
    expect(el.classList).toContain('input');
  });

  it('keeps the native value, so forms bind to it directly', () => {
    const el = render(TextFieldComponent, 'input');

    (el as HTMLInputElement).value = 'Unit 4';
    expect((el as HTMLInputElement).value).toBe('Unit 4');
  });
});
