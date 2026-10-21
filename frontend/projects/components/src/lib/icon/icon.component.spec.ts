import { TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';
import { IconName } from './icon-name';
import { IconSize } from './icon-size';

describe('IconComponent', () => {
  function render(name: IconName, size?: IconSize): SVGElement {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('libIcon', name);
    if (size) fixture.componentRef.setInput('size', size);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('is hidden from assistive technology, so the text beside it is the name', () => {
    const icon = render('add');

    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');
    expect(icon.classList).toContain('icon');
  });

  it('draws the icon it is given', () => {
    const icon = render('add');

    expect(icon.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(icon.querySelector('path')?.getAttribute('d')).toBe('M12 5v14M5 12h14');
  });

  it('sizes itself from its size input', () => {
    expect(render('add').classList).not.toContain('icon--sm');
    expect(render('add', 'sm').classList).toContain('icon--sm');
    expect(render('add', 'lg').classList).toContain('icon--lg');
  });
});
