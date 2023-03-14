// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { PrivilegeService } from './privilege.service';

describe('PrivilegeService', () => {
  let service: PrivilegeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivilegeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

