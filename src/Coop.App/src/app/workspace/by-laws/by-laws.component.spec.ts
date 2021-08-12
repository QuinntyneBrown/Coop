import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByLawsComponent } from './by-laws.component';

describe('ByLawsComponent', () => {
  let component: ByLawsComponent;
  let fixture: ComponentFixture<ByLawsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByLawsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByLawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
