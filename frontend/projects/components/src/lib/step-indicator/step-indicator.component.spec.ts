import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StepIndicatorComponent } from './step-indicator.component';

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

describe('StepIndicatorComponent', () => {
  it('draws one decorative dot per step', () => {
    const el = render(StepIndicatorComponent, 'p', { current: 2, total: 4 });

    expect(el.tagName.toLowerCase()).toBe('p');
    expect(el.classList).toContain('steps');
    const dots = el.querySelector('.steps__dots');
    expect(dots?.getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelectorAll('.steps__dot').length).toBe(4);
  });

  it('marks the steps done and the current step', () => {
    const el = render(StepIndicatorComponent, 'p', { current: 2, total: 4 });

    const dots = [...el.querySelectorAll('.steps__dot')];
    expect(dots.map((d) => d.classList.contains('steps__dot--done'))).toEqual([
      true,
      false,
      false,
      false,
    ]);
    expect(dots.map((d) => d.classList.contains('steps__dot--current'))).toEqual([
      false,
      true,
      false,
      false,
    ]);
  });
});
