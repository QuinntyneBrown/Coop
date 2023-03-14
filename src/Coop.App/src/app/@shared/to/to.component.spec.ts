// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToComponent } from './to.component';

describe('ToComponent', () => {
  let component: ToComponent;
  let fixture: ComponentFixture<ToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

