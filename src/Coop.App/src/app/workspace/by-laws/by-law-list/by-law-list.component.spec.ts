// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByLawListComponent } from './by-law-list.component';

describe('ByLawListComponent', () => {
  let component: ByLawListComponent;
  let fixture: ComponentFixture<ByLawListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByLawListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByLawListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

