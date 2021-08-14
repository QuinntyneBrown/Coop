import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestEditorComponent } from './maintenance-request-editor.component';

describe('MaintenanceRequestEditorComponent', () => {
  let component: MaintenanceRequestEditorComponent;
  let fixture: ComponentFixture<MaintenanceRequestEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceRequestEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRequestEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
