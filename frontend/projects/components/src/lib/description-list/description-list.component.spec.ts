import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DescriptionListComponent } from './description-list.component';

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

describe('DescriptionListComponent', () => {
  it('is a stacked description list by default', () => {
    const el = render(DescriptionListComponent, 'dl');

    expect(el.tagName.toLowerCase()).toBe('dl');
    expect(el.classList).toContain('dl');
    expect(el.classList).not.toContain('dl--horizontal');
  });

  it('puts terms beside their details when horizontal', () => {
    const el = render(DescriptionListComponent, 'dl', { horizontal: true });

    expect(el.classList).toContain('dl--horizontal');
  });
});
