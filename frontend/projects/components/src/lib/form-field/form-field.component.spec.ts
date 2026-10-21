import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';
import { FieldLabelComponent } from './field-label.component';
import { FieldHelpComponent } from './field-help.component';
import { FieldErrorComponent } from './field-error.component';

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

describe('FormFieldComponent', () => {
  it("is a div drawn as the design system's form field", () => {
    const el = render(FormFieldComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('field');
  });
});

describe('FieldLabelComponent', () => {
  it("is a label drawn as the design system's field label", () => {
    const el = render(FieldLabelComponent, 'label');

    expect(el.tagName.toLowerCase()).toBe('label');
    expect(el.classList).toContain('field__label');
  });
});

describe('FieldHelpComponent', () => {
  it("is a p drawn as the design system's field help", () => {
    const el = render(FieldHelpComponent, 'p');

    expect(el.tagName.toLowerCase()).toBe('p');
    expect(el.classList).toContain('field__help');
  });
});

describe('FieldErrorComponent', () => {
  it("is a p drawn as the design system's field error", () => {
    const el = render(FieldErrorComponent, 'p');

    expect(el.tagName.toLowerCase()).toBe('p');
    expect(el.classList).toContain('field__error');
  });
});
