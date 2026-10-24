import { EnvironmentInjector, createComponent } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  it("is an ol drawn as the design system's breadcrumb", () => {
    const hostElement = document.createElement('ol');
    document.body.append(hostElement);
    const ref = createComponent(BreadcrumbComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
      hostElement,
    });
    ref.changeDetectorRef.detectChanges();

    expect(hostElement.classList).toContain('breadcrumb');
  });
});
