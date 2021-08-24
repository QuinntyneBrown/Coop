import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnCallStaffComponent } from './on-call-staff.component';

describe('OnCallStaffComponent', () => {
  let component: OnCallStaffComponent;
  let fixture: ComponentFixture<OnCallStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnCallStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnCallStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
