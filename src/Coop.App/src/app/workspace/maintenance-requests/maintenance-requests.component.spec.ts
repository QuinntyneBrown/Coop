import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestsComponent } from './maintenance-requests.component';

describe('MaintenanceRequestsComponent', () => {
  let component: MaintenanceRequestsComponent;
  let fixture: ComponentFixture<MaintenanceRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
