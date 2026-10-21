import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LogoMarkComponent } from './logo-mark.component';

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

describe('LogoMarkComponent', () => {
  it('is the decorative app icon', () => {
    const el = render(LogoMarkComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('logo-mark');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelectorAll('svg circle').length).toBe(3);
  });
});
