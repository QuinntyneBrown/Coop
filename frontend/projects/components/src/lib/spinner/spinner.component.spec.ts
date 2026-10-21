import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';
import { LoadingComponent } from './loading.component';

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

describe('SpinnerComponent', () => {
  it('is decorative and medium by default', () => {
    const el = render(SpinnerComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('spinner');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.classList).not.toContain('spinner--sm');
  });

  it('shows the small size', () => {
    const el = render(SpinnerComponent, 'span', { size: 'sm' });

    expect(el.classList).toContain('spinner--sm');
  });
});

describe('LoadingComponent', () => {
  it('is a loading row and leaves its live region to the app', () => {
    const el = render(LoadingComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('loading');
    expect(el.hasAttribute('role')).toBe(false);
  });
});
