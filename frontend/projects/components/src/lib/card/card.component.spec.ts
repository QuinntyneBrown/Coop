import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { CardTitleComponent } from './card-title.component';

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

describe('CardComponent', () => {
  it('is a card with padding by default', () => {
    const el = render(CardComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('card');
    expect(el.classList).not.toContain('card--flush');
  });

  it('drops its padding when flush', () => {
    const el = render(CardComponent, 'div', { flush: true });

    expect(el.classList).toContain('card--flush');
  });
});

describe('CardTitleComponent', () => {
  it("is a h2 drawn as the design system's card title", () => {
    const el = render(CardTitleComponent, 'h2');

    expect(el.tagName.toLowerCase()).toBe('h2');
    expect(el.classList).toContain('card__title');
  });
});
