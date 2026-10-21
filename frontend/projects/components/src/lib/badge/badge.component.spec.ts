import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

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

describe('BadgeComponent', () => {
  it('is a badge with no tone by default', () => {
    const el = render(BadgeComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('badge');
    expect(el.classList).not.toContain('badge--neutral');
    expect(el.classList).not.toContain('badge--info');
    expect(el.classList).not.toContain('badge--success');
    expect(el.classList).not.toContain('badge--warning');
    expect(el.classList).not.toContain('badge--danger');
    expect(el.classList).not.toContain('badge--count');
  });

  it('shows its tone', () => {
    const el = render(BadgeComponent, 'span', { tone: 'success' });

    expect(el.classList).toContain('badge--success');
  });

  it('shows the danger tone', () => {
    const el = render(BadgeComponent, 'span', { tone: 'danger' });

    expect(el.classList).toContain('badge--danger');
    expect(el.classList).not.toContain('badge--success');
  });

  it('shows the neutral tone', () => {
    const el = render(BadgeComponent, 'span', { tone: 'neutral' });

    expect(el.classList).toContain('badge--neutral');
  });

  it('shows the info tone', () => {
    const el = render(BadgeComponent, 'span', { tone: 'info' });

    expect(el.classList).toContain('badge--info');
  });

  it('shows the warning tone', () => {
    const el = render(BadgeComponent, 'span', { tone: 'warning' });

    expect(el.classList).toContain('badge--warning');
  });

  it('is drawn as a count when count', () => {
    const el = render(BadgeComponent, 'span', { count: true });

    expect(el.classList).toContain('badge--count');
  });
});
