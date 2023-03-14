// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestCompletePopupComponent } from './maintenance-request-complete-popup.component';

describe('MaintenanceRequestCompletePopupComponent', () => {
  let component: MaintenanceRequestCompletePopupComponent;
  let fixture: ComponentFixture<MaintenanceRequestCompletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceRequestCompletePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRequestCompletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

