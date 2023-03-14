// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { OnCallService } from './on-call.service';

describe('OnCallService', () => {
  let service: OnCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

