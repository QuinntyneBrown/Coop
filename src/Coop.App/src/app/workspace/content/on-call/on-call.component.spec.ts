import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnCallComponent } from './on-call.component';

describe('OnCallComponent', () => {
  let component: OnCallComponent;
  let fixture: ComponentFixture<OnCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
