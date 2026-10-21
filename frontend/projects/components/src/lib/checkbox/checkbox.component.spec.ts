import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';
import { CheckboxTextComponent } from './checkbox-text.component';

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

describe('CheckboxComponent', () => {
  it("is a label drawn as the design system's checkbox", () => {
    const el = render(CheckboxComponent, 'label');

    expect(el.tagName.toLowerCase()).toBe('label');
    expect(el.classList).toContain('checkbox');
  });
});

describe('CheckboxTextComponent', () => {
  it("is a span drawn as the design system's checkbox text", () => {
    const el = render(CheckboxTextComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('checkbox__text');
  });
});
