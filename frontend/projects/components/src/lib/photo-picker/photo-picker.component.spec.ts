import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PhotoPickerComponent } from './photo-picker.component';
import { PhotoPickerBodyComponent } from './photo-picker-body.component';
import { PhotoPickerActionsComponent } from './photo-picker-actions.component';

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

describe('PhotoPickerComponent', () => {
  it("is a div drawn as the design system's photo picker", () => {
    const el = render(PhotoPickerComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('photo-picker');
  });
});

describe('PhotoPickerBodyComponent', () => {
  it("is a div drawn as the design system's photo picker body", () => {
    const el = render(PhotoPickerBodyComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('photo-picker__body');
  });
});

describe('PhotoPickerActionsComponent', () => {
  it("is a div drawn as the design system's photo picker actions", () => {
    const el = render(PhotoPickerActionsComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('photo-picker__actions');
  });
});
