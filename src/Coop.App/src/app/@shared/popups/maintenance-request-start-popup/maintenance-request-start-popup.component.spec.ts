import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestStartPopupComponent } from './maintenance-request-start-popup.component';

describe('MaintenanceRequestStartPopupComponent', () => {
  let component: MaintenanceRequestStartPopupComponent;
  let fixture: ComponentFixture<MaintenanceRequestStartPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceRequestStartPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRequestStartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
