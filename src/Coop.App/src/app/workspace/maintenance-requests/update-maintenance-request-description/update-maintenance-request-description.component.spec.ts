// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMaintenanceRequestDescriptionComponent } from './update-maintenance-request-description.component';

describe('UpdateMaintenanceRequestDescriptionComponent', () => {
  let component: UpdateMaintenanceRequestDescriptionComponent;
  let fixture: ComponentFixture<UpdateMaintenanceRequestDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMaintenanceRequestDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMaintenanceRequestDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

