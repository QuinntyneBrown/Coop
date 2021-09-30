import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestReceivePopupComponent } from './maintenance-request-receive-popup.component';

describe('MaintenanceRequestReceivePopupComponent', () => {
  let component: MaintenanceRequestReceivePopupComponent;
  let fixture: ComponentFixture<MaintenanceRequestReceivePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceRequestReceivePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRequestReceivePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
