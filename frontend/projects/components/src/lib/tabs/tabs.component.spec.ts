import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';
import { TabComponent } from './tab.component';
import { TabPanelComponent } from './tab-panel.component';

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

describe('TabsComponent', () => {
  it('is a tab list with underlined tabs by default', () => {
    const el = render(TabsComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('tabs');
    expect(el.getAttribute('role')).toBe('tablist');
    expect(el.classList).not.toContain('tabs--pill');
  });

  it('draws its tabs as pills when pill', () => {
    const el = render(TabsComponent, 'div', { pill: true });

    expect(el.classList).toContain('tabs--pill');
  });
});

describe('TabComponent', () => {
  it('is a native button with the tab role', () => {
    const el = render(TabComponent, 'button');

    expect(el.tagName.toLowerCase()).toBe('button');
    expect(el.classList).toContain('tabs__tab');
    expect(el.getAttribute('role')).toBe('tab');
  });
});

describe('TabPanelComponent', () => {
  it('is a tab panel', () => {
    const el = render(TabPanelComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('tabs__panel');
    expect(el.getAttribute('role')).toBe('tabpanel');
  });
});
