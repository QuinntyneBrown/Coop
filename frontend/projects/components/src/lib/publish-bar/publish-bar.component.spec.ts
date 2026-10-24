import { EnvironmentInjector, Type, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PreviewPaneFrameComponent } from '../preview-pane/preview-pane-frame.component';
import { PreviewPaneComponent } from '../preview-pane/preview-pane.component';
import { PublishBarActionsComponent } from './publish-bar-actions.component';
import { PublishBarTextComponent } from './publish-bar-text.component';
import { PublishBarComponent } from './publish-bar.component';

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

describe('PublishBarComponent', () => {
  it('is the neutral bar until there are changes', () => {
    const bar = render(PublishBarComponent, 'div');
    expect(bar.classList).toContain('publish-bar');
    expect(bar.classList).not.toContain('publish-bar--changes');
    expect(render(PublishBarComponent, 'div', { changes: true }).classList).toContain(
      'publish-bar--changes',
    );
  });

  it('has a text and an action row', () => {
    expect(render(PublishBarTextComponent, 'p').classList).toContain('publish-bar__text');
    expect(render(PublishBarActionsComponent, 'div').classList).toContain('publish-bar__actions');
  });
});

describe('PreviewPaneComponent', () => {
  it('is a pane with a frame', () => {
    expect(render(PreviewPaneComponent, 'section').classList).toContain('preview-pane');
    expect(render(PreviewPaneFrameComponent, 'iframe').classList).toContain('preview-pane__frame');
  });
});
