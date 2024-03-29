// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEditorComponent } from './role-editor.component';

describe('RoleEditorComponent', () => {
  let component: RoleEditorComponent;
  let fixture: ComponentFixture<RoleEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

