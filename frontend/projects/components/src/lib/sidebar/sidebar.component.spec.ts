import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { SidebarBrandComponent } from './sidebar-brand.component';
import { SidebarNavComponent } from './sidebar-nav.component';
import { SidebarFooterComponent } from './sidebar-footer.component';
import { SidebarUserComponent } from './sidebar-user.component';
import { SidebarUserNameComponent } from './sidebar-user-name.component';
import { SidebarUserRoleComponent } from './sidebar-user-role.component';

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

describe('SidebarComponent', () => {
  it("is a aside drawn as the design system's sidebar", () => {
    const el = render(SidebarComponent, 'aside');

    expect(el.tagName.toLowerCase()).toBe('aside');
    expect(el.classList).toContain('sidebar');
  });
});

describe('SidebarBrandComponent', () => {
  it("is a a drawn as the design system's sidebar brand", () => {
    const el = render(SidebarBrandComponent, 'a');

    expect(el.tagName.toLowerCase()).toBe('a');
    expect(el.classList).toContain('sidebar__brand');
  });
});

describe('SidebarNavComponent', () => {
  it("is a nav drawn as the design system's sidebar navigation", () => {
    const el = render(SidebarNavComponent, 'nav');

    expect(el.tagName.toLowerCase()).toBe('nav');
    expect(el.classList).toContain('sidebar__nav');
  });
});

describe('SidebarFooterComponent', () => {
  it("is a div drawn as the design system's sidebar footer", () => {
    const el = render(SidebarFooterComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('sidebar__footer');
  });
});

describe('SidebarUserComponent', () => {
  it("is a div drawn as the design system's sidebar user", () => {
    const el = render(SidebarUserComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('sidebar__user');
  });
});

describe('SidebarUserNameComponent', () => {
  it("is a span drawn as the design system's sidebar user name", () => {
    const el = render(SidebarUserNameComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('sidebar__user-name');
  });
});

describe('SidebarUserRoleComponent', () => {
  it("is a span drawn as the design system's sidebar user role", () => {
    const el = render(SidebarUserRoleComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('sidebar__user-role');
  });
});
