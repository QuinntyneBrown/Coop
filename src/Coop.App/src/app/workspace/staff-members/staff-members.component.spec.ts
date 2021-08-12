import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffMembersComponent } from './staff-members.component';

describe('StaffMembersComponent', () => {
  let component: StaffMembersComponent;
  let fixture: ComponentFixture<StaffMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
