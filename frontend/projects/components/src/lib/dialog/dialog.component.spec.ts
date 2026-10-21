import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { DialogPanelComponent } from './dialog-panel.component';
import { DialogHeaderComponent } from './dialog-header.component';
import { DialogTitleComponent } from './dialog-title.component';
import { DialogBodyComponent } from './dialog-body.component';
import { DialogFooterComponent } from './dialog-footer.component';
import { DialogIconComponent } from './dialog-icon.component';

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

describe('DialogComponent', () => {
  it('is a native dialog that stays closed until the app opens it', () => {
    const el = render(DialogComponent, 'dialog');

    expect(el.tagName.toLowerCase()).toBe('dialog');
    expect(el.classList).toContain('dialog');
    expect((el as HTMLDialogElement).open).toBe(false);
  });
});

describe('DialogPanelComponent', () => {
  it("is a div drawn as the design system's dialog panel", () => {
    const el = render(DialogPanelComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('dialog__panel');
  });
});

describe('DialogHeaderComponent', () => {
  it("is a div drawn as the design system's dialog header", () => {
    const el = render(DialogHeaderComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('dialog__header');
  });
});

describe('DialogTitleComponent', () => {
  it("is a h2 drawn as the design system's dialog title", () => {
    const el = render(DialogTitleComponent, 'h2');

    expect(el.tagName.toLowerCase()).toBe('h2');
    expect(el.classList).toContain('dialog__title');
  });
});

describe('DialogBodyComponent', () => {
  it("is a div drawn as the design system's dialog body", () => {
    const el = render(DialogBodyComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('dialog__body');
  });
});

describe('DialogFooterComponent', () => {
  it("is a div drawn as the design system's dialog footer", () => {
    const el = render(DialogFooterComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('dialog__footer');
  });
});

describe('DialogIconComponent', () => {
  it('is the decorative danger icon', () => {
    const el = render(DialogIconComponent, 'div');

    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.classList).toContain('dialog__icon');
    expect(el.classList).toContain('dialog__icon--danger');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });
});
