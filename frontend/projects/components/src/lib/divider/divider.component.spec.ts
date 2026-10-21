import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DividerComponent } from './divider.component';

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

describe('DividerComponent', () => {
  it("is a hr drawn as the design system's rule", () => {
    const el = render(DividerComponent, 'hr');

    expect(el.tagName.toLowerCase()).toBe('hr');
    expect(el.classList).toContain('divider');
    expect(el.classList).toContain('divider--rule');
  });
});
