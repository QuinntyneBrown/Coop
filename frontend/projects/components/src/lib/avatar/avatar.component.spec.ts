import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { AvatarImageComponent } from './avatar-image.component';

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

describe('AvatarComponent', () => {
  it('is a medium avatar by default', () => {
    const el = render(AvatarComponent, 'span');

    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.classList).toContain('avatar');
    expect(el.classList).not.toContain('avatar--sm');
    expect(el.classList).not.toContain('avatar--lg');
    expect(el.classList).not.toContain('avatar--xl');
  });

  it('shows its size', () => {
    const el = render(AvatarComponent, 'span', { size: 'sm' });

    expect(el.classList).toContain('avatar--sm');
  });

  it('shows the large size', () => {
    const el = render(AvatarComponent, 'span', { size: 'lg' });

    expect(el.classList).toContain('avatar--lg');
  });

  it('shows the extra large size', () => {
    const el = render(AvatarComponent, 'span', { size: 'xl' });

    expect(el.classList).toContain('avatar--xl');
  });
});

describe('AvatarImageComponent', () => {
  it("is a img drawn as the design system's avatar picture", () => {
    const el = render(AvatarImageComponent, 'img');

    expect(el.tagName.toLowerCase()).toBe('img');
    expect(el.classList).toContain('avatar__img');
  });
});
