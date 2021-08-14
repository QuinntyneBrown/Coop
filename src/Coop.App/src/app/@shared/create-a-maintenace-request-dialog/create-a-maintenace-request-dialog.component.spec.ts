import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAMaintenaceRequestDialogComponent } from './create-a-maintenace-request-dialog.component';

describe('CreateAMaintenaceRequestDialogComponent', () => {
  let component: CreateAMaintenaceRequestDialogComponent;
  let fixture: ComponentFixture<CreateAMaintenaceRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAMaintenaceRequestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAMaintenaceRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
