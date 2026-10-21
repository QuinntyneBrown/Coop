import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

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

describe('ButtonComponent', () => {
  it('is a native button with the secondary look by default', () => {
    const el = render(ButtonComponent, 'button');

    expect(el.tagName.toLowerCase()).toBe('button');
    expect(el.classList).toContain('btn');
    expect(el.classList).not.toContain('btn--primary');
    expect(el.classList).not.toContain('btn--danger');
    expect(el.classList).not.toContain('btn--ghost');
    expect(el.classList).not.toContain('btn--sm');
    expect(el.classList).not.toContain('btn--lg');
    expect(el.classList).not.toContain('btn--block');
    expect(el.classList).not.toContain('btn--icon');
  });

  it('shows its variant', () => {
    const el = render(ButtonComponent, 'button', { variant: 'primary' });

    expect(el.classList).toContain('btn--primary');
  });

  it('shows the danger variant', () => {
    const el = render(ButtonComponent, 'button', { variant: 'danger' });

    expect(el.classList).toContain('btn--danger');
    expect(el.classList).not.toContain('btn--primary');
  });

  it('shows the ghost variant', () => {
    const el = render(ButtonComponent, 'button', { variant: 'ghost' });

    expect(el.classList).toContain('btn--ghost');
  });

  it('shows its size', () => {
    const el = render(ButtonComponent, 'button', { size: 'lg' });

    expect(el.classList).toContain('btn--lg');
    expect(el.classList).not.toContain('btn--sm');
  });

  it('fills the width when block', () => {
    const el = render(ButtonComponent, 'button', { block: true });

    expect(el.classList).toContain('btn--block');
  });

  it('is square when it holds only an icon', () => {
    const el = render(ButtonComponent, 'button', { iconOnly: true });

    expect(el.classList).toContain('btn--icon');
  });

  it('can still be disabled natively', () => {
    const el = render(ButtonComponent, 'button');

    (el as HTMLButtonElement).disabled = true;
    expect((el as HTMLButtonElement).matches(':disabled')).toBe(true);
  });
});
