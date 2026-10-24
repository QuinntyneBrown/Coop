import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SiteTreeComponent } from './site-tree.component';
import { SiteTreeGroupComponent } from './site-tree-group.component';
import { SiteTreeLinkComponent } from './site-tree-link.component';
import { SiteTreeListComponent } from './site-tree-list.component';
import { WebsiteShellComponent } from './website-shell.component';

function render<T>(type: Type<T>, tag: string, inputs: Record<string, unknown> = {}): HTMLElement {
  const hostElement = document.createElement(tag);
  document.body.append(hostElement);
  const ref = createComponent(type, {
    environmentInjector: TestBed.inject(EnvironmentInjector),
    hostElement,
  });
  for (const [name, value] of Object.entries(inputs)) ref.setInput(name, value);
  ref.changeDetectorRef.detectChanges();
  return hostElement;
}

describe('SiteTreeComponent', () => {
  it("is a nav drawn as the design system's site tree", () => {
    const el = render(SiteTreeComponent, 'nav');

    expect(el.classList).toContain('site-tree');
    expect(el.classList).not.toContain('site-tree--cards');
  });

  it('draws cards when cards', () => {
    const el = render(SiteTreeComponent, 'nav', { cards: true });

    expect(el.classList).toContain('site-tree--cards');
  });
});

describe('SiteTreeListComponent', () => {
  it('is a plain list, nested on request', () => {
    expect(render(SiteTreeListComponent, 'ul').classList).toContain('site-tree__list');
    expect(render(SiteTreeListComponent, 'ul', { nested: true }).classList).toContain(
      'site-tree__list--nested',
    );
  });
});

describe('SiteTreeLinkComponent', () => {
  it('is a link, the add item on request', () => {
    expect(render(SiteTreeLinkComponent, 'a').classList).toContain('site-tree__link');
    expect(render(SiteTreeLinkComponent, 'a', { add: true }).classList).toContain(
      'site-tree__link--add',
    );
  });
});

describe('SiteTreeGroupComponent', () => {
  it('is a group label', () => {
    expect(render(SiteTreeGroupComponent, 'span').classList).toContain('site-tree__group');
  });
});

describe('WebsiteShellComponent', () => {
  it('is the shell grid', () => {
    expect(render(WebsiteShellComponent, 'div').classList).toContain('website-shell');
  });
});
