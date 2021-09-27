import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnattendedUnitEntryAllowedComponent } from './unattended-unit-entry-allowed.component';

describe('UnattendedUnitEntryAllowedComponent', () => {
  let component: UnattendedUnitEntryAllowedComponent;
  let fixture: ComponentFixture<UnattendedUnitEntryAllowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnattendedUnitEntryAllowedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnattendedUnitEntryAllowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
