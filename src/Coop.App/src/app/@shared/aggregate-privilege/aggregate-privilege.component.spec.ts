import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregatePrivilegeComponent } from './aggregate-privilege.component';

describe('AggregatePrivilegeComponent', () => {
  let component: AggregatePrivilegeComponent;
  let fixture: ComponentFixture<AggregatePrivilegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggregatePrivilegeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregatePrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
