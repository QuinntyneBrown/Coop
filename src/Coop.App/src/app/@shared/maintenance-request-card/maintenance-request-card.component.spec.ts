import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestCardComponent } from './maintenance-request-card.component';

describe('MaintenanceRequestCardComponent', () => {
  let component: MaintenanceRequestCardComponent;
  let fixture: ComponentFixture<MaintenanceRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceRequestCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
