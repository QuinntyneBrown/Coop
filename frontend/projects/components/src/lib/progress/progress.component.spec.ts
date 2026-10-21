import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProgressComponent } from './progress.component';

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

describe('ProgressComponent', () => {
  it('is a progress bar from 0 to 100 that reports its value', () => {
    const el = render(ProgressComponent, 'div', { value: 42 });

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('progress');
    expect(el.getAttribute('role')).toBe('progressbar');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-valuenow')).toBe('42');
  });

  it('fills its bar to the value', () => {
    const el = render(ProgressComponent, 'div', { value: 42 });

    const bar = el.querySelector<HTMLElement>('.progress__bar');
    expect(bar?.style.getPropertyValue('--value')).toBe('42%');
  });
});
