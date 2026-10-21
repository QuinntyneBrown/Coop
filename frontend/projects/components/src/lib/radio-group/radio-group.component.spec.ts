import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RadioComponent } from './radio.component';
import { RadioTextComponent } from './radio-text.component';

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

describe('RadioComponent', () => {
  it("is a label drawn as the design system's radio option", () => {
    const el = render(RadioComponent, 'label');

    expect(el.tagName.toLowerCase()).toBe('label');
    expect(el.classList).toContain('choice');
  });
});

describe('RadioTextComponent', () => {
  it("is a span drawn as the design system's radio option text", () => {
    const el = render(RadioTextComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('choice__text');
  });
});
