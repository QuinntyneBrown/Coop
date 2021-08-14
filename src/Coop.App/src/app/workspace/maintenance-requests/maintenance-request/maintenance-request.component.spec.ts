import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestComponent } from './maintenance-request.component';

describe('MaintenanceRequestComponent', () => {
  let component: MaintenanceRequestComponent;
  let fixture: ComponentFixture<MaintenanceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
