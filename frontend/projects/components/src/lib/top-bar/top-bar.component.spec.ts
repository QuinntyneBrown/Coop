import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TopBarComponent } from './top-bar.component';
import { TopBarBrandComponent } from './top-bar-brand.component';
import { TopBarSpacerComponent } from './top-bar-spacer.component';

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

describe('TopBarComponent', () => {
  it("is a header drawn as the design system's top bar", () => {
    const el = render(TopBarComponent, 'header');

    expect(el.tagName.toLowerCase()).toBe('header');
    expect(el.classList).toContain('topbar');
  });
});

describe('TopBarBrandComponent', () => {
  it("is a span drawn as the design system's top bar brand", () => {
    const el = render(TopBarBrandComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('topbar__brand');
  });
});

describe('TopBarSpacerComponent', () => {
  it("is a span drawn as the design system's top bar spacer", () => {
    const el = render(TopBarSpacerComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('topbar__spacer');
  });
});
