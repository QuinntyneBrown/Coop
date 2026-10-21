import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MetricCardComponent } from './metric-card.component';
import { MetricCardIconComponent } from './metric-card-icon.component';
import { StatComponent } from './stat.component';
import { StatLabelComponent } from './stat-label.component';
import { StatValueComponent } from './stat-value.component';

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

describe('MetricCardComponent', () => {
  it("is a div drawn as the design system's metric card", () => {
    const el = render(MetricCardComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('card');
    expect(el.classList).toContain('metric-card');
  });
});

describe('MetricCardIconComponent', () => {
  it('is decorative and uses the accent tone by default', () => {
    const el = render(MetricCardIconComponent, 'span');

    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.classList).toContain('metric-card__icon');
    expect(el.classList).not.toContain('metric-card__icon--warning');
    expect(el.classList).not.toContain('metric-card__icon--success');
    expect(el.classList).not.toContain('metric-card__icon--info');
  });

  it('shows its tone', () => {
    const el = render(MetricCardIconComponent, 'span', { tone: 'warning' });

    expect(el.classList).toContain('metric-card__icon--warning');
  });

  it('shows the success tone', () => {
    const el = render(MetricCardIconComponent, 'span', { tone: 'success' });

    expect(el.classList).toContain('metric-card__icon--success');
  });

  it('shows the info tone', () => {
    const el = render(MetricCardIconComponent, 'span', { tone: 'info' });

    expect(el.classList).toContain('metric-card__icon--info');
  });
});

describe('StatComponent', () => {
  it("is a span drawn as the design system's stat", () => {
    const el = render(StatComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('stat');
  });
});

describe('StatLabelComponent', () => {
  it("is a span drawn as the design system's stat label", () => {
    const el = render(StatLabelComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('stat__label');
  });
});

describe('StatValueComponent', () => {
  it("is a span drawn as the design system's stat value", () => {
    const el = render(StatValueComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('stat__value');
  });
});
