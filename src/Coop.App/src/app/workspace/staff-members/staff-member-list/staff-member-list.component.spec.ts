import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffMemberListComponent } from './staff-member-list.component';

describe('StaffMemberListComponent', () => {
  let component: StaffMemberListComponent;
  let fixture: ComponentFixture<StaffMemberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffMemberListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
