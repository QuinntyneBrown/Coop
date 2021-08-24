import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalInterestAndInformationComponent } from './rental-interest-and-information.component';

describe('RentalInterestAndInformationComponent', () => {
  let component: RentalInterestAndInformationComponent;
  let fixture: ComponentFixture<RentalInterestAndInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalInterestAndInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalInterestAndInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
